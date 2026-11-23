import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const diagnosisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    isLeaf: { type: 'boolean' },
    imageQuality: { type: 'string', enum: ['good', 'fair', 'poor'] },
    crop: { type: 'string' },
    probableCondition: { type: 'string' },
    scientificName: { type: 'string' },
    confidence: { type: 'integer', minimum: 0, maximum: 100 },
    severity: { type: 'string', enum: ['low', 'moderate', 'high', 'uncertain'] },
    summary: { type: 'string' },
    visibleSymptoms: { type: 'array', items: { type: 'string' }, maxItems: 6 },
    recommendations: { type: 'array', items: { type: 'string' }, maxItems: 6 },
    alternatives: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    whenToEscalate: { type: 'string' },
    disclaimer: { type: 'string' },
  },
  required: [
    'isLeaf',
    'imageQuality',
    'crop',
    'probableCondition',
    'scientificName',
    'confidence',
    'severity',
    'summary',
    'visibleSymptoms',
    'recommendations',
    'alternatives',
    'whenToEscalate',
    'disclaimer',
  ],
} as const

export async function POST(request: Request) {
  const apiKey = process.env.APP_GEMINI_API_KEY
  const apiBaseURL = process.env.APP_GEMINI_API_BASE_URL
  if (!apiKey || !apiBaseURL) {
    return NextResponse.json({ error: 'Leaf analysis is not configured yet.' }, { status: 503 })
  }

  const formData = await request.formData()
  const image = formData.get('image')
  if (!(image instanceof File)) {
    return NextResponse.json({ error: 'Choose a leaf image to analyse.' }, { status: 400 })
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json({ error: 'Use a JPG, PNG or WebP image.' }, { status: 415 })
  }
  if (image.size === 0 || image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'The image must be smaller than 10 MB.' }, { status: 413 })
  }

  const encodedImage = Buffer.from(await image.arrayBuffer()).toString('base64')
  const prompt = [
    'You are an agricultural visual triage assistant for farmers in Bangladesh.',
    'Inspect only what is visibly supported by this image. First decide whether it clearly shows a crop leaf.',
    "If the image is not a leaf, is too blurry, too dark, too distant, or lacks enough visible detail, set isLeaf false or imageQuality poor, use probableCondition 'Unable to assess', keep confidence below 25, and clearly explain how to retake it.",
    'If assessable, identify the crop only when visually supportable, describe literal visible symptoms, and provide one probable condition plus plausible alternatives.',
    'Calibrate confidence conservatively. Do not claim laboratory certainty. Distinguish disease from nutrient, pest, water, sun, and physical damage when possible.',
    'Recommendations must start with low-risk actions. Do not prescribe restricted pesticides, exact chemical doses, or claim a cure. Recommend local label guidance and agronomist confirmation before chemical treatment.',
    'Use clear English suitable for a farmer. The disclaimer must state that this is AI-assisted visual guidance, not a confirmed diagnosis.',
  ].join(' ')

  try {
    const providerResponse = await fetch(
      `${apiBaseURL.replace(/\/$/, '')}/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inlineData: { mimeType: image.type, data: encodedImage } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1800,
            responseMimeType: 'application/json',
            responseJsonSchema: diagnosisSchema,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH',
            },
          ],
        }),
        signal: AbortSignal.timeout(45_000),
      },
    )

    if (!providerResponse.ok) {
      return NextResponse.json(
        { error: 'The analysis service is temporarily unavailable. Please try again shortly.' },
        { status: 502 },
      )
    }

    const providerData = await providerResponse.json()
    const content = providerData.candidates?.[0]?.content?.parts?.[0]?.text
    if (typeof content !== 'string') throw new Error('Missing analysis content')
    return NextResponse.json(JSON.parse(content), {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch {
    return NextResponse.json(
      { error: 'We could not analyse this image. Try a clearer photo in natural light.' },
      { status: 502 },
    )
  }
}
