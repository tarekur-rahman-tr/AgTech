import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

const OTP_LIFETIME_MS = 2 * 60 * 1000
const RESEND_COOLDOWN_MS = 30 * 1000

function otpDigest(email: string, otp: string) {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not configured.')
  return createHmac('sha256', secret).update(`${email}:${otp}`).digest('hex')
}

function safeCompare(left: string, right: string) {
  const a = Buffer.from(left, 'hex')
  const b = Buffer.from(right, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = String(body?.action ?? '')
    const email = String(body?.email ?? '').trim().toLowerCase()

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 })
    }

    const payload = (await getPayloadClient()) as any

    if (action === 'send') {
      const apiKey = process.env.RESEND_API_KEY
      const testRecipient = process.env.RESEND_TEST_RECIPIENT?.trim().toLowerCase()

      if (!apiKey || !testRecipient) {
        return NextResponse.json(
          { message: 'Resend testing is not configured. Add RESEND_API_KEY and RESEND_TEST_RECIPIENT to .env.local.' },
          { status: 503 },
        )
      }

      // Resend's shared testing sender is restricted to the verified account owner.
      if (email !== testRecipient) {
        return NextResponse.json(
          { message: 'Testing mode can only send OTP to the verified Resend account email.' },
          { status: 403 },
        )
      }

      const found = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
        showHiddenFields: true,
      })
      const user = found.docs[0]

      // Keep the response generic so this endpoint does not reveal account existence.
      if (!user) {
        return NextResponse.json({ message: 'If this email belongs to an AgTech account, a verification code will be sent.' })
      }

      const now = Date.now()
      const lastSent = user.resetOtpLastSentAt ? new Date(user.resetOtpLastSentAt).getTime() : 0
      if (lastSent && now - lastSent < RESEND_COOLDOWN_MS) {
        return NextResponse.json(
          { message: 'Please wait 30 seconds before requesting another code.' },
          { status: 429 },
        )
      }

      const resetResult = await payload.forgotPassword({
        collection: 'users',
        data: { email },
        disableEmail: true,
      })
      const resetToken = typeof resetResult === 'string' ? resetResult : resetResult?.token
      if (!resetToken) {
        return NextResponse.json({ message: 'If this email belongs to an AgTech account, a verification code will be sent.' })
      }

      const otp = String(randomInt(0, 1_000_000)).padStart(6, '0')
      const expiresAt = new Date(now + OTP_LIFETIME_MS).toISOString()
      const sentAt = new Date(now).toISOString()

      const mailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AgTech <onboarding@resend.dev>',
          to: [email],
          subject: 'Your AgTech password reset code',
          html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#17251b"><h2>Reset your AgTech password</h2><p>Your 6-digit verification code is:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#287a45">${otp}</p><p>This code expires in 2 minutes. If you did not request this, you can ignore this email.</p></div>`,
        }),
      })

      if (!mailResponse.ok) {
        const details = await mailResponse.text()
        console.error('Resend email request failed:', details)
        return NextResponse.json(
          { message: 'Could not send the verification email. Check the Resend testing setup.' },
          { status: 502 },
        )
      }

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          resetOtpHash: otpDigest(email, otp),
          resetOtpExpiresAt: expiresAt,
          resetOtpLastSentAt: sentAt,
          resetOtpPayloadToken: resetToken,
        },
        overrideAccess: true,
      })

      return NextResponse.json({ message: 'A 6-digit verification code has been sent. It expires in 2 minutes.' })
    }

    if (action === 'reset') {
      const otp = String(body?.otp ?? '').trim()
      const password = String(body?.password ?? '')
      if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ message: 'Enter the 6-digit verification code.' }, { status: 400 })
      }
      if (password.length < 8) {
        return NextResponse.json({ message: 'Your new password must contain at least 8 characters.' }, { status: 400 })
      }

      const found = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
        showHiddenFields: true,
      })
      const user = found.docs[0]
      const expiresAt = user?.resetOtpExpiresAt ? new Date(user.resetOtpExpiresAt).getTime() : 0
      const storedHash = String(user?.resetOtpHash ?? '')
      const resetToken = String(user?.resetOtpPayloadToken ?? '')

      if (
        !user ||
        !storedHash ||
        !resetToken ||
        !expiresAt ||
        Date.now() > expiresAt ||
        !safeCompare(storedHash, otpDigest(email, otp))
      ) {
        return NextResponse.json(
          { message: 'The code is invalid or expired. Request a new code and try again.' },
          { status: 400 },
        )
      }

      await payload.resetPassword({
        collection: 'users',
        data: { token: resetToken, password },
      })

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          resetOtpHash: null,
          resetOtpExpiresAt: null,
          resetOtpLastSentAt: null,
          resetOtpPayloadToken: null,
        },
        overrideAccess: true,
      })

      return NextResponse.json({ message: 'Your password has been reset. You can now sign in.' })
    }

    return NextResponse.json({ message: 'Invalid password recovery action.' }, { status: 400 })
  } catch (error) {
    console.error('AgTech password recovery error:', error)
    return NextResponse.json(
      { message: 'Password recovery failed. Please try again.' },
      { status: 500 },
    )
  }
}
