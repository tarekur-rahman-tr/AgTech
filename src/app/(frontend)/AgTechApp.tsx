'use client'

import Image from 'next/image'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

type Page =
  | 'Home'
  | 'Dashboard'
  | 'Knowledge'
  | 'Disease'
  | 'Experts'
  | 'Marketplace'
  | 'Weather'
  | 'Profile'
  | 'Login'
type AccountRole = 'Farmer' | 'Agronomist' | 'Business'
type Theme = 'light' | 'dark'
type Language = 'en' | 'bn'
type IconName =
  | 'leaf'
  | 'arrow'
  | 'grid'
  | 'book'
  | 'scan'
  | 'users'
  | 'store'
  | 'cloud'
  | 'user'
  | 'search'
  | 'bell'
  | 'menu'
  | 'close'
  | 'upload'
  | 'sparkle'
  | 'rain'
  | 'sun'
  | 'wind'
  | 'drop'
  | 'message'
  | 'check'
  | 'star'
  | 'plus'
  | 'chevron'
  | 'location'
  | 'calendar'
  | 'camera'
  | 'moon'
  | 'globe'

const bangla: Record<string, string> = {
  Dashboard: 'ড্যাশবোর্ড',
  Knowledge: 'জ্ঞানকেন্দ্র',
  'AI Diagnosis': 'এআই রোগ নির্ণয়',
  Experts: 'বিশেষজ্ঞ',
  Marketplace: 'বাজার',
  Weather: 'আবহাওয়া',
  'My profile': 'আমার প্রোফাইল',
  'Sign in': 'সাইন ইন',
  'Join AgTech': 'AgTech-এ যোগ দিন',
  Notifications: 'নোটিফিকেশন',
  'Your latest updates': 'আপনার সর্বশেষ আপডেট',
  'Mark all read': 'সব পড়া হয়েছে',
  'Notification settings': 'নোটিফিকেশন সেটিংস',
  'BUILT FOR BANGLADESH': 'বাংলাদেশের জন্য নির্মিত',
  'Grow wiser.': 'বুদ্ধিমত্তায় চাষ করুন।',
  'Harvest better.': 'ভালো ফসল তুলুন।',
  'Field intelligence, trusted experts, fair markets and timely weather—brought together for the people who feed our nation.':
    'মাঠের তথ্য, বিশ্বস্ত বিশেষজ্ঞ, ন্যায্য বাজার ও সময়মতো আবহাওয়া—দেশের খাদ্য উৎপাদকদের জন্য একই প্ল্যাটফর্মে।',
  'Start farming smarter': 'স্মার্ট চাষ শুরু করুন',
  'Explore the platform': 'প্ল্যাটফর্ম দেখুন',
  'CHATTOGRAM, NOW': 'চট্টগ্রাম, এখন',
  'Partly cloudy': 'আংশিক মেঘলা',
  'FIELD CONDITION': 'মাঠের অবস্থা',
  'Ideal for irrigation': 'সেচের জন্য উপযোগী',
  'Next rain in 8 hours': 'পরবর্তী বৃষ্টি ৮ ঘণ্টায়',
  'SCROLL TO DISCOVER': 'আরও জানতে স্ক্রল করুন',
  '01 / THE PLATFORM': '০১ / প্ল্যাটফর্ম',
  'ONE CONNECTED FARMING ECOSYSTEM': 'একটি সমন্বিত কৃষি ব্যবস্থা',
  'Technology that understands': 'প্রযুক্তি যা বোঝে',
  'the land.': 'মাটিকে।',
  'AgTech transforms everyday farm decisions into clear, confident actions. Designed with Bangladeshi farmers, not just for them.':
    'AgTech প্রতিদিনের কৃষি সিদ্ধান্তকে স্পষ্ট ও আত্মবিশ্বাসী কাজে রূপ দেয়। বাংলাদেশের কৃষকদের সঙ্গে নিয়ে তৈরি।',
  'Discover our approach': 'আমাদের পদ্ধতি দেখুন',
  'AI crop diagnosis': 'এআই ফসল রোগ নির্ণয়',
  'Photograph a leaf. Understand the risk. Act before it spreads.':
    'পাতার ছবি তুলুন। ঝুঁকি বুঝুন। ছড়ানোর আগেই ব্যবস্থা নিন।',
  'Weather intelligence': 'আবহাওয়া বুদ্ধিমত্তা',
  'Hyper-local forecasts translated into practical farm advice.':
    'স্থানীয় পূর্বাভাস থেকে ব্যবহারিক কৃষি পরামর্শ।',
  'Fairer markets': 'ন্যায্য বাজার',
  'Sell directly, discover honest prices and build trusted relationships.':
    'সরাসরি বিক্রি করুন, ন্যায্য দাম জানুন এবং বিশ্বস্ত সম্পর্ক গড়ুন।',
  'Knowledge that grows': 'বাড়তে থাকা জ্ঞান',
  'Learn from agronomists and thousands of farmers across Bangladesh.':
    'সারা বাংলাদেশের কৃষিবিদ ও হাজারো কৃষকের কাছ থেকে শিখুন।',
  'LIVE FARM WEATHER': 'সরাসরি কৃষি আবহাওয়া',
  'Know what the sky': 'আকাশের পরিকল্পনা',
  'has planned.': 'আগেই জানুন।',
  'Field-ready weather intelligence for Chattogram and beyond.':
    'চট্টগ্রামসহ সারা দেশের জন্য মাঠ-উপযোগী আবহাওয়া তথ্য।',
  'View full forecast': 'সম্পূর্ণ পূর্বাভাস দেখুন',
  Humidity: 'আর্দ্রতা',
  Wind: 'বাতাস',
  Rainfall: 'বৃষ্টিপাত',
  '02 / MARKETPLACE': '০২ / বাজার',
  'FROM FIELD TO MARKET': 'মাঠ থেকে বাজারে',
  'Good produce deserves a': 'ভালো ফসলের প্রাপ্য',
  'fair price.': 'ন্যায্য দাম।',
  'Connect directly with buyers and sellers. Fewer barriers, transparent prices, stronger rural livelihoods.':
    'ক্রেতা ও বিক্রেতার সঙ্গে সরাসরি যুক্ত হন। কম বাধা, স্বচ্ছ দাম ও শক্তিশালী গ্রামীণ জীবিকা।',
  'Today’s tomato price': 'আজকের টমেটোর দাম',
  '+4.8% this week': 'এই সপ্তাহে +৪.৮%',
  'Explore the marketplace': 'বাজার দেখুন',
  '“The weather alert helped me protect my seedlings before the storm. Now I check AgTech every morning.”':
    '“আবহাওয়ার সতর্কতা ঝড়ের আগে আমার চারা রক্ষা করতে সাহায্য করেছে। এখন আমি প্রতিদিন সকালে AgTech দেখি।”',
  'Rice farmer · Cumilla': 'ধানচাষি · কুমিল্লা',
  'Meet the community': 'কমিউনিটির সঙ্গে পরিচিত হন',
  'MONDAY, 24 JUNE': 'সোমবার, ২৪ জুন',
  'Good morning, Rahim.': 'সুপ্রভাত, রহিম।',
  'Your farm is healthy. One field needs attention today.':
    'আপনার খামার সুস্থ আছে। আজ একটি জমিতে নজর দেওয়া দরকার।',
  'AGRONOMIST WORKSPACE': 'কৃষিবিদ কর্মক্ষেত্র',
  'Good morning, Dr. Akter.': 'সুপ্রভাত, ড. আক্তার।',
  'You have 3 consultations and 6 farmer questions waiting today.':
    'আজ আপনার জন্য ৩টি পরামর্শ ও ৬টি কৃষকের প্রশ্ন অপেক্ষা করছে।',
  'BUSINESS WORKSPACE': 'ব্যবসায়িক কর্মক্ষেত্র',
  'Welcome back, Bengal Foods.': 'স্বাগতম, বেঙ্গল ফুডস।',
  'Track sourcing, farmer inquiries and active marketplace orders.':
    'সংগ্রহ, কৃষকের জিজ্ঞাসা ও সক্রিয় বাজার অর্ডার অনুসরণ করুন।',
  'KNOWLEDGE HUB': 'জ্ঞানকেন্দ্র',
  'Knowledge grows when shared.': 'ভাগ করলে জ্ঞান বাড়ে।',
  'Practical answers from farmers, field experts and agronomists across Bangladesh.':
    'বাংলাদেশের কৃষক, মাঠ বিশেষজ্ঞ ও কৃষিবিদদের কাছ থেকে ব্যবহারিক উত্তর।',
  'AI DISEASE DETECTION': 'এআই রোগ শনাক্তকরণ',
  'See the problem. Protect the harvest.': 'সমস্যা দেখুন। ফসল রক্ষা করুন।',
  'Upload a clear leaf photo for an AI-assisted diagnosis and practical treatment guidance.':
    'এআই-সহায়ক বিশ্লেষণ ও ব্যবহারিক করণীয় পেতে পাতার পরিষ্কার ছবি দিন।',
  'AGRONOMIST DIRECTORY': 'কৃষিবিদ তালিকা',
  'Expert advice, rooted in experience.': 'অভিজ্ঞতাভিত্তিক বিশেষজ্ঞ পরামর্শ।',
  'Speak with verified agricultural professionals who understand local crops and conditions.':
    'স্থানীয় ফসল ও পরিবেশ বোঝেন এমন যাচাইকৃত কৃষি বিশেষজ্ঞের সঙ্গে কথা বলুন।',
  'AGRICULTURAL MARKETPLACE': 'কৃষি বাজার',
  'From good fields to fair markets.': 'ভালো মাঠ থেকে ন্যায্য বাজারে।',
  'Buy and sell produce, farm inputs and equipment with trusted people nearby.':
    'কাছাকাছি বিশ্বস্ত মানুষের সঙ্গে ফসল, কৃষি উপকরণ ও যন্ত্রপাতি কিনুন ও বিক্রি করুন।',
  'WEATHER INTELLIGENCE': 'আবহাওয়া বুদ্ধিমত্তা',
  'Read the sky. Plan the field.': 'আকাশ বুঝুন। মাঠের পরিকল্পনা করুন।',
  PLATFORM: 'প্ল্যাটফর্ম',
  'MARKET & WEATHER': 'বাজার ও আবহাওয়া',
  'STAY INFORMED': 'আপডেট থাকুন',
  'Farm alerts and weekly guidance.': 'কৃষি সতর্কতা ও সাপ্তাহিক নির্দেশনা।',
  'Mobile or email': 'মোবাইল বা ইমেইল',
}

const LanguageContext = createContext<Language>('en')

function useTranslation() {
  const language = useContext(LanguageContext)
  return (text: string) => (language === 'bn' ? (bangla[text] ?? text) : text)
}

const nav: { label: string; page: Page }[] = [
  { label: 'Dashboard', page: 'Dashboard' },
  { label: 'Knowledge', page: 'Knowledge' },
  { label: 'AI Diagnosis', page: 'Disease' },
  { label: 'Experts', page: 'Experts' },
  { label: 'Marketplace', page: 'Marketplace' },
  { label: 'Weather', page: 'Weather' },
]

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const p: Record<IconName, ReactNode> = {
    leaf: (
      <>
        <path d="M20 4C11 4 5 7.5 5 13a6 6 0 0 0 6 6c6 0 9-7 9-15Z" />
        <path d="M4 21c3-6 7-9 12-12" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h15" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    book: (
      <>
        <path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2V5Z" />
        <path d="M20 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2V5Z" />
      </>
    ),
    scan: (
      <>
        <path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5" />
        <path d="M8 13c2-5 6-6 9-5-1 5-4 8-9 5Z" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
        <path d="M8 20v-6h8v6M3 10c0 2 3 3 4.5 1 1.5 2 4.5 2 6 0 1.5 2 4.5 1 4.5-1" />
      </>
    ),
    cloud: <path d="M6 18h12a4 4 0 0 0 0-8 6 6 0 0 0-11.6-1.5A4.8 4.8 0 0 0 6 18Z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m5 5 14 14M19 5 5 19" />,
    upload: (
      <>
        <path d="M12 16V4m0 0L7 9m5-5 5 5" />
        <path d="M4 16v4h16v-4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 2 1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    rain: (
      <>
        <path d="M6 15h12a4 4 0 0 0 0-8 6 6 0 0 0-11.6-1A4.8 4.8 0 0 0 6 15Z" />
        <path d="m8 19-1 2m5-2-1 2m5-2-1 2" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    wind: (
      <>
        <path d="M3 8h12c3 0 3-4 0-4-1.5 0-2 .8-2.5 1.5M3 12h16c3 0 3 4 0 4-1.5 0-2-.8-2.5-1.5M3 16h8" />
      </>
    ),
    drop: <path d="M12 2S6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12Z" />,
    message: <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-5a9 9 0 1 1 18-5Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    star: <path d="m12 2 3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3-5.9 3 1.1-6.4L2.5 9 9 8l3-6Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h4l2-3h4l2 3h4v13H4V7Z" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p[name]}
    </svg>
  )
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <button className={`logo ${dark ? 'logo-dark' : ''}`} aria-label="AgTech home">
      <span>
        <Icon name="leaf" size={19} />
      </span>
      <b>AgTech</b>
    </button>
  )
}

function Header({
  page,
  go,
  role,
  theme,
  language,
  onToggleTheme,
  onToggleLanguage,
  isAuthenticated,
  onSignOut,
}: {
  page: Page
  go: (p: Page) => void
  role: AccountRole
  theme: Theme
  language: Language
  onToggleTheme: () => void
  onToggleLanguage: () => void
  isAuthenticated: boolean
  onSignOut: () => void
}) {
  const t = useTranslation()
  const [open, setOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const roleNotifications: Record<
    AccountRole,
    { id: number; icon: IconName; title: string; detail: string; time: string; page: Page }[]
  > = {
    Farmer: [
      {
        id: 1,
        icon: 'rain',
        title: 'Heavy rain expected tonight',
        detail: 'Secure equipment and delay fertilizer application.',
        time: '8 min',
        page: 'Weather',
      },
      {
        id: 2,
        icon: 'scan',
        title: 'Crop health alert',
        detail: 'Early leaf stress detected in East Ridge.',
        time: '34 min',
        page: 'Disease',
      },
      {
        id: 3,
        icon: 'message',
        title: 'Dr. Farhana replied',
        detail: 'Your rice pest question has a new expert answer.',
        time: '1 hr',
        page: 'Knowledge',
      },
      {
        id: 4,
        icon: 'store',
        title: 'New buyer inquiry',
        detail: 'Bengal Foods asked about your Aman rice listing.',
        time: '3 hr',
        page: 'Marketplace',
      },
    ],
    Agronomist: [
      {
        id: 1,
        icon: 'calendar',
        title: 'Consultation starts soon',
        detail: 'Video call with Md. Rahim begins at 10:30 AM.',
        time: '5 min',
        page: 'Dashboard',
      },
      {
        id: 2,
        icon: 'scan',
        title: 'Diagnosis needs review',
        detail: 'A tomato early blight result is awaiting confirmation.',
        time: '22 min',
        page: 'Disease',
      },
      {
        id: 3,
        icon: 'message',
        title: 'Urgent farmer question',
        detail: 'Brown spots reported after heavy rain in Bogura.',
        time: '46 min',
        page: 'Knowledge',
      },
      {
        id: 4,
        icon: 'star',
        title: 'New consultation review',
        detail: 'Abdul Karim rated your guidance 5 stars.',
        time: '2 hr',
        page: 'Profile',
      },
    ],
    Business: [
      {
        id: 1,
        icon: 'store',
        title: 'New supplier offer',
        detail: 'Rahim Agro Farm offered 800 kg of Aman rice.',
        time: '12 min',
        page: 'Marketplace',
      },
      {
        id: 2,
        icon: 'check',
        title: 'Order milestone reached',
        detail: 'Aman rice order is now 68% fulfilled.',
        time: '40 min',
        page: 'Dashboard',
      },
      {
        id: 3,
        icon: 'message',
        title: 'Farmer sent a message',
        detail: 'Nusrat Jahan responded to your tomato request.',
        time: '1 hr',
        page: 'Marketplace',
      },
      {
        id: 4,
        icon: 'rain',
        title: 'Supply weather advisory',
        detail: 'Heavy rain may affect Chattogram deliveries.',
        time: '3 hr',
        page: 'Weather',
      },
    ],
  }
  const notifications = roleNotifications[role]
  const [readByRole, setReadByRole] = useState<Record<AccountRole, number[]>>({
    Farmer: [4],
    Agronomist: [4],
    Business: [4],
  })
  const unreadCount = notifications.filter((item) => !readByRole[role].includes(item.id)).length

  useEffect(() => {
    if (!notificationsOpen) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [notificationsOpen])

  const openNotification = (item: (typeof notifications)[number]) => {
    setReadByRole((current) => ({
      ...current,
      [role]: current[role].includes(item.id) ? current[role] : [...current[role], item.id],
    }))
    setNotificationsOpen(false)
    go(item.page)
  }
  const onHome = page === 'Home'
  return (
    <header className={`site-header ${onHome ? 'over-hero' : ''}`}>
      <Logo dark={!onHome} />
      <nav className={open ? 'open' : ''}>
        {nav.map((n) => (
          <button
            key={n.page}
            className={page === n.page ? 'active' : ''}
            onClick={() => {
              go(n.page)
              setOpen(false)
            }}
          >
            {t(n.label)}
          </button>
        ))}
        <button className="mobile-only" onClick={() => go('Profile')}>
          {t('My profile')}
        </button>
      </nav>
      <div className="nav-actions">
        {!onHome && (
          <div className="notification-wrap">
            <button
              className={`round-btn ${notificationsOpen ? 'active' : ''}`}
              aria-label={`${unreadCount} unread notifications`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Icon name="bell" size={18} />
              {unreadCount > 0 && <b>{unreadCount}</b>}
            </button>
            {notificationsOpen && (
              <div className="notification-popover">
                <div className="notification-head">
                  <div>
                    <span>{t('Notifications').toUpperCase()}</span>
                    <h3>{t('Your latest updates')}</h3>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() =>
                        setReadByRole((current) => ({
                          ...current,
                          [role]: notifications.map((item) => item.id),
                        }))
                      }
                    >
                      {t('Mark all read')}
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.map((item) => {
                    const isUnread = !readByRole[role].includes(item.id)
                    return (
                      <button
                        className={isUnread ? 'unread' : ''}
                        key={item.id}
                        onClick={() => openNotification(item)}
                      >
                        <span className={`notification-icon n-${item.icon}`}>
                          <Icon name={item.icon} size={18} />
                        </span>
                        <p>
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                          <time>{item.time} ago</time>
                        </p>
                        {isUnread && <i />}
                      </button>
                    )
                  })}
                </div>
                <div className="notification-footer">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false)
                      go('Profile')
                    }}
                  >
                    {t('Notification settings')}
                  </button>
                  <span>{unreadCount ? `${unreadCount} unread` : 'You’re all caught up'}</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="preference-controls">
          <button
            className="preference-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            <span>
              {theme === 'dark'
                ? language === 'bn'
                  ? 'লাইট'
                  : 'Light'
                : language === 'bn'
                  ? 'ডার্ক'
                  : 'Dark'}
            </span>
          </button>
          <button
            className="preference-btn language-btn"
            onClick={onToggleLanguage}
            aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            title={language === 'bn' ? 'English' : 'বাংলা'}
          >
            <Icon name="globe" size={16} />
            <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>
        </div>
        {!isAuthenticated ? (
          <button className={onHome ? 'ghost-light' : 'ghost-dark'} onClick={() => go('Login')}>
            {t('Sign in')}
          </button>
        ) : (
          <button className={onHome ? 'ghost-light' : 'ghost-dark'} onClick={onSignOut}>
            Sign out
          </button>
        )}
        <button
          className="lime-btn small account-chip"
          onClick={() => go(isAuthenticated ? 'Profile' : 'Login')}
          title={isAuthenticated ? `${role} account` : t('Join AgTech')}
        >
          {isAuthenticated
            ? role === 'Farmer'
              ? 'MR'
              : role === 'Agronomist'
                ? 'DA'
                : 'BF'
            : 'Join AgTech'}
        </button>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  )
}

function Button({
  children,
  onClick,
  light = false,
}: {
  children: ReactNode
  onClick?: () => void
  light?: boolean
}) {
  return (
    <button className={light ? 'outline-btn' : 'lime-btn'} onClick={onClick}>
      {children}
    </button>
  )
}

function Home({ go }: { go: (p: Page) => void }) {
  const t = useTranslation()
  return (
    <div className="home">
      <section className="cinematic-hero">
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="kicker">
            <i /> {t('BUILT FOR BANGLADESH')}
          </span>
          <h1>
            {t('Grow wiser.')}
            <br />
            <em>{t('Harvest better.')}</em>
          </h1>
          <p>
            {t(
              'Field intelligence, trusted experts, fair markets and timely weather—brought together for the people who feed our nation.',
            )}
          </p>
          <div className="hero-actions">
            <Button onClick={() => go('Login')}>
              {t('Start farming smarter')} <Icon name="arrow" />
            </Button>
            <Button light onClick={() => go('Dashboard')}>
              {t('Explore the platform')}
            </Button>
          </div>
        </div>
        <div className="hero-weather glass">
          <span className="weather-symbol">
            <Icon name="sun" size={28} />
          </span>
          <div>
            <small>{t('CHATTOGRAM, NOW')}</small>
            <strong>28°</strong>
            <p>{t('Partly cloudy')}</p>
          </div>
          <span className="hero-rule" />
          <div>
            <small>{t('FIELD CONDITION')}</small>
            <b>{t('Ideal for irrigation')}</b>
            <p>{t('Next rain in 8 hours')}</p>
          </div>
        </div>
        <div className="scroll-cue">
          <span /> {t('SCROLL TO DISCOVER')}
        </div>
      </section>

      <section className="intro editorial">
        <span className="section-no">{t('01 / THE PLATFORM')}</span>
        <div>
          <p className="eyebrow">{t('ONE CONNECTED FARMING ECOSYSTEM')}</p>
          <h2>
            {t('Technology that understands')} <em>{t('the land.')}</em>
          </h2>
        </div>
        <div className="intro-copy">
          <p>
            {t(
              'AgTech transforms everyday farm decisions into clear, confident actions. Designed with Bangladeshi farmers, not just for them.',
            )}
          </p>
          <button onClick={() => go('Dashboard')}>
            {t('Discover our approach')} <Icon name="arrow" />
          </button>
        </div>
      </section>

      <section className="feature-story">
        <div className="story-image">
          <Image
            src="/agtech-field.svg"
            alt="Aerial view of a thriving agricultural field"
            width={2047}
            height={1150}
            unoptimized
          />
          <span className="image-caption">RANGPUR DIVISION · AMAN SEASON</span>
        </div>
        <div className="story-cards">
          {[
            [
              '01',
              'AI crop diagnosis',
              'Photograph a leaf. Understand the risk. Act before it spreads.',
              'Disease',
            ],
            [
              '02',
              'Weather intelligence',
              'Hyper-local forecasts translated into practical farm advice.',
              'Weather',
            ],
            [
              '03',
              'Fairer markets',
              'Sell directly, discover honest prices and build trusted relationships.',
              'Marketplace',
            ],
            [
              '04',
              'Knowledge that grows',
              'Learn from agronomists and thousands of farmers across Bangladesh.',
              'Knowledge',
            ],
          ].map(([n, title, text, target]) => (
            <button key={n} onClick={() => go(target as Page)}>
              <span>{n}</span>
              <div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="weather-band">
        <div className="weather-title">
          <span className="kicker">
            <i /> {t('LIVE FARM WEATHER')}
          </span>
          <h2>
            {t('Know what the sky')}
            <br />
            {t('has planned.')}
          </h2>
          <p>{t('Field-ready weather intelligence for Chattogram and beyond.')}</p>
          <button onClick={() => go('Weather')}>
            {t('View full forecast')} <Icon name="arrow" />
          </button>
        </div>
        <div className="weather-main">
          <span>MON, 24 JUNE</span>
          <div>
            <Icon name="sun" size={72} />
            <strong>28°</strong>
          </div>
          <h3>{t('Partly cloudy')}</h3>
          <p>Feels like 30° · High 31°</p>
        </div>
        <div className="weather-details">
          <div>
            <Icon name="drop" />
            <span>
              {t('Humidity')}
              <strong>75%</strong>
            </span>
          </div>
          <div>
            <Icon name="wind" />
            <span>
              {t('Wind')}
              <strong>12 km/h</strong>
            </span>
          </div>
          <div>
            <Icon name="rain" />
            <span>
              {t('Rainfall')}
              <strong>38%</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="market-preview">
        <div className="market-photo">
          <Image
            src="/agtech-market.svg"
            alt="Fresh tomatoes passed between farmers"
            width={2046}
            height={1364}
            unoptimized
          />
        </div>
        <div className="market-copy">
          <span className="section-no">{t('02 / MARKETPLACE')}</span>
          <p className="eyebrow">{t('FROM FIELD TO MARKET')}</p>
          <h2>
            {t('Good produce deserves a')} <em>{t('fair price.')}</em>
          </h2>
          <p>
            {t(
              'Connect directly with buyers and sellers. Fewer barriers, transparent prices, stronger rural livelihoods.',
            )}
          </p>
          <div className="market-stat">
            <strong>৳42</strong>
            <span>
              {t('Today’s tomato price')}
              <br />
              <b>{t('+4.8% this week')}</b>
            </span>
          </div>
          <Button onClick={() => go('Marketplace')}>
            {t('Explore the marketplace')} <Icon name="arrow" />
          </Button>
        </div>
      </section>

      <section className="community-quote">
        <Icon name="message" size={34} />
        <blockquote>
          {t(
            '“The weather alert helped me protect my seedlings before the storm. Now I check AgTech every morning.”',
          )}
        </blockquote>
        <div>
          <span className="avatar photo">AR</span>
          <p>
            <strong>Abdul Rahman</strong>
            <small>{t('Rice farmer · Cumilla')}</small>
          </p>
        </div>
        <button onClick={() => go('Knowledge')}>
          {t('Meet the community')} <Icon name="arrow" />
        </button>
      </section>
      <Footer go={go} />
    </div>
  )
}

function PageTop({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string
  title: string
  text: string
  action?: ReactNode
}) {
  const t = useTranslation()
  return (
    <div className="page-top">
      <div>
        <span>{t(eyebrow)}</span>
        <h1>{t(title)}</h1>
        <p>{t(text)}</p>
      </div>
      {action}
    </div>
  )
}

const fields = [
  { name: 'North Meadow', crop: 'Aman rice', area: '8.6 ha', health: 94 },
  { name: 'East Ridge', crop: 'Tomato', area: '4.2 ha', health: 76 },
  { name: 'River Plot', crop: 'Wheat', area: '6.8 ha', health: 88 },
]

function Dashboard({
  go,
  notify,
  role,
}: {
  go: (p: Page) => void
  notify: (s: string) => void
  role: AccountRole
}) {
  if (role === 'Agronomist') return <AgronomistDashboard go={go} notify={notify} />
  if (role === 'Business') return <BusinessDashboard go={go} notify={notify} />
  return (
    <PageFrame dark className="cinematic-dashboard">
      <PageTop
        eyebrow="MONDAY, 24 JUNE"
        title="Good morning, Rahim."
        text="Your farm is healthy. One field needs attention today."
        action={
          <Button onClick={() => notify('New field setup is ready.')}>
            <Icon name="plus" /> Add field
          </Button>
        }
      />
      <div className="metric-grid">
        {[
          ['19.6 ha', 'Land cultivated', '+8.4%'],
          ['03', 'Active crops', 'On schedule'],
          ['86%', 'Average health', '+3.2%'],
          ['32.4 t', 'Yield forecast', 'This season'],
        ].map((m) => (
          <article className="metric" key={m[1]}>
            <span>{m[1]}</span>
            <strong>{m[0]}</strong>
            <small>{m[2]}</small>
          </article>
        ))}
      </div>
      <div className="dashboard-layout">
        <section className="panel wide">
          <div className="panel-head">
            <div>
              <span>FIELD OVERVIEW</span>
              <h2>Your crops at a glance</h2>
            </div>
            <button>
              View all <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="field-table">
            {fields.map((f, i) => (
              <button key={f.name}>
                <span className={`field-icon f${i}`}>
                  <Icon name="leaf" />
                </span>
                <span>
                  <strong>{f.name}</strong>
                  <small>
                    {f.crop} · {f.area}
                  </small>
                </span>
                <span className="bar">
                  <i style={{ width: `${f.health}%` }} />
                </span>
                <b>{f.health}%</b>
                <Icon name="chevron" />
              </button>
            ))}
          </div>
        </section>
        <section className="panel compact-weather" onClick={() => go('Weather')}>
          <div className="panel-head">
            <div>
              <span>WEATHER NOW</span>
              <h2>Chattogram</h2>
            </div>
            <Icon name="chevron" />
          </div>
          <div className="weather-lock">
            <Icon name="sun" size={50} />
            <strong>28°</strong>
          </div>
          <p>Partly cloudy · Feels like 30°</p>
          <div className="mini-facts">
            <span>
              <Icon name="drop" /> 75%
            </span>
            <span>
              <Icon name="wind" /> 12 km/h
            </span>
          </div>
          <div className="alert">Rain expected after 7 PM</div>
        </section>
        <section className="ai-banner">
          <div>
            <span>
              <Icon name="sparkle" /> AGTECH AI INSIGHT
            </span>
            <h2>Early signs of leaf stress detected</h2>
            <p>East Ridge may need your attention. Review the scan before your next irrigation.</p>
            <button onClick={() => go('Disease')}>
              Review diagnosis <Icon name="arrow" />
            </button>
          </div>
          <span className="scan-orb">
            <Icon name="scan" size={38} />
          </span>
        </section>
        <section className="panel discussions">
          <div className="panel-head">
            <div>
              <span>COMMUNITY</span>
              <h2>Recent discussions</h2>
            </div>
            <button onClick={() => go('Knowledge')}>
              View hub <Icon name="arrow" size={16} />
            </button>
          </div>
          {[
            'Best time to apply urea after rain?',
            'How I controlled brown planthopper',
            'Tomato prices in Chattogram today',
          ].map((x, i) => (
            <div className="discussion" key={x}>
              <span className="avatar">F{i + 1}</span>
              <p>
                <strong>{x}</strong>
                <small>
                  {12 + i * 7} replies · {i + 1}h ago
                </small>
              </p>
            </div>
          ))}
        </section>
      </div>
    </PageFrame>
  )
}

function AgronomistDashboard({
  go,
  notify,
}: {
  go: (p: Page) => void
  notify: (s: string) => void
}) {
  const consultations = [
    ['Md. Rahim Uddin', 'Tomato leaf disease', '10:30 AM', 'Video call'],
    ['Nusrat Jahan', 'Soil nutrient guidance', '1:15 PM', 'Chat'],
    ['Abdul Karim', 'Rice pest management', '4:00 PM', 'Video call'],
  ]
  return (
    <PageFrame dark className="cinematic-dashboard">
      <PageTop
        eyebrow="AGRONOMIST WORKSPACE"
        title="Good morning, Dr. Akter."
        text="You have 3 consultations and 6 farmer questions waiting today."
        action={
          <Button onClick={() => notify('Your availability calendar is open.')}>
            <Icon name="calendar" /> Manage availability
          </Button>
        }
      />
      <div className="metric-grid">
        {[
          ['03', 'Today’s consultations', 'Next at 10:30 AM'],
          ['06', 'Open farmer questions', '2 marked urgent'],
          ['4.9', 'Expert rating', '126 consultations'],
          ['94%', 'Response rate', 'Within 2 hours'],
        ].map((m) => (
          <article className="metric" key={m[1]}>
            <span>{m[1]}</span>
            <strong>{m[0]}</strong>
            <small>{m[2]}</small>
          </article>
        ))}
      </div>
      <div className="role-dashboard">
        <section className="panel role-main">
          <div className="panel-head">
            <div>
              <span>TODAY’S SCHEDULE</span>
              <h2>Upcoming consultations</h2>
            </div>
            <button>
              View calendar <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="consultation-list">
            {consultations.map((c, i) => (
              <article key={c[0]}>
                <span className={`avatar portrait p${i}`}>{c[0][0]}</span>
                <p>
                  <strong>{c[0]}</strong>
                  <small>
                    {c[1]} · {c[3]}
                  </small>
                </p>
                <time>{c[2]}</time>
                <button onClick={() => notify(`Consultation with ${c[0]} opened.`)}>Open</button>
              </article>
            ))}
          </div>
        </section>
        <aside className="panel expert-status">
          <span className="panel-label">AVAILABILITY</span>
          <div className="status-ring">
            <Icon name="check" size={28} />
          </div>
          <h3>You’re available</h3>
          <p>Farmers can request a consultation until 6:00 PM.</p>
          <button onClick={() => notify('Availability status updated.')}>Change status</button>
        </aside>
        <section className="panel farmer-questions">
          <div className="panel-head">
            <div>
              <span>EXPERT ANSWERS</span>
              <h2>Questions needing your guidance</h2>
            </div>
            <button onClick={() => go('Knowledge')}>
              Knowledge Hub <Icon name="arrow" size={16} />
            </button>
          </div>
          {[
            ['Brown spots after heavy rain', 'Rice · Bogura', 'URGENT'],
            ['When should I apply potash?', 'Tomato · Jashore', 'NEW'],
            ['Safe organic control for aphids', 'Brinjal · Cumilla', 'NEW'],
          ].map((q) => (
            <button key={q[0]}>
              <span>
                <Icon name="message" />
              </span>
              <p>
                <strong>{q[0]}</strong>
                <small>{q[1]}</small>
              </p>
              <i>{q[2]}</i>
              <Icon name="chevron" />
            </button>
          ))}
        </section>
        <section className="ai-banner expert-ai">
          <div>
            <span>
              <Icon name="sparkle" /> AI-ASSISTED REVIEW
            </span>
            <h2>4 diagnosis reports need confirmation</h2>
            <p>Review AI disease predictions and help farmers take the right next step.</p>
            <button onClick={() => go('Disease')}>
              Review reports <Icon name="arrow" />
            </button>
          </div>
          <span className="scan-orb">
            <Icon name="scan" size={38} />
          </span>
        </section>
      </div>
    </PageFrame>
  )
}

function BusinessDashboard({ go, notify }: { go: (p: Page) => void; notify: (s: string) => void }) {
  return (
    <PageFrame dark className="cinematic-dashboard">
      <PageTop
        eyebrow="BUSINESS WORKSPACE"
        title="Welcome back, Bengal Foods."
        text="Track sourcing, farmer inquiries and active marketplace orders."
        action={
          <Button onClick={() => notify('New purchase request opened.')}>
            <Icon name="plus" /> Post buying request
          </Button>
        }
      />
      <div className="metric-grid">
        {[
          ['18', 'Active orders', '৳2.8L total value'],
          ['07', 'Farmer inquiries', '3 new today'],
          ['12.4 t', 'Produce sourced', 'This month'],
          ['96%', 'Fulfilment rate', '+4.2% this quarter'],
        ].map((m) => (
          <article className="metric" key={m[1]}>
            <span>{m[1]}</span>
            <strong>{m[0]}</strong>
            <small>{m[2]}</small>
          </article>
        ))}
      </div>
      <div className="role-dashboard business-board">
        <section className="panel role-main">
          <div className="panel-head">
            <div>
              <span>PROCUREMENT</span>
              <h2>Active sourcing orders</h2>
            </div>
            <button onClick={() => go('Marketplace')}>
              Marketplace <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="order-list">
            {[
              ['Aman rice', '5,000 kg', '৳3,25,000', '68% fulfilled'],
              ['Fresh tomato', '1,200 kg', '৳48,000', '42% fulfilled'],
              ['Mustard seed', '800 kg', '৳1,44,000', 'Awaiting sellers'],
            ].map((o, i) => (
              <article key={o[0]}>
                <span className={`listing-visual l${i}`}>
                  <Icon name="leaf" />
                </span>
                <p>
                  <strong>{o[0]}</strong>
                  <small>
                    {o[1]} · {o[3]}
                  </small>
                </p>
                <b>{o[2]}</b>
                <button>
                  Manage <Icon name="chevron" size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <aside className="panel business-summary">
          <span className="panel-label">MONTHLY SPEND</span>
          <strong>৳8,42,500</strong>
          <p>Across 34 verified farm suppliers</p>
          <div className="spend-chart">
            {[35, 58, 44, 72, 60, 86, 76].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <small>18% higher than last month</small>
        </aside>
        <section className="panel supplier-list">
          <div className="panel-head">
            <div>
              <span>TRUSTED NETWORK</span>
              <h2>Top farm suppliers</h2>
            </div>
            <button>
              View all <Icon name="arrow" size={16} />
            </button>
          </div>
          {[
            ['Rahim Agro Farm', 'Chattogram', '98%'],
            ['Karim Rice Fields', 'Bogura', '96%'],
            ['Jahan Vegetables', 'Jashore', '94%'],
          ].map((s, i) => (
            <div key={s[0]}>
              <span className="avatar">F{i + 1}</span>
              <p>
                <strong>{s[0]}</strong>
                <small>{s[1]} · Verified supplier</small>
              </p>
              <b>{s[2]}</b>
            </div>
          ))}
        </section>
        <section className="market-action">
          <div>
            <span>MARKET OPPORTUNITY</span>
            <h2>Tomato supply is increasing in Chattogram</h2>
            <p>Average price has fallen 3.2% in the last 48 hours.</p>
            <button onClick={() => go('Marketplace')}>
              Explore listings <Icon name="arrow" />
            </button>
          </div>
        </section>
      </div>
    </PageFrame>
  )
}

function Knowledge({ notify, go }: { notify: (s: string) => void; go: (p: Page) => void }) {
  const [tab, setTab] = useState('Trending')
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All topics')
  const [composerOpen, setComposerOpen] = useState(false)
  const [helpful, setHelpful] = useState<number[]>([])
  const [savedPosts, setSavedPosts] = useState<number[]>([])
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [reply, setReply] = useState('')
  const [question, setQuestion] = useState({ title: '', crop: 'Rice', details: '' })
  const [posts, setPosts] = useState<
    {
      id: number
      author: string
      role: string
      title: string
      body: string
      category: string
      helpful: number
      replies: number
      time: string
      expert: boolean
      image?: string
    }[]
  >([])
  useEffect(() => {
    let active = true
    fetch('/api/knowledge-articles?where[status][equals]=published&limit=50&depth=1&sort=-updatedAt')
      .then(async (response) => {
        if (!response.ok) throw new Error('Knowledge articles could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (!active) return
        const docs = Array.isArray(data.docs) ? data.docs : []
        setPosts(
          docs.map((doc: any, index: number) => {
            const author =
              typeof doc.author === 'object' && doc.author
                ? doc.author.fullName || doc.author.email || 'AgTech agronomist'
                : 'AgTech agronomist'
            const categories: Record<string, string> = {
              'crop-health': 'Crop diseases',
              soil: 'Soil and nutrition',
              pests: 'Crop diseases',
              cultivation: 'Rice cultivation',
              technology: 'Technology',
              market: 'Market prices',
            }
            return {
              id: docs.length - index,
              author,
              role: 'AgTech agronomist',
              title: String(doc.title || 'Untitled article'),
              body: String(doc.excerpt || doc.content || ''),
              category: categories[String(doc.category)] || 'Cultivation guide',
              helpful: 0,
              replies: 0,
              time: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Recently',
              expert: true,
            }
          }),
        )
      })
      .catch(() => {
        if (active) notify('Knowledge articles are temporarily unavailable.')
      })
    return () => {
      active = false
    }
  }, [])

  const topics = [
    ['Rice cultivation', 128],
    ['Crop diseases', 111],
    ['Organic farming', 94],
    ['Market prices', 77],
    ['Irrigation', 63],
  ] as const

  const visiblePosts = posts
    .filter((post) => topic === 'All topics' || post.category === topic)
    .filter((post) => {
      const needle = query.toLowerCase().trim()
      return (
        !needle ||
        `${post.title} ${post.body} ${post.author} ${post.category}`.toLowerCase().includes(needle)
      )
    })
    .filter((post) => tab !== 'Following' || post.expert)
    .sort((a, b) => (tab === 'Latest' ? b.id - a.id : b.helpful - a.helpful))

  const publishQuestion = async () => {
    if (!question.title.trim() || !question.details.trim()) {
      notify('Add a question title and some details first.')
      return
    }
    try {
      const category =
        question.crop === 'Disease'
          ? 'crop-health'
          : question.crop === 'Market prices'
            ? 'market'
            : question.crop === 'Irrigation'
              ? 'cultivation'
              : 'cultivation'
      const response = await fetch('/api/knowledge-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: question.title.trim(),
          slug: `${question.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100)}-${Date.now()}`,
          excerpt: question.details.trim().slice(0, 500),
          content: question.details.trim(),
          category,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data.errors?.[0]?.message ||
            data.message ||
            'Sign in to AgTech to share a community post.',
        )
      }
      setPosts((current) => [
        {
          id: Date.now(),
          author: 'You',
          role: 'Community member',
          title: question.title.trim(),
          body: question.details.trim(),
          category:
            category === 'crop-health'
              ? 'Crop diseases'
              : category === 'market'
                ? 'Market prices'
                : question.crop === 'Rice'
                  ? 'Rice cultivation'
                  : 'Cultivation guide',
          helpful: 0,
          replies: 0,
          time: 'Just now',
          expert: false,
        },
        ...current,
      ])
      setQuestion({ title: '', crop: 'Rice', details: '' })
      setComposerOpen(false)
      setTab('Latest')
      setTopic('All topics')
      notify('Your post is published and visible in the Knowledge Hub.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Your question could not be submitted.')
    }
  }

  return (
    <PageFrame>
      <PageTop
        eyebrow="KNOWLEDGE HUB"
        title="Knowledge grows when shared."
        text="Practical answers from farmers, field experts and agronomists across Bangladesh."
        action={
          <Button onClick={() => setComposerOpen(true)}>
            <Icon name="plus" /> Create a post
          </Button>
        }
      />
      <div className="search-hero">
        <Icon name="search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search crops, diseases or farming questions..."
        />
        {query && (
          <button className="clear-search" onClick={() => setQuery('')}>
            Clear
          </button>
        )}
        <button
          onClick={() =>
            notify(
              visiblePosts.length
                ? `${visiblePosts.length} matching discussions found.`
                : 'No matching discussions found.',
            )
          }
        >
          Search
        </button>
      </div>
      <div className="topic-strip">
        <button
          className={topic === 'All topics' ? 'active' : ''}
          onClick={() => setTopic('All topics')}
        >
          All topics
        </button>
        {topics.map(([name]) => (
          <button
            className={topic === name ? 'active' : ''}
            onClick={() => setTopic(name)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="hub-layout">
        <main className="feed">
          <div className="tabs">
            {['Trending', 'Latest', 'Following'].map((t) => (
              <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>
                {t}
              </button>
            ))}
          </div>
          <div className="feed-summary">
            <span>{visiblePosts.length} discussions</span>
            {topic !== 'All topics' && (
              <button onClick={() => setTopic('All topics')}>
                Clear “{topic}” <Icon name="close" size={12} />
              </button>
            )}
          </div>
          {visiblePosts.map((post, i) => (
            <article className="post" key={post.id}>
              <div className="post-user">
                <span className={`avatar portrait p${i % 3}`}>{post.author[0]}</span>
                <p>
                  <strong>
                    {post.author}
                    {post.expert && (
                      <i className="verified-dot">
                        <Icon name="check" size={9} />
                      </i>
                    )}
                  </strong>
                  <small>
                    {post.role} · {post.time}
                  </small>
                </p>
                <button
                  onClick={() =>
                    setSavedPosts((current) =>
                      current.includes(post.id)
                        ? current.filter((id) => id !== post.id)
                        : [...current, post.id],
                    )
                  }
                  aria-label="Save post"
                >
                  <Icon name="book" size={17} />
                </button>
              </div>
              <span className="tag">
                {post.expert ? 'EXPERT GUIDE' : post.category.toUpperCase()}
              </span>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              {post.image && (
                <Image
                  src={post.image}
                  alt="Fresh farm produce"
                  width={2046}
                  height={1364}
                  unoptimized
                />
              )}
              <div className="post-actions">
                <button
                  className={helpful.includes(post.id) ? 'active' : ''}
                  onClick={() =>
                    setHelpful((current) =>
                      current.includes(post.id)
                        ? current.filter((id) => id !== post.id)
                        : [...current, post.id],
                    )
                  }
                >
                  {helpful.includes(post.id) ? '♥' : '♡'}{' '}
                  {post.helpful + (helpful.includes(post.id) ? 1 : 0)} helpful
                </button>
                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                  <Icon name="message" size={16} /> {post.replies} replies
                </button>
                <button
                  className={savedPosts.includes(post.id) ? 'active' : ''}
                  onClick={() =>
                    setSavedPosts((current) =>
                      current.includes(post.id)
                        ? current.filter((id) => id !== post.id)
                        : [...current, post.id],
                    )
                  }
                >
                  {savedPosts.includes(post.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(post.title)
                    notify('Discussion title copied to share.')
                  }}
                >
                  Share
                </button>
              </div>
              {expandedPost === post.id && (
                <div className="reply-panel">
                  <div className="expert-reply">
                    <span className="avatar portrait p2">D</span>
                    <div>
                      <p>
                        <strong>Dr. Farhana Akter</strong>
                        <small>Verified agronomist · 32 min ago</small>
                      </p>
                      <p>
                        {post.category === 'Rice cultivation'
                          ? 'Check the base of the plants at dusk. Drain excess standing water and avoid broad-spectrum pesticide until the pest is confirmed.'
                          : 'Thank you for sharing this with the community. Clear photos and the crop age will help us give more precise guidance.'}
                      </p>
                    </div>
                  </div>
                  <div className="reply-box">
                    <span className="avatar">MR</span>
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write a helpful reply..."
                    />
                    <button
                      onClick={() => {
                        if (!reply.trim()) return
                        setPosts((current) =>
                          current.map((p) =>
                            p.id === post.id ? { ...p, replies: p.replies + 1 } : p,
                          ),
                        )
                        setReply('')
                        notify('Your reply was posted.')
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
          {!visiblePosts.length && (
            <div className="no-knowledge-results">
              <Icon name="search" size={34} />
              <h3>No discussions found</h3>
              <p>Try a different keyword or clear the selected topic.</p>
              <button
                onClick={() => {
                  setQuery('')
                  setTopic('All topics')
                }}
              >
                Show all discussions
              </button>
            </div>
          )}
        </main>
        <aside className="hub-side">
          <section className="panel">
            <span className="panel-label">POPULAR TOPICS</span>
            {topics.map(([x, count], i) => (
              <button
                className={topic === x ? 'active-topic' : ''}
                key={x}
                onClick={() => setTopic(x)}
              >
                <b>0{i + 1}</b>
                <span>
                  {x}
                  <small>{count} discussions</small>
                </span>
                <Icon name="chevron" />
              </button>
            ))}
          </section>
          <section className="panel saved-summary">
            <span className="panel-label">YOUR LIBRARY</span>
            <div>
              <Icon name="book" />
              <p>
                <strong>{savedPosts.length} saved posts</strong>
                <small>Available from your profile</small>
              </p>
            </div>
          </section>
          <section className="expert-call">
            <Icon name="users" />
            <h3>Need an expert opinion?</h3>
            <p>Connect with a verified agronomist for personal guidance.</p>
            <button onClick={() => go('Experts')}>Find an expert</button>
          </section>
        </aside>
      </div>
      {composerOpen && (
        <div
          className="knowledge-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Create a community post"
        >
          <div className="question-composer">
            <div className="profile-modal-head">
              <div>
                <span>SHARE WITH THE COMMUNITY</span>
                <h2>Share something with the farming community</h2>
              </div>
              <button onClick={() => setComposerOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <p>Your post will be published immediately and visible to other AgTech members.</p>
            <label>
              <span>Post title</span>
              <input
                value={question.title}
                onChange={(e) => setQuestion({ ...question, title: e.target.value })}
                placeholder="For example: Why are my rice leaves turning yellow?"
              />
            </label>
            <div className="composer-grid">
              <label>
                <span>Crop or topic</span>
                <select
                  value={question.crop}
                  onChange={(e) => setQuestion({ ...question, crop: e.target.value })}
                >
                  <option>Rice</option>
                  <option>Vegetables</option>
                  <option>Disease</option>
                  <option>Irrigation</option>
                  <option>Market prices</option>
                </select>
              </label>
              <label>
                <span>Your district</span>
                <select>
                  <option>Chattogram</option>
                  <option>Dhaka</option>
                  <option>Rajshahi</option>
                  <option>Rangpur</option>
                  <option>Jashore</option>
                </select>
              </label>
            </div>
            <label>
              <span>Details</span>
              <textarea
                rows={6}
                value={question.details}
                onChange={(e) => setQuestion({ ...question, details: e.target.value })}
                placeholder="Describe what you are seeing, when it started, and what you have already tried..."
              />
            </label>
            <div className="composer-note">
              <Icon name="camera" />
              <span>Add a clear crop photo after publishing to get better answers.</span>
            </div>
            <div className="modal-actions">
              <button onClick={() => setComposerOpen(false)}>Cancel</button>
              <Button onClick={publishQuestion}>
                Publish post <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageFrame>
  )
}

type DiagnosisResult = {
  isLeaf: boolean
  imageQuality: 'good' | 'fair' | 'poor'
  crop: string
  probableCondition: string
  scientificName: string
  confidence: number
  severity: 'low' | 'moderate' | 'high' | 'uncertain'
  summary: string
  visibleSymptoms: string[]
  recommendations: string[]
  alternatives: string[]
  whenToEscalate: string
  disclaimer: string
}

function Disease({ notify }: { notify: (s: string) => void }) {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'result' | 'error'>('idle')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [capturedPhoto, setCapturedPhoto] = useState('')
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!cameraOpen || capturedPhoto) return
    let active = true
    let stream: MediaStream | undefined

    async function startCamera() {
      setCameraError('')
      setCameraReady(false)
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not supported by this browser.')
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraReady(true)
        }
      } catch {
        setCameraError(
          'We could not access your camera. Allow camera permission or upload a photo instead.',
        )
      }
    }

    startCamera()
    return () => {
      active = false
      stream?.getTracks().forEach((track) => track.stop())
      if (videoRef.current) videoRef.current.srcObject = null
    }
  }, [cameraOpen, capturedPhoto])

  const analyseImage = async (source: File | string) => {
    setStage('scanning')
    setDiagnosis(null)
    setAnalysisError('')
    try {
      const blob = typeof source === 'string' ? await (await fetch(source)).blob() : source
      const formData = new FormData()
      formData.append('image', blob, source instanceof File ? source.name : 'leaf-capture.jpg')
      const response = await fetch('/api/diagnose', { method: 'POST', body: formData })
      const data = (await response.json()) as DiagnosisResult & { error?: string }
      if (!response.ok) throw new Error(data.error || 'The image could not be analysed.')
      if (!data.isLeaf)
        throw new Error(data.summary || 'No clear crop leaf was found in this image.')
      setDiagnosis(data)
      setStage('result')
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'The image could not be analysed.')
      setStage('error')
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.9))
  }

  const analyzePhoto = () => {
    setCameraOpen(false)
    void analyseImage(capturedPhoto)
  }

  const chooseFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCapturedPhoto(String(reader.result))
      void analyseImage(file)
    }
    reader.readAsDataURL(file)
  }

  return (
    <PageFrame dark>
      <PageTop
        eyebrow="AI DISEASE DETECTION"
        title="See the problem. Protect the harvest."
        text="Upload a clear leaf photo for an AI-assisted diagnosis and practical treatment guidance."
      />
      <div className="disease-layout">
        <section className={`scanner ${stage}`}>
          <div className="scanner-corners" />
          {stage === 'idle' && (
            <>
              <span className="upload-orb">
                <Icon name="camera" size={34} />
              </span>
              <h2>Upload a leaf image</h2>
              <p>
                Place one affected leaf in the frame. Use natural light and keep the image in focus.
              </p>
              <div className="photo-actions">
                <Button onClick={() => fileRef.current?.click()}>
                  <Icon name="upload" /> Choose image
                </Button>
                <button className="live-photo-btn" onClick={() => setCameraOpen(true)}>
                  <Icon name="camera" /> Take live photo
                </button>
              </div>
              <input
                ref={fileRef}
                className="hidden-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
              <small>JPG, PNG or WebP · Maximum 10 MB · Photos are not stored</small>
            </>
          )}
          {stage === 'scanning' && (
            <>
              <span className="scan-animation">
                <Icon name="leaf" size={54} />
              </span>
              <h2>Analysing leaf patterns...</h2>
              <p>Comparing color, texture and lesion patterns with the crop disease library.</p>
            </>
          )}
          {stage === 'error' && (
            <div className="analysis-error">
              <span>
                <Icon name="camera" size={30} />
              </span>
              <h2>We need a clearer leaf photo</h2>
              <p>{analysisError}</p>
              <button
                onClick={() => {
                  setStage('idle')
                  setCapturedPhoto('')
                }}
              >
                Try another photo
              </button>
            </div>
          )}
          {stage === 'result' && diagnosis && (
            <>
              {capturedPhoto ? (
                <div className="captured-result">
                  <Image
                    src={capturedPhoto}
                    alt="Captured leaf used for diagnosis"
                    width={220}
                    height={220}
                    unoptimized
                  />
                  <span>
                    <Icon name="scan" size={19} />
                  </span>
                </div>
              ) : (
                <div className="leaf-result">
                  <Icon name="leaf" size={70} />
                  <span />
                </div>
              )}
              <div className="confidence">
                <span>{diagnosis.confidence}% PROBABLE MATCH</span>
                <h2>{diagnosis.probableCondition}</h2>
                <p>
                  {diagnosis.crop}
                  {diagnosis.scientificName ? ` · ${diagnosis.scientificName}` : ''}
                </p>
              </div>
            </>
          )}
        </section>
        <section className="diagnosis-panel">
          <span className="panel-label">DIAGNOSIS RESULT</span>
          {stage !== 'result' || !diagnosis ? (
            <div className="empty-result">
              <Icon name={stage === 'error' ? 'camera' : 'sparkle'} size={36} />
              <h3>
                {stage === 'error'
                  ? 'Photo could not be assessed'
                  : stage === 'scanning'
                    ? 'Examining visible symptoms'
                    : 'Your result will appear here'}
              </h3>
              <p>
                {stage === 'error'
                  ? 'Use one leaf, natural light, a plain background and sharp focus.'
                  : 'The analysis includes image quality, visible symptoms, probable causes and recommended next steps.'}
              </p>
            </div>
          ) : (
            <div className="result-content">
              <div className="risk-row">
                <span>{diagnosis.imageQuality.toUpperCase()} IMAGE · AI ASSISTED</span>
                <b>{diagnosis.severity} severity</b>
              </div>
              <h2>{diagnosis.probableCondition}</h2>
              <p>{diagnosis.summary}</p>
              <div className="symptom-list">
                <h3>Visible symptoms</h3>
                {diagnosis.visibleSymptoms.map((symptom) => (
                  <div key={symptom}>
                    <span>
                      <Icon name="scan" size={13} />
                    </span>
                    {symptom}
                  </div>
                ))}
              </div>
              <div className="treatment">
                <h3>Recommended treatment</h3>
                {diagnosis.recommendations.map((x) => (
                  <div key={x}>
                    <span>
                      <Icon name="check" size={14} />
                    </span>
                    {x}
                  </div>
                ))}
              </div>
              {diagnosis.alternatives.length > 0 && (
                <p className="diagnosis-alternatives">
                  <strong>Other possibilities:</strong> {diagnosis.alternatives.join(', ')}
                </p>
              )}
              <p className="escalation-note">
                <strong>Consult an expert when:</strong> {diagnosis.whenToEscalate}
              </p>
              <button onClick={() => notify('Treatment guide saved to your profile.')}>
                Save treatment plan <Icon name="arrow" />
              </button>
              <small>{diagnosis.disclaimer}</small>
            </div>
          )}
        </section>
      </div>
      <div className="scan-history">
        <div className="panel-head">
          <div>
            <span>RECENT ANALYSES</span>
            <h2>Your crop health history</h2>
          </div>
        </div>
        <div className="history-row">
          {[
            ['Tomato', 'Early blight', 'Today', '92%'],
            ['Rice', 'Healthy', '18 Jun', '98%'],
            ['Wheat', 'Nitrogen deficiency', '12 Jun', '78%'],
          ].map((x, i) => (
            <button key={x[1]}>
              <span className={`history-leaf h${i}`}>
                <Icon name="leaf" />
              </span>
              <p>
                <strong>{x[1]}</strong>
                <small>
                  {x[0]} · {x[2]}
                </small>
              </p>
              <b>{x[3]}</b>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
      </div>
      {cameraOpen && (
        <div
          className="camera-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Take a leaf photo"
        >
          <div className="camera-shell">
            <div className="camera-head">
              <div>
                <span>LIVE CAMERA</span>
                <h2>Place the affected leaf in frame</h2>
              </div>
              <button onClick={() => setCameraOpen(false)} aria-label="Close camera">
                <Icon name="close" />
              </button>
            </div>
            <div className="camera-view">
              {capturedPhoto ? (
                <Image
                  src={capturedPhoto}
                  alt="Captured leaf preview"
                  fill
                  sizes="(max-width: 760px) 100vw, 780px"
                  unoptimized
                />
              ) : (
                <video ref={videoRef} autoPlay muted playsInline />
              )}
              {!capturedPhoto && (
                <div className="camera-guide">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {!capturedPhoto && !cameraReady && !cameraError && (
                <div className="camera-loading">
                  <span />
                  <p>Starting camera...</p>
                </div>
              )}
              {cameraError && (
                <div className="camera-error">
                  <Icon name="camera" size={30} />
                  <p>{cameraError}</p>
                  <button
                    onClick={() => {
                      setCameraOpen(false)
                      fileRef.current?.click()
                    }}
                  >
                    Upload a photo
                  </button>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} hidden />
            <div className="camera-controls">
              {capturedPhoto ? (
                <>
                  <button className="retake-btn" onClick={() => setCapturedPhoto('')}>
                    Retake
                  </button>
                  <Button onClick={analyzePhoto}>
                    <Icon name="sparkle" /> Use photo & analyse
                  </Button>
                </>
              ) : (
                <>
                  <p>Keep the leaf still and use natural light.</p>
                  <button
                    className="shutter"
                    onClick={capturePhoto}
                    disabled={!cameraReady || Boolean(cameraError)}
                    aria-label="Capture photo"
                  >
                    <span />
                  </button>
                  <span>Tap to capture</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </PageFrame>
  )
}

const experts = [
  {
    id: 1,
    name: 'Dr. Farhana Akter',
    specialty: 'Soil & fertilizer',
    title: 'Soil & fertilizer specialist',
    organization: 'Bangladesh Agricultural University',
    rating: '4.9',
    consultations: 126,
    experience: '11 years',
    location: 'Mymensingh',
    available: true,
    languages: 'Bangla, English',
    fee: '৳450',
    bio: 'Helps farmers build practical soil-health and fertilizer plans for rice, vegetables and mixed cultivation.',
  },
  {
    id: 2,
    name: 'Dr. Ahmed Rahman',
    specialty: 'Crop diseases',
    title: 'Crop disease specialist',
    organization: 'Bangladesh Rice Research Institute',
    rating: '4.8',
    consultations: 94,
    experience: '9 years',
    location: 'Gazipur',
    available: true,
    languages: 'Bangla, English',
    fee: '৳500',
    bio: 'Specialises in early disease identification, integrated pest management and safe treatment planning.',
  },
  {
    id: 3,
    name: 'Shamim Hossain',
    specialty: 'Irrigation',
    title: 'Irrigation & water management',
    organization: 'Rural Development Academy',
    rating: '4.7',
    consultations: 81,
    experience: '8 years',
    location: 'Bogura',
    available: false,
    languages: 'Bangla',
    fee: '৳350',
    bio: 'Advises farms on irrigation scheduling, drainage, water conservation and low-cost pump systems.',
  },
  {
    id: 4,
    name: 'Dr. Tasnim Sultana',
    specialty: 'Organic farming',
    title: 'Organic farming specialist',
    organization: 'Bangladesh Agricultural Research Institute',
    rating: '4.9',
    consultations: 108,
    experience: '10 years',
    location: 'Jashore',
    available: true,
    languages: 'Bangla, English',
    fee: '৳450',
    bio: 'Supports vegetable growers with organic pest control, composting and sustainable crop rotations.',
  },
  {
    id: 5,
    name: 'Mahmudul Hasan',
    specialty: 'Market planning',
    title: 'Farm business & market advisor',
    organization: 'Agricultural Marketing Department',
    rating: '4.6',
    consultations: 72,
    experience: '7 years',
    location: 'Dhaka',
    available: false,
    languages: 'Bangla, English',
    fee: '৳400',
    bio: 'Helps farmers plan harvest timing, understand market prices and improve direct buyer relationships.',
  },
]

function Experts({ notify }: { notify: (s: string) => void }) {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All specialties')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState<(typeof experts)[number] | null>(null)
  const [bookingExpert, setBookingExpert] = useState<(typeof experts)[number] | null>(null)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [booking, setBooking] = useState({
    method: 'Video call',
    date: '',
    time: '10:30 AM',
    issue: '',
  })
  const specialties = [
    'All specialties',
    ...Array.from(new Set(experts.map((expert) => expert.specialty))),
  ]
  const visibleExperts = experts.filter((expert) => {
    const needle = query.toLowerCase().trim()
    const matchesSearch =
      !needle ||
      `${expert.name} ${expert.title} ${expert.organization} ${expert.location}`
        .toLowerCase()
        .includes(needle)
    return (
      matchesSearch &&
      (specialty === 'All specialties' || expert.specialty === specialty) &&
      (!availableOnly || expert.available)
    )
  })

  const startBooking = (expert: (typeof experts)[number]) => {
    setSelectedExpert(null)
    setBookingExpert(expert)
    setBookingComplete(false)
    setBooking({ method: 'Video call', date: '', time: '10:30 AM', issue: '' })
  }

  const confirmBooking = async () => {
    if (!booking.date || !booking.issue.trim()) {
      notify('Choose a date and briefly describe what you need help with.')
      return
    }
    try {
      const response = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: `${bookingExpert?.specialty || 'Agronomist'} consultation request`,
          question: [
            booking.issue.trim(),
            `Preferred agronomist: ${bookingExpert?.name || 'Any available agronomist'}.`,
            `Preferred method: ${booking.method}.`,
            `Preferred date and time: ${booking.date} at ${booking.time}.`,
          ].join('\\n\\n'),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data.errors?.[0]?.message ||
            data.message ||
            'Sign in with a farmer account to request an agronomist consultation.',
        )
      }
      setBookingComplete(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Your consultation request could not be sent.')
    }
  }

  return (
    <PageFrame>
      <PageTop
        eyebrow="AGRONOMIST DIRECTORY"
        title="Expert advice, rooted in experience."
        text="Speak with verified agricultural professionals who understand local crops and conditions."
      />
      <div className="directory-tools">
        <div>
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, specialty or location..."
          />
        </div>
        <label className="specialty-select">
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
            {specialties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Icon name="chevron" />
        </label>
        <button
          className={availableOnly ? 'active' : ''}
          onClick={() => setAvailableOnly(!availableOnly)}
        >
          <span className="availability-dot" /> Available now
        </button>
      </div>
      <div className="directory-summary">
        <span>{visibleExperts.length} verified experts</span>
        {(query || specialty !== 'All specialties' || availableOnly) && (
          <button
            onClick={() => {
              setQuery('')
              setSpecialty('All specialties')
              setAvailableOnly(false)
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="expert-grid">
        {visibleExperts.map((expert, i) => (
          <article className="expert-card" key={expert.id}>
            <div className={`expert-photo ex${i}`}>
              <span>{expert.name.split(' ').slice(-1)[0][0]}</span>
              <i className={!expert.available ? 'offline' : ''}>
                {expert.available ? 'AVAILABLE NOW' : 'NEXT: TOMORROW'}
              </i>
            </div>
            <div className="expert-body">
              <span className="verified">
                <Icon name="check" size={11} /> VERIFIED EXPERT
              </span>
              <h2>{expert.name}</h2>
              <p>{expert.title}</p>
              <small>{expert.organization}</small>
              <div className="expert-meta">
                <span>
                  <Icon name="location" size={12} /> {expert.location}
                </span>
                <span>
                  <Icon name="calendar" size={12} /> {expert.experience}
                </span>
              </div>
              <div className="rating">
                <Icon name="star" size={14} />
                <b>{expert.rating}</b>
                <span>({expert.consultations} consultations)</span>
                <strong>{expert.fee} / session</strong>
              </div>
              <div className="expert-actions">
                <button onClick={() => setSelectedExpert(expert)}>View profile</button>
                <Button onClick={() => startBooking(expert)}>Book consultation</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!visibleExperts.length && (
        <div className="no-experts">
          <Icon name="search" size={35} />
          <h3>No experts match these filters</h3>
          <p>Try another specialty, location or availability option.</p>
          <button
            onClick={() => {
              setQuery('')
              setSpecialty('All specialties')
              setAvailableOnly(false)
            }}
          >
            Show all experts
          </button>
        </div>
      )}
      <section className="expert-banner">
        <div>
          <span>FOR AGRONOMISTS</span>
          <h2>Share your expertise. Strengthen Bangladesh agriculture.</h2>
        </div>
        <button onClick={() => notify('Agronomist application opened.')}>
          Join as an expert <Icon name="arrow" />
        </button>
      </section>
      {selectedExpert && (
        <div
          className="expert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedExpert.name} profile`}
        >
          <div className="expert-profile-card">
            <div className="expert-profile-top">
              <div className="expert-profile-portrait">
                <span>{selectedExpert.name.split(' ').slice(-1)[0][0]}</span>
                <i>{selectedExpert.available ? 'AVAILABLE' : 'OFFLINE'}</i>
              </div>
              <button onClick={() => setSelectedExpert(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="expert-profile-content">
              <span className="verified">
                <Icon name="check" size={11} /> VERIFIED AGRONOMIST
              </span>
              <h2>{selectedExpert.name}</h2>
              <p className="expert-title">{selectedExpert.title}</p>
              <div className="profile-rating">
                <Icon name="star" />
                <strong>{selectedExpert.rating}</strong>
                <span>
                  {selectedExpert.consultations} consultations · {selectedExpert.experience}{' '}
                  experience
                </span>
              </div>
              <p className="expert-bio">{selectedExpert.bio}</p>
              <div className="expert-facts">
                <div>
                  <span>SPECIALTY</span>
                  <strong>{selectedExpert.specialty}</strong>
                </div>
                <div>
                  <span>LOCATION</span>
                  <strong>{selectedExpert.location}</strong>
                </div>
                <div>
                  <span>LANGUAGES</span>
                  <strong>{selectedExpert.languages}</strong>
                </div>
                <div>
                  <span>SESSION FEE</span>
                  <strong>{selectedExpert.fee}</strong>
                </div>
              </div>
              <div className="review-preview">
                <span className="avatar">RK</span>
                <p>
                  <strong>“Clear advice that saved my tomato crop.”</strong>
                  <small>Rahim Khan · Verified consultation</small>
                </p>
                <span>★★★★★</span>
              </div>
              <Button onClick={() => startBooking(selectedExpert)}>
                Book a consultation <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {bookingExpert && (
        <div
          className="expert-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Book consultation"
        >
          <div className="booking-card">
            <div className="profile-modal-head">
              <div>
                <span>EXPERT CONSULTATION</span>
                <h2>{bookingComplete ? 'Consultation requested' : `Book ${bookingExpert.name}`}</h2>
              </div>
              <button onClick={() => setBookingExpert(null)}>
                <Icon name="close" />
              </button>
            </div>
            {bookingComplete ? (
              <div className="booking-success">
                <span>
                  <Icon name="check" size={30} />
                </span>
                <h3>Your request has been sent</h3>
                <p>
                  Your request for {booking.method.toLowerCase()} on {booking.date} at{' '}
                  {booking.time} has been sent to the AgTech agronomist team. An agronomist can pick it up and respond through your account.
                </p>
                <div>
                  <span>Estimated fee</span>
                  <strong>{bookingExpert.fee}</strong>
                </div>
                <Button
                  onClick={() => {
                    setBookingExpert(null)
                    notify('Consultation added to your dashboard.')
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="booking-expert">
                  <span className="avatar portrait p2">{bookingExpert.name[0]}</span>
                  <p>
                    <strong>{bookingExpert.name}</strong>
                    <small>
                      {bookingExpert.title} · ★ {bookingExpert.rating}
                    </small>
                  </p>
                  <b>{bookingExpert.fee}</b>
                </div>
                <label className="booking-label">Consultation method</label>
                <div className="method-options">
                  {['Video call', 'Phone call', 'Chat'].map((method) => (
                    <button
                      className={booking.method === method ? 'active' : ''}
                      onClick={() => setBooking({ ...booking, method })}
                      key={method}
                    >
                      <Icon
                        name={
                          method === 'Video call'
                            ? 'camera'
                            : method === 'Phone call'
                              ? 'user'
                              : 'message'
                        }
                      />
                      {method}
                    </button>
                  ))}
                </div>
                <div className="booking-grid">
                  <label>
                    <span>Preferred date</span>
                    <input
                      type="date"
                      value={booking.date}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Preferred time</span>
                    <select
                      value={booking.time}
                      onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    >
                      <option>10:30 AM</option>
                      <option>1:15 PM</option>
                      <option>4:00 PM</option>
                      <option>6:30 PM</option>
                    </select>
                  </label>
                </div>
                <label className="booking-issue">
                  <span>What do you need help with?</span>
                  <textarea
                    rows={4}
                    value={booking.issue}
                    onChange={(e) => setBooking({ ...booking, issue: e.target.value })}
                    placeholder="Describe the crop, symptoms or farming question..."
                  />
                </label>
                <div className="booking-note">
                  <Icon name="check" />
                  <span>You will only be charged after the expert confirms.</span>
                </div>
                <Button onClick={confirmBooking}>
                  Request consultation <Icon name="arrow" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </PageFrame>
  )
}

type MarketplaceProduct = {
  id: number
  recordID?: string
  name: string
  category: string
  price: string
  priceNumber: number
  location: string
  seller: string
  rating: number
  quantity: string
  description: string
  delivery: string
  posted: string
}

const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 6,
    name: 'Fresh tomatoes',
    category: 'Produce',
    price: '৳40 / kg',
    priceNumber: 40,
    location: 'Hathazari',
    seller: 'Nusrat Jahan',
    rating: 4.9,
    quantity: '420 kg available',
    description:
      'Freshly harvested local tomatoes, sorted for quality and ready for market or restaurant supply.',
    delivery: 'Pickup or delivery within 15 km',
    posted: '2 hours ago',
  },
  {
    id: 5,
    name: 'Premium Aman rice',
    category: 'Produce',
    price: '৳65 / kg',
    priceNumber: 65,
    location: 'Rangpur',
    seller: 'Karim Rice Fields',
    rating: 4.8,
    quantity: '2,000 kg available',
    description:
      'Clean, naturally dried Aman rice from this season’s harvest. Bulk orders welcome.',
    delivery: 'Regional delivery available',
    posted: '4 hours ago',
  },
  {
    id: 4,
    name: 'Power tiller',
    category: 'Equipment',
    price: '৳48,500',
    priceNumber: 48500,
    location: 'Cumilla',
    seller: 'Mizan Farm Tools',
    rating: 4.7,
    quantity: '1 unit available',
    description:
      'Well-maintained diesel power tiller with rotary blades. Recently serviced and ready to work.',
    delivery: 'Buyer pickup',
    posted: 'Yesterday',
  },
  {
    id: 3,
    name: 'Organic compost',
    category: 'Inputs',
    price: '৳520 / bag',
    priceNumber: 520,
    location: 'Jashore',
    seller: 'Green Soil Organics',
    rating: 4.9,
    quantity: '85 bags available',
    description:
      'Fully matured organic compost for vegetables, fruit trees and field crops. 40 kg sealed bags.',
    delivery: 'Delivery for 10+ bags',
    posted: 'Yesterday',
  },
  {
    id: 2,
    name: 'Irrigation water pump',
    category: 'Equipment',
    price: '৳3,500',
    priceNumber: 3500,
    location: 'Chattogram',
    seller: 'Rahim Agro Farm',
    rating: 4.8,
    quantity: '2 units available',
    description:
      'Reliable two-inch water pump in good working condition, suitable for small and medium fields.',
    delivery: 'Pickup in Hathazari',
    posted: '2 days ago',
  },
  {
    id: 1,
    name: 'Mustard seed',
    category: 'Inputs',
    price: '৳180 / kg',
    priceNumber: 180,
    location: 'Rajshahi',
    seller: 'Barendra Seeds',
    rating: 4.6,
    quantity: '160 kg available',
    description:
      'High-germination mustard seed selected for local conditions and packed in moisture-safe bags.',
    delivery: 'Courier across Bangladesh',
    posted: '3 days ago',
  },
]

function Marketplace({ notify }: { notify: (s: string) => void }) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Recommended')
  const [saved, setSaved] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null)
  const [contactProduct, setContactProduct] = useState<MarketplaceProduct | null>(null)
  const [listingOpen, setListingOpen] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [sellerMessage, setSellerMessage] = useState('')
  const [newListing, setNewListing] = useState({
    name: '',
    category: 'Produce',
    price: '',
    unit: 'kg',
    quantity: '',
    location: 'Chattogram',
    description: '',
  })
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/marketplace-listings?where[status][equals]=active&limit=100&depth=1&sort=-createdAt', {
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Marketplace listings could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (!active) return
        const docs = Array.isArray(data.docs) ? data.docs : []
        const mapped: MarketplaceProduct[] = docs.map((doc: any, index: number) => {
          const category =
            doc.category === 'equipment'
              ? 'Equipment'
              : doc.category === 'inputs' || doc.category === 'seeds'
                ? 'Inputs'
                : 'Produce'
          const seller =
            typeof doc.seller === 'object' && doc.seller
              ? doc.seller.fullName || doc.seller.email || 'AgTech seller'
              : 'AgTech seller'
          const unit = String(doc.unit || 'unit')
          const priceNumber = Number(doc.price || 0)
          return {
            id: index + 1,
            recordID: String(doc.id),
            name: String(doc.title || 'Untitled listing'),
            category,
            price: `৳${priceNumber.toLocaleString('en-BD')} / ${unit}`,
            priceNumber,
            location: String(doc.location || 'Bangladesh'),
            seller,
            rating: 0,
            quantity: `${doc.quantity ?? 0} ${unit} available`,
            description: String(doc.description || ''),
            delivery: 'Contact seller for delivery details',
            posted: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recently',
          }
        })
        setProducts(mapped)
      })
      .catch(() => {
        if (active) notify('Marketplace listings could not be loaded. Please refresh the page.')
      })
      .finally(() => {
        if (active) setLoadingListings(false)
      })
    return () => {
      active = false
    }
  }, [])
  const visibleProducts = products
    .filter((product) => filter === 'All' || product.category === filter)
    .filter((product) => {
      const needle = query.toLowerCase().trim()
      return (
        !needle ||
        `${product.name} ${product.category} ${product.location} ${product.seller}`
          .toLowerCase()
          .includes(needle)
      )
    })
    .sort((a, b) =>
      sort === 'Price: low to high'
        ? a.priceNumber - b.priceNumber
        : sort === 'Newest'
          ? b.id - a.id
          : b.rating - a.rating,
    )

  const openContact = (product: MarketplaceProduct) => {
    setSelectedProduct(null)
    setContactProduct(product)
    setMessageSent(false)
    setSellerMessage(
      `Hello, I’m interested in your ${product.name.toLowerCase()}. Is it still available?`,
    )
  }

  const sendInquiry = async () => {
    if (!sellerMessage.trim()) {
      notify('Write a message before sending.')
      return
    }
    if (!contactProduct?.recordID) {
      notify('This listing is not connected to the live marketplace yet.')
      return
    }
    try {
      const response = await fetch('/api/marketplace-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listing: contactProduct.recordID,
          message: sellerMessage.trim(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data.errors?.[0]?.message ||
            data.message ||
            'Sign in to AgTech to contact this seller.',
        )
      }
      setMessageSent(true)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Your inquiry could not be sent.')
    }
  }

  const publishListing = async () => {
    if (!newListing.name.trim() || !newListing.price || !newListing.quantity) {
      notify('Add a product name, price and available quantity.')
      return
    }
    const price = Number(newListing.price.replace(/[^0-9.]/g, ''))
    const quantity = Number(newListing.quantity)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity <= 0) {
      notify('Enter a valid price and a quantity greater than zero.')
      return
    }
    const category =
      newListing.category === 'Produce'
        ? 'produce'
        : newListing.category === 'Equipment'
          ? 'equipment'
          : newListing.category === 'Inputs'
            ? 'inputs'
            : 'other'
    const unit = newListing.unit === 'unit' ? 'piece' : newListing.unit
    try {
      const response = await fetch('/api/marketplace-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newListing.name.trim(),
          description: newListing.description.trim() || 'Agricultural product listed on AgTech.',
          category,
          price,
          quantity,
          unit,
          location: newListing.location,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data.errors?.[0]?.message ||
            data.message ||
            'Sign in with a farmer account before creating a listing.',
        )
      }
      setListingOpen(false)
      setNewListing({
        name: '',
        category: 'Produce',
        price: '',
        unit: 'kg',
        quantity: '',
        location: 'Chattogram',
        description: '',
      })
      notify('Your listing is live in the marketplace.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Your listing could not be submitted.')
    }
  }
  return (
    <PageFrame>
      <PageTop
        eyebrow="AGRICULTURAL MARKETPLACE"
        title="From good fields to fair markets."
        text="Buy and sell produce, farm inputs and equipment with trusted people nearby."
        action={
          <Button onClick={() => setListingOpen(true)}>
            <Icon name="plus" /> Sell a product
          </Button>
        }
      />
      <div className="marketplace-hero">
        <Image
          src="/agtech-market.svg"
          alt="Farmers sharing freshly harvested tomatoes"
          width={2046}
          height={1364}
          unoptimized
        />
        <div>
          <span>MARKET UPDATE · 24 JUNE</span>
          <h2>
            Tomato prices are up
            <br />
            4.8% this week.
          </h2>
          <button onClick={() => notify('Today’s Chattogram market price report opened.')}>
            See today’s prices <Icon name="arrow" />
          </button>
        </div>
      </div>
      <div className="shop-tools">
        <div className="search-input">
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, sellers or locations..."
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        <div className="filter-pills">
          {['All', 'Produce', 'Inputs', 'Equipment'].map((f) => (
            <button className={filter === f ? 'active' : ''} onClick={() => setFilter(f)} key={f}>
              {f}
            </button>
          ))}
        </div>
        <label className="market-sort">
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Recommended</option>
            <option>Newest</option>
            <option>Price: low to high</option>
          </select>
          <Icon name="chevron" />
        </label>
      </div>
      <div className="market-results">
        <span>{loadingListings ? "Loading listings…" : `${visibleProducts.length} listings found`}</span>
        {saved.length > 0 && (
          <button onClick={() => notify(`${saved.length} saved marketplace listings.`)}>
            <Icon name="book" size={14} /> {saved.length} saved
          </button>
        )}
      </div>
      <div className="products">
        {visibleProducts.map((product, i) => (
          <article key={product.id}>
            <div
              className={`product-visual pv${i % 6}`}
              onClick={() => setSelectedProduct(product)}
            >
              <Icon
                name={
                  product.category === 'Equipment'
                    ? 'store'
                    : product.category === 'Livestock'
                      ? 'users'
                      : 'leaf'
                }
                size={42}
              />
              <span>{product.category.toUpperCase()}</span>
              <button
                className={saved.includes(product.id) ? 'saved' : ''}
                onClick={(event) => {
                  event.stopPropagation()
                  setSaved((current) =>
                    current.includes(product.id)
                      ? current.filter((id) => id !== product.id)
                      : [...current, product.id],
                  )
                }}
                aria-label="Save listing"
              >
                {saved.includes(product.id) ? '♥' : '♡'}
              </button>
            </div>
            <div>
              <small>
                {product.location} · ★ {product.rating} seller
              </small>
              <h3 onClick={() => setSelectedProduct(product)}>{product.name}</h3>
              <p>{product.quantity}</p>
              <strong>{product.price}</strong>
              <button onClick={() => openContact(product)}>
                Contact seller <Icon name="message" size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visibleProducts.length && (
        <div className="no-market-results">
          <Icon name="store" size={36} />
          <h3>No listings found</h3>
          <p>Try another keyword or category.</p>
          <button
            onClick={() => {
              setQuery('')
              setFilter('All')
            }}
          >
            Show all products
          </button>
        </div>
      )}
      {selectedProduct && (
        <div
          className="market-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProduct.name} listing`}
        >
          <div className="product-detail">
            <div className={`product-detail-visual pv${selectedProduct.id % 6}`}>
              <Icon name={selectedProduct.category === 'Equipment' ? 'store' : 'leaf'} size={76} />
              <span>{selectedProduct.category.toUpperCase()}</span>
              <button onClick={() => setSelectedProduct(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="product-detail-body">
              <div className="product-detail-title">
                <div>
                  <small>
                    {selectedProduct.location} · Posted {selectedProduct.posted}
                  </small>
                  <h2>{selectedProduct.name}</h2>
                  <p>{selectedProduct.quantity}</p>
                </div>
                <strong>{selectedProduct.price}</strong>
              </div>
              <p className="product-description">{selectedProduct.description}</p>
              <div className="product-facts">
                <div>
                  <span>SELLER</span>
                  <strong>{selectedProduct.seller}</strong>
                </div>
                <div>
                  <span>RATING</span>
                  <strong>★ {selectedProduct.rating} verified</strong>
                </div>
                <div>
                  <span>DELIVERY</span>
                  <strong>{selectedProduct.delivery}</strong>
                </div>
              </div>
              <section className="seller-card">
                <span className="avatar">
                  {selectedProduct.seller
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <p>
                  <strong>{selectedProduct.seller}</strong>
                  <small>Verified AgTech seller · Usually replies within 1 hour</small>
                </p>
                <Icon name="check" />
              </section>
              <div className="product-detail-actions">
                <button
                  className={saved.includes(selectedProduct.id) ? 'saved' : ''}
                  onClick={() =>
                    setSaved((current) =>
                      current.includes(selectedProduct.id)
                        ? current.filter((id) => id !== selectedProduct.id)
                        : [...current, selectedProduct.id],
                    )
                  }
                >
                  {saved.includes(selectedProduct.id) ? '♥ Saved' : '♡ Save listing'}
                </button>
                <Button onClick={() => openContact(selectedProduct)}>
                  Contact seller <Icon name="message" />
                </Button>
              </div>
              <small className="market-safety">
                <Icon name="check" size={13} /> Never send advance payment before verifying the
                product and seller.
              </small>
            </div>
          </div>
        </div>
      )}
      {contactProduct && (
        <div className="market-modal" role="dialog" aria-modal="true" aria-label="Contact seller">
          <div className="contact-seller-card">
            <div className="profile-modal-head">
              <div>
                <span>CONTACT SELLER</span>
                <h2>{messageSent ? 'Message sent' : `Ask about ${contactProduct.name}`}</h2>
              </div>
              <button onClick={() => setContactProduct(null)}>
                <Icon name="close" />
              </button>
            </div>
            {messageSent ? (
              <div className="message-success">
                <span>
                  <Icon name="check" size={28} />
                </span>
                <h3>Your message is on its way</h3>
                <p>
                  {contactProduct.seller} will receive your inquiry and can reply through AgTech.
                </p>
                <Button
                  onClick={() => {
                    setContactProduct(null)
                    notify('Seller conversation added to your messages.')
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="contact-product">
                  <span>
                    <Icon name={contactProduct.category === 'Equipment' ? 'store' : 'leaf'} />
                  </span>
                  <p>
                    <strong>{contactProduct.name}</strong>
                    <small>
                      {contactProduct.price} · {contactProduct.location}
                    </small>
                  </p>
                </div>
                <label className="contact-message">
                  <span>Message to {contactProduct.seller}</span>
                  <textarea
                    rows={5}
                    value={sellerMessage}
                    onChange={(e) => setSellerMessage(e.target.value)}
                  />
                </label>
                <label className="contact-phone">
                  <input type="checkbox" />
                  <span>Share my mobile number with this seller</span>
                </label>
                <Button onClick={() => void sendInquiry()}>
                  Send inquiry <Icon name="arrow" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {listingOpen && (
        <div
          className="market-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Create marketplace listing"
        >
          <div className="create-listing-card">
            <div className="profile-modal-head">
              <div>
                <span>NEW MARKETPLACE LISTING</span>
                <h2>Sell a product</h2>
              </div>
              <button onClick={() => setListingOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <p>Reach verified buyers and farmers across Bangladesh.</p>
            <div className="listing-photo-upload">
              <Icon name="camera" size={27} />
              <span>
                <strong>Add product photos</strong>
                <small>Clear photos help products sell faster</small>
              </span>
              <button onClick={() => notify('Product photo picker opened.')}>Choose photos</button>
            </div>
            <div className="listing-form">
              <label className="full">
                <span>Product name</span>
                <input
                  value={newListing.name}
                  onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                  placeholder="For example: Fresh Aman rice"
                />
              </label>
              <label>
                <span>Category</span>
                <select
                  value={newListing.category}
                  onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                >
                  <option>Produce</option>
                  <option>Inputs</option>
                  <option>Equipment</option>
                  <option>Livestock</option>
                </select>
              </label>
              <label>
                <span>Location</span>
                <select
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                >
                  <option>Chattogram</option>
                  <option>Dhaka</option>
                  <option>Rangpur</option>
                  <option>Rajshahi</option>
                  <option>Jashore</option>
                  <option>Cumilla</option>
                </select>
              </label>
              <label>
                <span>Price (৳)</span>
                <input
                  inputMode="decimal"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  placeholder="65"
                />
              </label>
              <label>
                <span>Price per</span>
                <select
                  value={newListing.unit}
                  onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                >
                  <option>kg</option>
                  <option>piece</option>
                  <option>bag</option>
                  <option>unit</option>
                </select>
              </label>
              <label className="full">
                <span>Available quantity</span>
                <input
                  value={newListing.quantity}
                  onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                  placeholder="For example: 500"
                />
              </label>
              <label className="full">
                <span>Description</span>
                <textarea
                  rows={4}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  placeholder="Describe quality, harvest date, condition and delivery options..."
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setListingOpen(false)}>Save draft</button>
              <Button onClick={publishListing}>
                Publish listing <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageFrame>
  )
}

function Weather({ notify }: { notify: (s: string) => void }) {
  const locations = {
    Chattogram: { temperatureOffset: 0, rainOffset: 0, windOffset: 0 },
    Dhaka: { temperatureOffset: 3, rainOffset: -10, windOffset: -2 },
    Rangpur: { temperatureOffset: 1, rainOffset: 14, windOffset: 3 },
    Rajshahi: { temperatureOffset: 4, rainOffset: -18, windOffset: 1 },
  } as const
  const days = [
    {
      label: 'Today',
      date: 'Monday, 24 June',
      icon: 'sun',
      high: 28,
      low: 22,
      condition: 'Partly cloudy',
      rain: 38,
      humidity: 75,
      wind: 12,
      uv: 6,
      rainfall: 8,
    },
    {
      label: 'Tue',
      date: 'Tuesday, 25 June',
      icon: 'rain',
      high: 26,
      low: 21,
      condition: 'Monsoon showers',
      rain: 72,
      humidity: 84,
      wind: 17,
      uv: 3,
      rainfall: 24,
    },
    {
      label: 'Wed',
      date: 'Wednesday, 26 June',
      icon: 'sun',
      high: 29,
      low: 23,
      condition: 'Bright intervals',
      rain: 24,
      humidity: 68,
      wind: 9,
      uv: 7,
      rainfall: 4,
    },
    {
      label: 'Thu',
      date: 'Thursday, 27 June',
      icon: 'cloud',
      high: 27,
      low: 22,
      condition: 'Overcast',
      rain: 46,
      humidity: 78,
      wind: 11,
      uv: 4,
      rainfall: 10,
    },
    {
      label: 'Fri',
      date: 'Friday, 28 June',
      icon: 'rain',
      high: 25,
      low: 20,
      condition: 'Heavy showers',
      rain: 82,
      humidity: 88,
      wind: 20,
      uv: 2,
      rainfall: 31,
    },
    {
      label: 'Sat',
      date: 'Saturday, 29 June',
      icon: 'cloud',
      high: 27,
      low: 21,
      condition: 'Cloudy',
      rain: 54,
      humidity: 80,
      wind: 14,
      uv: 4,
      rainfall: 12,
    },
    {
      label: 'Sun',
      date: 'Sunday, 30 June',
      icon: 'sun',
      high: 30,
      low: 23,
      condition: 'Mostly sunny',
      rain: 18,
      humidity: 64,
      wind: 8,
      uv: 8,
      rainfall: 3,
    },
  ] as const
  const [location, setLocation] = useState<keyof typeof locations>('Chattogram')
  const [selectedDay, setSelectedDay] = useState(0)
  const [adviceOpen, setAdviceOpen] = useState(false)
  const [publishedAlerts, setPublishedAlerts] = useState<
    { id: string; title: string; message: string; district: string; severity: string; farmAdvice: string }[]
  >([])

  useEffect(() => {
    let active = true
    fetch('/api/weather-alerts?where[status][equals]=active&limit=20&sort=-createdAt', {
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Weather alerts could not be loaded.')
        return response.json()
      })
      .then((data) => {
        if (!active) return
        const docs = Array.isArray(data.docs) ? data.docs : []
        setPublishedAlerts(
          docs.map((doc: any) => ({
            id: String(doc.id),
            title: String(doc.title || 'Weather advisory'),
            message: String(doc.message || ''),
            district: String(doc.district || 'Bangladesh'),
            severity: String(doc.severity || 'info'),
            farmAdvice: String(doc.farmAdvice || ''),
          })),
        )
      })
      .catch(() => {
        if (active) notify('Published weather alerts are temporarily unavailable.')
      })
    return () => {
      active = false
    }
  }, [])
  const place = locations[location]
  const selected = days[selectedDay]
  const rainChance = Math.min(95, Math.max(5, selected.rain + place.rainOffset))
  const high = selected.high + place.temperatureOffset
  const low = selected.low + place.temperatureOffset
  const wind = selected.wind + place.windOffset
  const rainfallTotal = days.reduce(
    (total, day) => total + Math.max(0, day.rainfall + Math.round(place.rainOffset / 4)),
    0,
  )
  const alert =
    rainChance >= 65
      ? {
          title: `Heavy rain possible on ${selected.label}`,
          summary: 'Delay fertilizer application and secure light equipment before rainfall.',
        }
      : rainChance >= 40
        ? {
            title: `Scattered rain possible on ${selected.label}`,
            summary: 'Keep harvested produce covered and check field drainage before evening.',
          }
        : {
            title: `Low rain risk on ${selected.label}`,
            summary:
              'A useful fieldwork window, with extra water and shade advised during peak heat.',
          }
  const guidance = [
    ['Irrigation', rainChance >= 55 ? 'Skip the next cycle' : 'Check soil before watering', 'rain'],
    ['Spraying', wind > 16 || rainChance > 60 ? 'Avoid today' : 'Best before 3 PM', 'wind'],
    ['Harvest', rainChance > 65 ? 'Finish before noon' : 'Good until 5 PM', 'sun'],
  ] as const

  return (
    <PageFrame dark>
      <PageTop
        eyebrow="WEATHER INTELLIGENCE"
        title="Read the sky. Plan the field."
        text={`Local forecast planning and agricultural guidance for ${location}, Bangladesh.`}
      />
      <section className="weather-cinema">
        <div className="weather-place">
          <label>
            <Icon name="location" size={15} /> FORECAST FOR
            <select
              value={location}
              onChange={(event) => {
                setLocation(event.target.value as keyof typeof locations)
                setSelectedDay(0)
                setAdviceOpen(false)
              }}
              aria-label="Forecast location"
            >
              {Object.keys(locations).map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <Icon name="chevron" size={13} />
          </label>
          <p>
            {selected.date} · {selectedDay === 0 ? '10:24 AM' : 'Daily outlook'}
          </p>
        </div>
        <div className="big-weather">
          <Icon name={selected.icon} size={78} />
          <strong>{high}°</strong>
          <span>
            <b>{selected.condition}</b>
            <small>
              Low {low}° · High {high}°
            </small>
          </span>
        </div>
        <div className="weather-measures">
          <div>
            <Icon name="drop" />
            <span>
              Humidity<strong>{selected.humidity}%</strong>
            </span>
          </div>
          <div>
            <Icon name="wind" />
            <span>
              Wind<strong>{wind} km/h</strong>
            </span>
          </div>
          <div>
            <Icon name="rain" />
            <span>
              Rain chance<strong>{rainChance}%</strong>
            </span>
          </div>
          <div>
            <Icon name="sun" />
            <span>
              UV index
              <strong>
                {selected.uv} {selected.uv >= 6 ? 'high' : selected.uv >= 3 ? 'moderate' : 'low'}
              </strong>
            </span>
          </div>
        </div>
      </section>
      {publishedAlerts.length > 0 && (
        <section className="weather-published-alerts">
          <div className="panel-head">
            <div>
              <span>AGTECH WEATHER NOTICES</span>
              <h2>Published farm alerts</h2>
            </div>
            <span>{publishedAlerts.length} active</span>
          </div>
          {publishedAlerts.map((item) => (
            <article className="farm-alert" key={item.id}>
              <span>!</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.district} · {item.severity.toUpperCase()}</p>
                <p>{item.message}</p>
                <small>{item.farmAdvice}</small>
              </div>
            </article>
          ))}
        </section>
      )}
      <section className={`farm-alert-wrap ${adviceOpen ? 'open' : ''}`}>
        <div className="farm-alert">
          <span>!</span>
          <div>
            <strong>{alert.title}</strong>
            <p>{alert.summary}</p>
          </div>
          <button onClick={() => setAdviceOpen((current) => !current)}>
            {adviceOpen ? 'Hide farm advice' : 'View farm advice'} <Icon name="arrow" />
          </button>
        </div>
        {adviceOpen && (
          <div className="weather-advice-detail">
            <div>
              <span>01</span>
              <p>
                <strong>Protect inputs</strong>
                <small>Keep seed, fertilizer and harvested produce under waterproof cover.</small>
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                <strong>Check drainage</strong>
                <small>Clear field channels and avoid standing water around young crops.</small>
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                <strong>Plan fieldwork</strong>
                <small>
                  Use the lower-risk hours before spraying, harvesting or applying inputs.
                </small>
              </p>
            </div>
            <button onClick={() => notify(`${location} weather alert enabled.`)}>
              Enable alert for {location}
            </button>
          </div>
        )}
      </section>
      <section className="forecast-week">
        <div className="panel-head">
          <div>
            <span>7-DAY OUTLOOK</span>
            <h2>This week in {location}</h2>
          </div>
          <small>Select a day for field guidance</small>
        </div>
        <div>
          {days.map((day, index) => (
            <button
              className={selectedDay === index ? 'active' : ''}
              onClick={() => {
                setSelectedDay(index)
                setAdviceOpen(false)
              }}
              key={day.label}
              aria-pressed={selectedDay === index}
            >
              <span>{day.label}</span>
              <Icon name={day.icon} size={30} />
              <strong>{day.high + place.temperatureOffset}°</strong>
              <small>{day.low + place.temperatureOffset}°</small>
              <i style={{ height: `${(day.high + place.temperatureOffset) * 2.3}px` }} />
            </button>
          ))}
        </div>
      </section>
      <div className="weather-lower">
        <section className="panel">
          <span className="panel-label">RAINFALL OUTLOOK</span>
          <h2>{rainfallTotal} mm expected this week</h2>
          <div className="rain-chart">
            {days.map((day, i) => (
              <span key={i}>
                <i
                  style={{
                    height: `${Math.min(95, Math.max(8, day.rain + place.rainOffset))}%`,
                  }}
                />
                <small>{day.label}</small>
              </span>
            ))}
          </div>
        </section>
        <section className="panel farm-guidance">
          <span className="panel-label">{selected.label.toUpperCase()}’S FARM GUIDANCE</span>
          {guidance.map(([a, b, c]) => (
            <div key={a}>
              <span>
                <Icon name={c as IconName} />
              </span>
              <p>
                <strong>{a}</strong>
                <small>{b}</small>
              </p>
              <Icon name="check" />
            </div>
          ))}
        </section>
      </div>
    </PageFrame>
  )
}

function Profile({ notify, role }: { notify: (s: string) => void; role: AccountRole }) {
  return role === 'Farmer' ? (
    <FarmerProfile notify={notify} />
  ) : (
    <ProfessionalProfile role={role} notify={notify} />
  )
}

function FarmerProfile({ notify }: { notify: (s: string) => void }) {
  const [tab, setTab] = useState('Farm details')
  const [editing, setEditing] = useState(false)
  const [settings, setSettings] = useState<
    '' | 'Account information' | 'Notifications' | 'Privacy & security'
  >('')
  const [avatarPhoto, setAvatarPhoto] = useState('')
  const avatarInput = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState({
    name: 'Md. Rahim Uddin',
    location: 'Hathazari, Chattogram',
    phone: '+880 1712 345678',
    email: 'rahim.farm@example.com',
    bio: 'Second-generation farmer growing rice, tomato and seasonal vegetables with a focus on responsible water use and healthy soil.',
    land: '19.6',
    crop: 'Aman rice',
    experience: '14',
    type: 'Mixed cultivation',
  })
  const [draft, setDraft] = useState(profile)
  const [alerts, setAlerts] = useState({
    weather: true,
    disease: true,
    market: false,
    community: true,
  })

  const openEditor = () => {
    setDraft(profile)
    setEditing(true)
  }

  const saveProfile = () => {
    setProfile(draft)
    setEditing(false)
    notify('Your profile has been updated.')
  }

  const chooseAvatar = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPhoto(String(reader.result))
      notify('Profile photo updated.')
    }
    reader.readAsDataURL(file)
  }

  const listings = [
    ['Fresh Aman rice', 'Produce', '৳65 / kg', 'Active', '86 views'],
    ['Tomato harvest', 'Produce', '৳40 / kg', 'Active', '42 views'],
    ['Used irrigation pipe', 'Equipment', '৳2,200', 'Sold', '119 views'],
  ]
  const activities = [
    ['scan', 'Crop diagnosis completed', 'Early blight detected in East Ridge', 'Today, 10:42 AM'],
    ['store', 'Marketplace listing published', 'Fresh Aman rice · ৳65 / kg', 'Yesterday'],
    ['message', 'Community answer received', 'Dr. Farhana replied to your question', '22 June'],
    ['cloud', 'Weather alert viewed', 'Heavy rain advisory for Chattogram', '21 June'],
  ] as const
  const saved = [
    ['book', 'Managing rice blast in humid weather', 'Disease guide · 8 min read'],
    ['users', 'Dr. Farhana Akter', 'Soil & fertilizer specialist'],
    ['message', 'Best time to apply urea after rain?', 'Community discussion · 24 replies'],
  ] as const

  return (
    <PageFrame>
      <section className="profile-hero">
        <div className={`profile-avatar ${avatarPhoto ? 'has-photo' : ''}`}>
          {avatarPhoto ? (
            <Image
              src={avatarPhoto}
              alt={`${profile.name} profile`}
              width={90}
              height={90}
              unoptimized
            />
          ) : (
            'MR'
          )}
          <button onClick={() => avatarInput.current?.click()} aria-label="Change profile photo">
            <Icon name="camera" size={15} />
          </button>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={(event) => chooseAvatar(event.target.files?.[0])}
          />
        </div>
        <div>
          <span>FARMER PROFILE</span>
          <h1>{profile.name}</h1>
          <p>
            <Icon name="location" size={15} /> {profile.location} · Member since 2023
          </p>
        </div>
        <button onClick={openEditor}>Edit profile</button>
      </section>
      <div className="profile-tabs">
        {['Farm details', 'My listings', 'Activity', 'Saved'].map((t) => (
          <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>
            {t}
          </button>
        ))}
      </div>
      <div className="profile-layout">
        <section className="panel profile-main">
          <span className="panel-label">{tab.toUpperCase()}</span>
          <h2>{tab === 'Farm details' ? 'About the farm' : tab}</h2>
          {tab === 'Farm details' ? (
            <>
              <p className="bio">{profile.bio}</p>
              <div className="farm-info">
                {[
                  ['Total land', `${profile.land} hectares`],
                  ['Primary crop', profile.crop],
                  ['Experience', `${profile.experience} years`],
                  ['Farming type', profile.type],
                ].map((x) => (
                  <div key={x[0]}>
                    <span>{x[0]}</span>
                    <strong>{x[1]}</strong>
                  </div>
                ))}
              </div>
              <h3>Active fields</h3>
              {fields.map((f) => (
                <div className="profile-field" key={f.name}>
                  <span>
                    <Icon name="leaf" />
                  </span>
                  <p>
                    <strong>{f.name}</strong>
                    <small>
                      {f.crop} · {f.area}
                    </small>
                  </p>
                  <b>{f.health}% healthy</b>
                </div>
              ))}
            </>
          ) : tab === 'My listings' ? (
            <div className="profile-listings">
              <div className="profile-section-head">
                <p>Products you have offered to the AgTech community.</p>
                <button onClick={() => notify('New marketplace listing opened.')}>
                  <Icon name="plus" size={15} /> New listing
                </button>
              </div>
              {listings.map((listing, i) => (
                <article key={listing[0]}>
                  <span className={`listing-visual l${i}`}>
                    <Icon name={i === 2 ? 'store' : 'leaf'} />
                  </span>
                  <div>
                    <small>{listing[1].toUpperCase()}</small>
                    <strong>{listing[0]}</strong>
                    <span>{listing[4]}</span>
                  </div>
                  <b>{listing[2]}</b>
                  <i className={listing[3] === 'Sold' ? 'sold' : ''}>{listing[3]}</i>
                  <button onClick={() => notify(`${listing[0]} listing options opened.`)}>
                    •••
                  </button>
                </article>
              ))}
            </div>
          ) : tab === 'Activity' ? (
            <div className="profile-activity">
              <p className="section-note">
                A private record of your recent activity across AgTech.
              </p>
              {activities.map(([icon, title, detail, time]) => (
                <article key={title}>
                  <span>
                    <Icon name={icon} />
                  </span>
                  <p>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </p>
                  <time>{time}</time>
                </article>
              ))}
            </div>
          ) : (
            <div className="saved-list">
              <p className="section-note">Guides, experts and discussions saved for later.</p>
              {saved.map(([icon, title, detail]) => (
                <article key={title}>
                  <span>
                    <Icon name={icon} />
                  </span>
                  <p>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </p>
                  <button onClick={() => notify(`Opened ${title}.`)}>
                    <Icon name="arrow" size={17} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside>
          <section className="panel profile-complete">
            <span className="panel-label">PROFILE STRENGTH</span>
            <div className="completion-ring">84%</div>
            <h3>Your profile looks strong</h3>
            <p>Add a farm photo to help buyers and experts know you better.</p>
            <button onClick={() => avatarInput.current?.click()}>Complete profile</button>
          </section>
          <section className="panel account-list">
            {(['Account information', 'Notifications', 'Privacy & security'] as const).map(
              (item) => (
                <button key={item} onClick={() => setSettings(item)}>
                  {item} <Icon name="chevron" />
                </button>
              ),
            )}
          </section>
        </aside>
      </div>
      {editing && (
        <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Edit profile">
          <div className="profile-modal-card">
            <div className="profile-modal-head">
              <div>
                <span>PROFILE SETTINGS</span>
                <h2>Edit your profile</h2>
              </div>
              <button onClick={() => setEditing(false)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="edit-grid">
              <label>
                <span>Full name</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                <span>Location</span>
                <input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </label>
              <label>
                <span>Mobile number</span>
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </label>
              <label>
                <span>Email address</span>
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </label>
              <label>
                <span>Total land (hectares)</span>
                <input
                  value={draft.land}
                  onChange={(e) => setDraft({ ...draft, land: e.target.value })}
                />
              </label>
              <label>
                <span>Primary crop</span>
                <input
                  value={draft.crop}
                  onChange={(e) => setDraft({ ...draft, crop: e.target.value })}
                />
              </label>
              <label>
                <span>Years of experience</span>
                <input
                  value={draft.experience}
                  onChange={(e) => setDraft({ ...draft, experience: e.target.value })}
                />
              </label>
              <label>
                <span>Farming type</span>
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                >
                  <option>Mixed cultivation</option>
                  <option>Crop farming</option>
                  <option>Organic farming</option>
                  <option>Livestock & crops</option>
                </select>
              </label>
              <label className="full">
                <span>About your farm</span>
                <textarea
                  rows={4}
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <Button onClick={saveProfile}>Save changes</Button>
            </div>
          </div>
        </div>
      )}
      {settings && (
        <div className="profile-modal" role="dialog" aria-modal="true" aria-label={settings}>
          <div className="profile-modal-card settings-card">
            <div className="profile-modal-head">
              <div>
                <span>ACCOUNT SETTINGS</span>
                <h2>{settings}</h2>
              </div>
              <button onClick={() => setSettings('')}>
                <Icon name="close" />
              </button>
            </div>
            {settings === 'Account information' && (
              <div className="settings-summary">
                <div>
                  <span>Full name</span>
                  <strong>{profile.name}</strong>
                </div>
                <div>
                  <span>Mobile</span>
                  <strong>{profile.phone}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div>
                  <span>Account type</span>
                  <strong>Farmer</strong>
                </div>
                <button
                  onClick={() => {
                    setSettings('')
                    openEditor()
                  }}
                >
                  Edit account details
                </button>
              </div>
            )}
            {settings === 'Notifications' && (
              <div className="notification-settings">
                {Object.entries(alerts).map(([key, value]) => (
                  <label key={key}>
                    <span>
                      <strong>{key[0].toUpperCase() + key.slice(1)} alerts</strong>
                      <small>
                        {key === 'weather'
                          ? 'Severe weather and field advisories'
                          : key === 'disease'
                            ? 'Crop scan results and treatment reminders'
                            : key === 'market'
                              ? 'Price changes and buyer messages'
                              : 'Replies and expert answers'}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setAlerts({ ...alerts, [key]: !value })}
                    />
                    <i />
                  </label>
                ))}
                <Button
                  onClick={() => {
                    setSettings('')
                    notify('Notification preferences saved.')
                  }}
                >
                  Save preferences
                </Button>
              </div>
            )}
            {settings === 'Privacy & security' && (
              <PrivacySecurity notify={notify} onClose={() => setSettings('')} />
            )}
          </div>
        </div>
      )}
    </PageFrame>
  )
}

function PrivacySecurity({
  notify,
  onClose,
}: {
  notify: (message: string) => void
  onClose: () => void
}) {
  const [view, setView] = useState<'overview' | 'password' | 'devices'>('overview')
  const [preferences, setPreferences] = useState({
    twoStep: false,
    publicProfile: true,
    activityStatus: true,
    dataInsights: false,
  })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Chrome on Linux',
      place: 'Chattogram, Bangladesh',
      current: true,
      time: 'Active now',
    },
    {
      id: 2,
      name: 'AgTech on Android',
      place: 'Hathazari, Bangladesh',
      current: false,
      time: '2 hours ago',
    },
    {
      id: 3,
      name: 'Chrome on Android',
      place: 'Dhaka, Bangladesh',
      current: false,
      time: '18 June',
    },
  ])

  const updatePassword = async () => {
    if (!passwords.current || passwords.next.length < 8 || passwords.next !== passwords.confirm) {
      notify('Check your current password and make sure the new passwords match.')
      return
    }

    try {
      // Re-authenticate first so a stolen browser session alone is not enough
      // to change the account password.
      const verification = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: (await fetch('/api/users/me', { credentials: 'include' }).then((response) =>
            response.ok ? response.json() : null
          ))?.user?.email,
          password: passwords.current,
        }),
      })

      if (!verification.ok) {
        notify('Your current password is incorrect. Please try again.')
        return
      }

      const meResponse = await fetch('/api/users/me', { credentials: 'include' })
      const meData = meResponse.ok ? await meResponse.json() : null
      const userID = meData?.user?.id
      if (!userID) {
        notify('Your session could not be verified. Please sign in again.')
        return
      }

      const updateResponse = await fetch(`/api/users/${userID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: passwords.next }),
      })
      if (!updateResponse.ok) {
        const updateData = await updateResponse.json().catch(() => ({}))
        throw new Error(
          updateData.errors?.[0]?.message ||
            updateData.message ||
            'The password could not be updated.',
        )
      }

      setPasswords({ current: '', next: '', confirm: '' })
      setView('overview')
      notify('Your password was changed successfully.')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'The password could not be updated.')
    }
  }

  if (view === 'password') {
    return (
      <div className="security-view">
        <button className="security-back" onClick={() => setView('overview')}>
          <Icon name="arrow" size={15} /> Back to security
        </button>
        <div className="security-view-title">
          <span className="security-symbol">
            <Icon name="check" />
          </span>
          <div>
            <h3>Change your password</h3>
            <p>Use at least 8 characters with a mix of letters and numbers.</p>
          </div>
        </div>
        <div className="password-form">
          <label>
            <span>Current password</span>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Enter current password"
            />
          </label>
          <label>
            <span>New password</span>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              placeholder="At least 8 characters"
            />
          </label>
          <label>
            <span>Confirm new password</span>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Repeat new password"
            />
          </label>
          <div className="password-strength">
            <span className={passwords.next.length >= 8 ? 'filled' : ''} />
            <span className={passwords.next.length >= 10 ? 'filled' : ''} />
            <span className={passwords.next.length >= 12 ? 'filled' : ''} />
            <small>
              {passwords.next.length >= 12
                ? 'Strong password'
                : passwords.next.length >= 8
                  ? 'Good password'
                  : 'Use 8 or more characters'}
            </small>
          </div>
          <Button onClick={updatePassword}>Update password</Button>
        </div>
      </div>
    )
  }

  if (view === 'devices') {
    return (
      <div className="security-view">
        <button className="security-back" onClick={() => setView('overview')}>
          <Icon name="arrow" size={15} /> Back to security
        </button>
        <div className="security-view-title">
          <span className="security-symbol">
            <Icon name="grid" />
          </span>
          <div>
            <h3>Where you’re signed in</h3>
            <p>Review devices with access to your AgTech account.</p>
          </div>
        </div>
        <div className="device-list">
          {devices.map((device) => (
            <article key={device.id}>
              <span>
                <Icon name={device.current ? 'grid' : 'user'} />
              </span>
              <p>
                <strong>
                  {device.name}
                  {device.current && <i>CURRENT</i>}
                </strong>
                <small>
                  {device.place} · {device.time}
                </small>
              </p>
              {!device.current && (
                <button
                  onClick={() => {
                    setDevices((current) => current.filter((item) => item.id !== device.id))
                    notify(`${device.name} was signed out.`)
                  }}
                >
                  Sign out
                </button>
              )}
            </article>
          ))}
        </div>
        <button
          className="signout-all"
          onClick={() => {
            setDevices((current) => current.filter((device) => device.current))
            notify('All other devices were signed out.')
          }}
        >
          Sign out all other devices
        </button>
      </div>
    )
  }

  const securityScore = preferences.twoStep ? 100 : 78
  return (
    <div className="security-overview">
      <div className="security-score">
        <div style={{ '--score': `${securityScore * 3.6}deg` } as CSSProperties}>
          <span>{securityScore}%</span>
        </div>
        <p>
          <strong>
            {preferences.twoStep ? 'Excellent protection' : 'Your account is protected'}
          </strong>
          <small>
            {preferences.twoStep
              ? 'All recommended security features are active.'
              : 'Turn on two-step verification for stronger security.'}
          </small>
        </p>
      </div>
      <div className="security-group">
        <span className="security-group-label">LOGIN & ACCESS</span>
        <button onClick={() => setView('password')}>
          <span className="security-item-icon">
            <Icon name="check" />
          </span>
          <p>
            <strong>Password</strong>
            <small>Last changed 4 months ago</small>
          </p>
          <Icon name="chevron" />
        </button>
        <button onClick={() => setView('devices')}>
          <span className="security-item-icon">
            <Icon name="grid" />
          </span>
          <p>
            <strong>Login devices</strong>
            <small>{devices.length} active devices</small>
          </p>
          <Icon name="chevron" />
        </button>
        <label>
          <span className="security-item-icon">
            <Icon name="user" />
          </span>
          <p>
            <strong>Two-step verification</strong>
            <small>Require a code when signing in on a new device</small>
          </p>
          <input
            type="checkbox"
            checked={preferences.twoStep}
            onChange={() => setPreferences({ ...preferences, twoStep: !preferences.twoStep })}
          />
          <i />
        </label>
      </div>
      <div className="security-group">
        <span className="security-group-label">PRIVACY CONTROLS</span>
        {[
          ['publicProfile', 'Profile visibility', 'Let verified AgTech members find your profile'],
          ['activityStatus', 'Activity status', 'Show when you are recently active'],
          ['dataInsights', 'Personalised insights', 'Use farm activity to improve recommendations'],
        ].map(([key, title, detail]) => (
          <label key={key}>
            <span className="security-item-icon">
              <Icon
                name={
                  key === 'publicProfile'
                    ? 'user'
                    : key === 'activityStatus'
                      ? 'message'
                      : 'sparkle'
                }
              />
            </span>
            <p>
              <strong>{title}</strong>
              <small>{detail}</small>
            </p>
            <input
              type="checkbox"
              checked={preferences[key as keyof typeof preferences]}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  [key]: !preferences[key as keyof typeof preferences],
                })
              }
            />
            <i />
          </label>
        ))}
      </div>
      <div className="privacy-note">
        <Icon name="check" />
        <p>
          <strong>Your information stays yours.</strong>
          <small>AgTech never sells personal or farm information to third parties.</small>
        </p>
      </div>
      <div className="security-actions">
        <button onClick={() => notify('A copy of your account data is being prepared.')}>
          Download my data
        </button>
        <Button
          onClick={() => {
            onClose()
            notify('Privacy and security preferences saved.')
          }}
        >
          Save security settings
        </Button>
      </div>
    </div>
  )
}

function ProfessionalProfile({
  role,
  notify,
}: {
  role: Exclude<AccountRole, 'Farmer'>
  notify: (s: string) => void
}) {
  const isExpert = role === 'Agronomist'
  const [tab, setTab] = useState(isExpert ? 'Expert profile' : 'Business details')
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const tabs = isExpert
    ? ['Expert profile', 'Consultations', 'Answers', 'Reviews']
    : ['Business details', 'Orders', 'Suppliers', 'Listings']
  return (
    <PageFrame>
      <section className={`profile-hero professional ${isExpert ? 'agronomist' : 'business'}`}>
        <div className="profile-avatar">
          {isExpert ? 'DA' : 'BF'}
          <button onClick={() => notify('Profile photo upload opened.')}>
            <Icon name="camera" size={15} />
          </button>
        </div>
        <div>
          <span>{isExpert ? 'VERIFIED AGRONOMIST' : 'VERIFIED AGRIBUSINESS'}</span>
          <h1>{isExpert ? 'Dr. Farhana Akter' : 'Bengal Foods Ltd.'}</h1>
          <p>
            <Icon name="location" size={15} />{' '}
            {isExpert
              ? 'Mymensingh, Bangladesh · Soil & fertilizer specialist'
              : 'Agrabad, Chattogram · Produce buyer & distributor'}
          </p>
        </div>
        <button onClick={() => notify(`${role} profile editor opened.`)}>Edit profile</button>
      </section>
      <div className="profile-tabs">
        {tabs.map((t) => (
          <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>
            {t}
          </button>
        ))}
      </div>
      <div className="profile-layout">
        <section className="panel profile-main">
          <span className="panel-label">{tab.toUpperCase()}</span>
          <h2>{tab}</h2>
          {tab === tabs[0] ? (
            <>
              <p className="bio">
                {isExpert
                  ? 'Agronomist with 11 years of field and research experience in soil health, fertilizer planning and sustainable rice production.'
                  : 'Regional food sourcing and distribution business connecting verified Bangladeshi farms with retailers, restaurants and food processors.'}
              </p>
              <div className="farm-info">
                {(isExpert
                  ? [
                      ['Specialty', 'Soil & fertilizer'],
                      ['Experience', '11 years'],
                      ['Rating', '4.9 / 5'],
                      ['Languages', 'Bangla, English'],
                    ]
                  : [
                      ['Business type', 'Buyer & distributor'],
                      ['Operating since', '2016'],
                      ['Farm partners', '34 verified'],
                      ['Service area', '6 districts'],
                    ]
                ).map((x) => (
                  <div key={x[0]}>
                    <span>{x[0]}</span>
                    <strong>{x[1]}</strong>
                  </div>
                ))}
              </div>
              <h3>{isExpert ? 'Professional credentials' : 'Business verification'}</h3>
              {(isExpert
                ? [
                    ['Bangladesh Agricultural University', 'MSc in Soil Science'],
                    ['AgTech verified expert', 'Identity and credentials confirmed'],
                    ['126 consultations completed', '94% response rate'],
                  ]
                : [
                    ['Trade licence verified', 'Chattogram City Corporation'],
                    ['Business identity confirmed', 'AgTech verification complete'],
                    ['34 trusted suppliers', '96% order fulfilment rate'],
                  ]
              ).map((x, i) => (
                <div className="profile-field" key={x[0]}>
                  <span>
                    <Icon name={i === 0 ? 'book' : 'check'} />
                  </span>
                  <p>
                    <strong>{x[0]}</strong>
                    <small>{x[1]}</small>
                  </p>
                  <b>Verified</b>
                </div>
              ))}
            </>
          ) : (
            <div className="professional-records">
              {(isExpert
                ? [
                    ['Md. Rahim Uddin', 'Tomato leaf consultation', 'Today'],
                    ['Abdul Karim', 'Rice pest guidance', 'Yesterday'],
                    ['Nusrat Jahan', 'Soil nutrition plan', '20 June'],
                  ]
                : [
                    ['Aman rice order', '5,000 kg · 68% fulfilled', 'Active'],
                    ['Rahim Agro Farm', 'Verified supplier · Chattogram', 'Partner'],
                    ['Tomato buying request', '1,200 kg · ৳40/kg', 'Active'],
                  ]
              ).map((x, i) => (
                <article key={x[0]}>
                  <span>
                    <Icon name={isExpert ? 'users' : 'store'} />
                  </span>
                  <p>
                    <strong>{x[0]}</strong>
                    <small>{x[1]}</small>
                  </p>
                  <b>{x[2]}</b>
                  <button onClick={() => notify(`${x[0]} opened.`)}>
                    <Icon name="chevron" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside>
          <section className="panel professional-score">
            <span className="panel-label">
              {isExpert ? 'EXPERT PERFORMANCE' : 'BUSINESS TRUST SCORE'}
            </span>
            <div className="completion-ring">{isExpert ? '4.9' : '96%'}</div>
            <h3>{isExpert ? 'Highly recommended' : 'Excellent standing'}</h3>
            <p>
              {isExpert
                ? 'Based on 126 farmer consultations.'
                : 'Based on orders, payments and farmer reviews.'}
            </p>
          </section>
          <section className="panel account-list">
            {['Account information', 'Notifications', 'Privacy & security'].map((x) => (
              <button
                onClick={() =>
                  x === 'Privacy & security' ? setPrivacyOpen(true) : notify(`${x} opened.`)
                }
                key={x}
              >
                {x}
                <Icon name="chevron" />
              </button>
            ))}
          </section>
        </aside>
      </div>
      {privacyOpen && (
        <div
          className="profile-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Privacy and security"
        >
          <div className="profile-modal-card settings-card security-modal-card">
            <div className="profile-modal-head">
              <div>
                <span>ACCOUNT SETTINGS</span>
                <h2>Privacy & security</h2>
              </div>
              <button onClick={() => setPrivacyOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <PrivacySecurity notify={notify} onClose={() => setPrivacyOpen(false)} />
          </div>
        </div>
      )}
    </PageFrame>
  )
}

function Login({
  go,
  notify,
  onAuthenticate,
}: {
  go: (p: Page) => void
  notify: (s: string) => void
  onAuthenticate: (role: AccountRole) => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<AccountRole>('Farmer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (busy) return
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email address and password.')
      return
    }
    if (mode === 'register' && !fullName.trim()) {
      setError('Enter your full name.')
      return
    }
    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'register') {
        const registerResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phone.trim() || undefined,
            role: role.toLowerCase(),
          }),
        })
        const registerData = await registerResponse.json().catch(() => ({}))
        if (!registerResponse.ok) {
          const message =
            registerData.errors?.[0]?.message ||
            registerData.message ||
            'We could not create your account. Check your details and try again.'
          throw new Error(message)
        }
      }

      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })
      const loginData = await loginResponse.json().catch(() => ({}))
      if (!loginResponse.ok) {
        const message =
          loginData.errors?.[0]?.message ||
          loginData.message ||
          'Sign in failed. Check your email and password.'
        throw new Error(message)
      }

      const user = loginData.user ?? loginData.doc
      const serverRole = String(user?.role || 'farmer').toLowerCase()
      const verifiedRole: AccountRole =
        serverRole === 'agronomist'
          ? 'Agronomist'
          : serverRole === 'business'
            ? 'Business'
            : 'Farmer'

      onAuthenticate(verifiedRole)
      notify(mode === 'login' ? 'You are signed in.' : `Your ${verifiedRole} account is ready.`)
      go('Dashboard')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Image
          src="/agtech-hero.svg"
          alt="Bangladeshi farmer in a rice field"
          fill
          priority
          sizes="(max-width: 760px) 0px, 53vw"
          unoptimized
        />
        <Logo />
        <button onClick={() => go('Home')}>Back to home</button>
        <blockquote>“Better decisions begin with better information.”</blockquote>
        <p>Built for the people growing Bangladesh.</p>
      </div>
      <div className="auth-form">
        <div className="auth-mobile-logo">
          <Logo dark />
        </div>
        <span className="auth-step">
          {mode === 'login' ? 'WELCOME BACK' : 'CREATE YOUR ACCOUNT'}
        </span>
        <h1>{mode === 'login' ? 'Continue your work.' : 'Start growing smarter.'}</h1>
        <p>
          {mode === 'login'
            ? 'Sign in to your AgTech account.'
            : 'Choose your role and join the AgTech community.'}
        </p>
        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login')
              setError('')
            }}
          >
            Sign in
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register')
              setError('')
            }}
          >
            Register
          </button>
        </div>
        {mode === 'register' && (
          <>
            <label className="form-label">I am joining as</label>
            <div className="role-grid">
              {(
                [
                  ['Farmer', 'leaf'],
                  ['Agronomist', 'users'],
                  ['Business', 'store'],
                ] as const
              ).map(([r, i]) => (
                <button
                  className={role === r ? 'active' : ''}
                  onClick={() => setRole(r)}
                  key={r}
                  type="button"
                >
                  <Icon name={i} />
                  <span>{r}</span>
                </button>
              ))}
            </div>
            <label>
              <span>Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
            <label>
              <span>Mobile number (optional)</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880 1XXX XXXXXX"
                autoComplete="tel"
              />
            </label>
          </>
        )}
        <label>
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={8}
          />
        </label>
        {error && (
          <p role="alert" style={{ color: '#b42318', fontSize: 13, lineHeight: 1.5 }}>
            {error}
          </p>
        )}
        <Button onClick={() => void submit()}>
          {busy
            ? 'Please wait...'
            : mode === 'login'
              ? 'Sign in to AgTech'
              : 'Create my account'}{' '}
          <Icon name="arrow" />
        </Button>
        <p className="terms">
          By continuing, you agree to AgTech’s Terms and Privacy Policy. Authentication is handled
          securely by AgTech.
        </p>
      </div>
    </div>
  )
}

function PageFrame({
  children,
  dark = false,
  className = '',
}: {
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return <main className={`page-frame ${dark ? 'dark-frame' : ''} ${className}`}>{children}</main>
}

function Footer({ go }: { go: (p: Page) => void }) {
  const t = useTranslation()
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Logo />
          <p>
            Smarter tools for the people
            <br />
            who grow Bangladesh.
          </p>
        </div>
        <div>
          <span>{t('PLATFORM')}</span>
          {nav.slice(0, 4).map((n) => (
            <button key={n.page} onClick={() => go(n.page)}>
              {t(n.label)}
            </button>
          ))}
        </div>
        <div>
          <span>{t('MARKET & WEATHER')}</span>
          {nav.slice(4).map((n) => (
            <button key={n.page} onClick={() => go(n.page)}>
              {t(n.label)}
            </button>
          ))}
          <button onClick={() => go('Profile')}>{t('My profile')}</button>
        </div>
        <div>
          <span>{t('STAY INFORMED')}</span>
          <p>{t('Farm alerts and weekly guidance.')}</p>
          <div className="subscribe">
            <input placeholder={t('Mobile or email')} />
            <button>
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 AgTech Bangladesh</span>
        <span>বাংলাদেশের কৃষকের পাশে</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>('Home')
  const [accountRole, setAccountRole] = useState<AccountRole>('Farmer')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<Theme>('light')
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    let active = true
    fetch('/api/users/me', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((data) => {
        if (!active || !data?.user) return
        const serverRole = String(data.user.role || 'farmer').toLowerCase()
        setAccountRole(
          serverRole === 'agronomist'
            ? 'Agronomist'
            : serverRole === 'business'
              ? 'Business'
              : 'Farmer',
        )
        setIsAuthenticated(true)
      })
      .catch(() => {
        // A visitor without a session is expected to receive an auth response.
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('agtech-theme')
    const savedLanguage = window.localStorage.getItem('agtech-language')
    setTheme(
      savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
    )
    if (savedLanguage === 'bn' || savedLanguage === 'en') setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en'
    window.localStorage.setItem('agtech-theme', theme)
    window.localStorage.setItem('agtech-language', language)
  }, [theme, language])

  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const notify = (s: string) => {
    setToast(s)
    window.setTimeout(() => setToast(''), 3000)
  }
  const signOut = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Sign out failed')
      setIsAuthenticated(false)
      setAccountRole('Farmer')
      notify('You have signed out.')
      go('Home')
    } catch {
      notify('Could not sign out. Please try again.')
    }
  }
  return (
    <LanguageContext.Provider value={language}>
      <div className={`app-shell theme-${theme} language-${language}`}>
        {page !== 'Login' && (
          <Header
            page={page}
            go={go}
            role={accountRole}
            theme={theme}
            language={language}
            onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            onToggleLanguage={() => setLanguage((current) => (current === 'en' ? 'bn' : 'en'))}
            isAuthenticated={isAuthenticated}
            onSignOut={() => void signOut()}
          />
        )}
        {page === 'Home' && <Home go={go} />}
        {page === 'Dashboard' && <Dashboard go={go} notify={notify} role={accountRole} />}
        {page === 'Knowledge' && <Knowledge notify={notify} go={go} />}
        {page === 'Disease' && <Disease notify={notify} />}
        {page === 'Experts' && <Experts notify={notify} />}
        {page === 'Marketplace' && <Marketplace notify={notify} />}
        {page === 'Weather' && <Weather notify={notify} />}
        {page === 'Profile' && <Profile notify={notify} role={accountRole} />}
        {page === 'Login' && (
          <Login
            go={go}
            notify={(message) => {
              setIsAuthenticated(true)
              notify(message)
            }}
            onAuthenticate={setAccountRole}
          />
        )}
        {toast && (
          <div className="toast">
            <span>
              <Icon name="check" size={15} />
            </span>
            {toast}
          </div>
        )}
      </div>
    </LanguageContext.Provider>
  )
}
