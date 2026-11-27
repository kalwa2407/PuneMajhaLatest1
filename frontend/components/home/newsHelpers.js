import { getLocalizedText } from '@/lib/newsData'
import { siteConfig } from '@/lib/siteConfig'

// Comprehensive mapping of all category variants (English, Marathi, Hindi)
export const CATEGORY_TRANSLATION_MAP = {
  business: 'business',
  national: 'nation',
  nation: 'nation',
  politics: 'politics',
  entertainment: 'entertainment',
  sports: 'sports',
  technology: 'technology',
  tech: 'technology',
  health: 'health',
  education: 'education',
  crime: 'crime',
  'city news': 'cityNews',
  citynews: 'cityNews',
  city: 'cityNews',
  jobs: 'jobs',
  trending: 'trending',
  murder: 'crime',
  general: 'general',
  // Marathi & Hindi variants
  'व्यापार': 'business',
  'व्यवसाय': 'business',
  'उद्योग': 'business',
  'गुन्हा': 'crime',
  'अपराध': 'crime',
  'क्राईम': 'crime',
  'खून': 'crime',
  'हत्या': 'crime',
  'राजकारण': 'politics',
  'राजनीति': 'politics',
  'खेळ': 'sports',
  'खेल': 'sports',
  'क्रीडा': 'sports',
  'मनोरंजन': 'entertainment',
  'सिनेमा': 'entertainment',
  'बॉलीवूड': 'entertainment',
  'शिक्षण': 'education',
  'शिक्षा': 'education',
  'आरोग्य': 'health',
  'स्वास्थ्य': 'health',
  'तंत्रज्ञान': 'technology',
  'टेक्नॉलॉजी': 'technology',
  'देश': 'nation',
  'राष्ट्रीय': 'nation',
  'राष्ट्र': 'nation',
  'शहर': 'cityNews',
  'शहर वार्ता': 'cityNews',
  'स्थानिक': 'cityNews',
  'पुणे': 'cityNews',
  'पुणे शहर': 'cityNews',
  'महाराष्ट्र': 'nation',
  'सामान्य': 'general',
  'रोजगार': 'jobs',
  'नोकरी': 'jobs',
}

export const normalizeCategory = (cat) => {
  if (!cat) return ''
  const catStr = typeof cat === 'string' ? cat : (cat.en || cat.name || '')
  const trimmed = catStr.toLowerCase().trim()
  return CATEGORY_TRANSLATION_MAP[trimmed] || CATEGORY_TRANSLATION_MAP[catStr.trim()] || trimmed
}

export const getTranslatedCategory = (cat, t, language) => {
  if (!cat) return ''
  if (typeof cat === 'object') return getLocalizedText(cat, language)

  const catStr = String(cat).trim()
  const key = CATEGORY_TRANSLATION_MAP[catStr.toLowerCase()] || CATEGORY_TRANSLATION_MAP[catStr]
  if (key) {
    const translated = t(key)
    if (translated && translated !== key) return translated
    if (language === 'en') {
      const enLabels = {
        business: 'Business', crime: 'Crime', politics: 'Politics',
        entertainment: 'Entertainment', sports: 'Sports', technology: 'Technology',
        health: 'Health', education: 'Education', nation: 'Nation',
        cityNews: 'City News', jobs: 'Jobs', trending: 'Trending', general: 'General',
      }
      if (enLabels[key]) return enLabels[key]
    }
  }

  const fallbackKey = catStr.toLowerCase()
  const translated = t(fallbackKey)
  return translated !== fallbackKey ? translated : catStr
}

export const resolveNewsImage = (item) =>
  item?.mainImage ||
  item?.thumbnailUrl ||
  item?.thumbnails?.[0] ||
  item?.images?.find((u) => u && !u.includes('transparent.gif')) ||
  siteConfig.assets.placeholderNews

export const fallbackNewsImage = (e) => {
  if (!e.currentTarget.src.endsWith(siteConfig.assets.placeholderNews)) {
    e.currentTarget.src = siteConfig.assets.placeholderNews
    e.currentTarget.srcset = ''
  }
}
