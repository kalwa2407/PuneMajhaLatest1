// Centralized brand, contact, domain, social, and theme configuration for Pune Majha News.
// Safe for both Server Components/API routes and Client Components (no server-only imports).

export const siteConfig = {
  brand: {
    name: 'Pune Majha News',
    shortName: 'Pune Majha',
    tagline: 'News 24x7',
    localizedName: {
      en: 'Pune Majha News',
      hi: 'पुणे माझा न्यूज़',
      mr: 'पुणे माझा न्यूज',
    },
    motto: {
      en: 'Voice of Your Rights!',
      hi: 'आवाज़ आपके हक़ की!',
      mr: 'आवाज आपल्या हक्काचा !',
    },
    description:
      'Pune Majha News — Credible, ethical, and fast 24x7 digital news, Pune city updates, business directory, classifieds, and e-paper.',
    copyright: 'Pune Majha News',
    credit: {
      en: 'Made by InfraTech.AI',
      hi: 'InfraTech.AI द्वारा निर्मित',
      mr: 'InfraTech.AI द्वारे निर्मित',
    },
    chiefEditor: {
      en: 'Riyaz Mulla',
      hi: 'रियाज़ मुल्ला',
      mr: 'रियाज मुल्ला',
    },
    defaultAuthor: 'Pune Majha News',
    adminAuthorLabel: 'Pune Majha Desk',
  },

  assets: {
    logo: '/punemajha-logo.png',
    favicon: '/punemajha-favicon.png',
    appleIcon: '/apple-touch-icon.png',
    epaperPreview: '/punemajha-epaper.jpg',
    placeholderNews: '/placeholder-news.svg',
  },

  domains: {
    primary: 'https://www.punemajhanews.in',
    allowedHosts: [
      'punemajhanews.in',
      'www.punemajhanews.in',
      'punemajha.in',
      'www.punemajha.in',
    ],
  },

  contact: {
    phoneDisplay: '+91 70208 73300',
    phoneHref: 'tel:+917020873300',
    secondaryPhoneDisplay: '+91 88887 70606',
    secondaryPhoneHref: 'tel:+918888770606',
    whatsappNumber: '917020873300',
    email: 'punemajhanews@gmail.com',
    editorialEmail: 'punemajhanews@gmail.com',
    legalEmail: 'punemajhanews@gmail.com',
    address: {
      en: 'B-Wing, Jai Ganesh Vishwa Complex, Vishrantwadi, Pune, Maharashtra - 411015',
      hi: 'बी-विंग, जय गणेश विश्व कॉम्प्लेक्स, विश्रांतवाड़ी, पुणे, महाराष्ट्र - 411015',
      mr: 'बी-विंग, जय गणेश विश्व कॉम्प्लेक्स, विश्रांतवाडी, पुणे, महाराष्ट्र - 411015',
    },
    shortLocation: {
      en: 'Pune, Maharashtra, India',
      hi: 'पुणे, महाराष्ट्र, भारत',
      mr: 'पुणे, महाराष्ट्र, भारत',
    },
  },

  social: {
    facebook: 'https://www.facebook.com/PUNE-MAJHA-24X7-111185983622315/',
    whatsapp: 'https://wa.me/917020873300',
    instagram: '',
    youtube: 'https://www.youtube.com/@punemajhanews',
    youtubeSubscribe: 'https://www.youtube.com/@punemajhanews?sub_confirmation=1',
    twitter: '',
    handle: 'punemajhanews',
  },

  youtube: {
    channelId: 'UC-yLF-hmUSngszzGt9nrQDw',
    channelName: 'Pune Majha News',
    defaultLiveStreamId: 'punemajha-live',
    defaultVideoId: 'Fgnsf4cAQyw',
  },

  forms: {
    reporterGoogleFormUrl: (process.env.NEXT_PUBLIC_REPORTER_GOOGLE_FORM_URL || '').trim(),
  },

  storageKeys: {
    language: 'puneMajhaLanguage',
    legacyLanguage: 'starNewsLanguage',
    contentSettings: 'punemajha_content_settings',
  },

  auth: {
    // Additional verified bootstrap admin emails beyond Firestore `users/{uid}.role === 'super_admin'`.
    adminEmails: [
      ...(process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean) : []),
      ...(process.env.NEXT_PUBLIC_ADMIN_EMAIL ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean) : []),
      'punemajhanews@gmail.com',
    ],
  },

  theme: {
    navy: '#1E296B',
    navyDark: '#131B4D',
    navyLight: '#2A3990',
    crimson: '#DC2626',
    crimsonBright: '#EC2027',
    maroon: '#8B1E24',
    gold: '#F59E0B',
  },

  tickerDefaults: [
    'Welcome to Pune Majha News — 24x7 Breaking News & Ground Reports',
    'पुणे व महाराष्ट्रातील ताज्या घडामोडींसाठी पुणे माझा न्यूजसोबत रहा',
    'पुणे और महाराष्ट्र की ताज़ा ख़बरें, स्थानीय अपडेट्स और लाइव कवरेज',
  ],
};

export function getAdminEmailAllowlist() {
  return siteConfig.auth.adminEmails;
}

export function isAllowlistedAdminEmail(email) {
  const normalized = String(email || '').toLowerCase().trim();
  return Boolean(normalized && siteConfig.auth.adminEmails.includes(normalized));
}

export function getReporterWhatsAppVerificationUrl() {
  const msg = encodeURIComponent(
    `Hi ${siteConfig.brand.shortName} Team, I just submitted my Reporter Application and want to complete verification.`
  );
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${msg}`;
}

export default siteConfig;
