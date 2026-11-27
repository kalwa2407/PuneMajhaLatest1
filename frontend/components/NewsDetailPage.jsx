'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Clock, ArrowLeft, ArrowRight, Bookmark, Check, Facebook, MessageCircle, Copy, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { getLocalizedText, getTranslatedCategory } from '@/lib/newsData'
import { useLanguage } from '@/contexts/LanguageContext'
import { news } from '@/lib/api'
import DOMPurify from 'dompurify'
import { formatArticleHtml, stripMarkdown } from '@/lib/articleFormat'
import { proxyImageUrl } from '@/lib/imageProxy'
import { extractYouTubeId } from '@/lib/youtube'
import { translateToTarget } from '@/lib/translation'
import ReadingProgress from './ReadingProgress'
import { siteConfig } from '@/lib/siteConfig'

const resolveArticleImage = (item) =>
  item?.mainImage ||
  item?.thumbnailUrl ||
  item?.thumbnails?.[0] ||
  item?.images?.find((u) => u && !u.includes('transparent.gif')) ||
  siteConfig.assets.placeholderNews

const fallbackToPlaceholder = (e) => {
  if (!e.currentTarget.src.endsWith('/placeholder-news.svg')) {
    e.currentTarget.src = '/placeholder-news.svg'
    e.currentTarget.srcset = ''
  }
}

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code',
    'span', 'div', 'sub', 'sup', 'hr', 'table', 'thead',
    'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
    'class', 'style', 'title', 'colspan', 'rowspan',
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
}

function normalizeBrandText(text) {
  return String(text || '')
    .replace(/\bPune\s+my\s+news\.?/gi, `${siteConfig.brand.name}.`)
    .replace(/पुणे मेरी खबर\.?/g, 'पुणे माझा न्यूज़.')
    .replace(/\.{2,}/g, '.')
}

/**
 * Clean machine-translated or Blogger-split paragraph breaks, fix trailing period
 * fragments (e.g. "<p>...terror</p><p>. Anmol...</p>"), and remove a duplicate
 * opening deck paragraph when identical to the article summary.
 */
function cleanEditorialHtml(rawHtml, cleanSummary) {
  let html = formatArticleHtml(normalizeBrandText(rawHtml || ''))
  if (typeof window === 'undefined' || !html) return html

  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
    const root = doc.body.firstElementChild
    if (!root) return html

    // Merge consecutive plain <p> blocks that were split mid-sentence in Blogger/translations
    const children = Array.from(root.children)
    const merged = []
    for (const node of children) {
      const prev = merged[merged.length - 1]
      const isPlainP = (el) => el?.tagName === 'P' && !el.querySelector('img, h1, h2, h3, table, ul, ol')
      if (prev && isPlainP(prev) && isPlainP(node)) {
        const prevText = prev.textContent.trim()
        const nextText = node.textContent.trim()
        const prevIncomplete = prevText.length > 0 && !/[.!?।॥…:)"”'’]$/.test(prevText)
        const nextContinues = /^[.,;:!?)|a-z]/.test(nextText)
        if (prevIncomplete && nextContinues) {
          const glue = /^[.,;:!?)]/.test(nextText) ? '' : ' '
          prev.innerHTML = prev.innerHTML.trimEnd() + glue + node.innerHTML.trimStart()
          node.remove()
          continue
        }
      }
      merged.push(node)
    }

    // Drop duplicate opening lead paragraph when it already appears in the article summary deck
    const firstP = root.querySelector('p')
    if (firstP && cleanSummary) {
      const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
      const pNorm = norm(firstP.textContent)
      const sNorm = norm(cleanSummary)
      if (pNorm && sNorm && (pNorm === sNorm || (pNorm.length > 30 && sNorm.startsWith(pNorm.slice(0, 40))) || (sNorm.length > 30 && pNorm.startsWith(sNorm.slice(0, 40))))) {
        if (root.children.length > 1) firstP.remove()
      }
    }

    // Capitalize clean opening character if lowercase ASCII leaked after summary strip
    const leadP = root.querySelector('p')
    if (leadP && !leadP.firstElementChild && leadP.firstChild?.nodeType === 3) {
      leadP.firstChild.nodeValue = leadP.firstChild.nodeValue
        .replace(/^\s*[.,|]+\s*/, '')
        .replace(/^([a-z])/, (_, c) => c.toUpperCase())
    }

    return root.innerHTML
  } catch {
    return html
  }
}

function sanitizeHtml(html, cleanSummary = '') {
  if (!html) return ''
  if (typeof window === 'undefined') return html
  return DOMPurify.sanitize(cleanEditorialHtml(html, cleanSummary), SANITIZE_CONFIG)
}

function cleanDeckSummary(rawSummary) {
  if (!rawSummary) return ''
  let s = stripMarkdown(normalizeBrandText(rawSummary))
    // Strip half-cut trailing brand prefixes left from fixed-length RSS excerpts (e.g. "...! Pune Majha News. Satar")
    .replace(/\s*(Pune\s+(?:my|Majha)\s+News\.?\s*[^.!?]{0,20}|पुणे\s+(?:मेरी\s+खबर|माझा\s+न्युज|माझा\s+न्यूज़)[^.!।?]{0,30})$/i, '')
    .trim()
  return s.replace(/^[a-z]/, (c) => c.toUpperCase())
}

const shareArticle = async (article, target) => {
  if (typeof window === 'undefined' || !article?.id) return
  const url = `${window.location.origin}/news/${encodeURIComponent(article.id)}`
  const t = article.title
  const title = typeof t === 'string' ? t : (t?.en || t?.mr || t?.hi || siteConfig.brand.name)
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  }
  if (target === 'native') {
    if (navigator.share) { try { await navigator.share({ title, url }) } catch {} return }
    try { await navigator.clipboard.writeText(url) } catch {}
    return
  }
  window.open(links[target], '_blank', 'noopener,noreferrer')
}

const authorDisplayName = (a) => {
  const n = a?.authorName || a?.author?.name
  return !n ? siteConfig.brand.adminAuthorLabel : n
}

const NewsDetailPage = ({ article, setCurrentView, setSelectedArticle }) => {
  const { language, t } = useLanguage()
  const [fontSizeLevel, setFontSizeLevel] = useState('base')
  const [copiedLink, setCopiedLink] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const [latestNews, setLatestNews] = useState([])
  const [relatedNewsFromApi, setRelatedNewsFromApi] = useState([])

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await news.getAll({ limit: 20 })
        const articles = response?.articles || response || []
        if (!Array.isArray(articles)) throw new Error('Invalid response format')

        const sorted = articles
          .filter((a) => a && a.id !== article?.id)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

        setLatestNews(sorted.slice(0, 5))

        const currentCategory = getLocalizedText(article?.category, 'en')?.toLowerCase() || ''
        if (currentCategory) {
          const related = sorted.filter((a) => (getLocalizedText(a?.category, 'en')?.toLowerCase() || '') === currentCategory).slice(0, 4)
          setRelatedNewsFromApi(related.length > 0 ? related : sorted.slice(0, 4))
        } else {
          setRelatedNewsFromApi(sorted.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch latest news:', error)
        setLatestNews([])
        setRelatedNewsFromApi([])
      }
    }
    if (article?.id) fetchLatestNews()
  }, [article?.id, article?.category])

  const isSnippetOnly = (art) => {
    if (!art?.id) return false
    if (art.contentPartial || !art.content) return true
    if (typeof art.content === 'string') return art.content.trim().length <= 320
    if (typeof art.content === 'object') {
      const maxLen = Math.max(
        ...Object.values(art.content).map((v) => (typeof v === 'string' ? v.trim().length : 0)),
        0
      )
      return maxLen <= 320
    }
    return true
  }

  const [fullArticle, setFullArticle] = useState(article)
  const [loadingFullArticle, setLoadingFullArticle] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFullArticle(article)
    setCopiedLink(false)
    if (isSnippetOnly(article)) {
      setLoadingFullArticle(true)
      news.getOne(article.id)
        .then((res) => {
          if (cancelled) return
          const data = res?.article || res
          if (data && data.id) setFullArticle({ ...data, contentPartial: false })
        })
        .catch((err) => console.warn('Failed to load full article content:', err))
        .finally(() => { if (!cancelled) setLoadingFullArticle(false) })
    } else {
      setLoadingFullArticle(false)
    }
    return () => { cancelled = true }
  }, [article?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeArticle = fullArticle || article

  const [dynamicTitle, setDynamicTitle] = useState('')
  const [dynamicSummary, setDynamicSummary] = useState('')
  const [dynamicContent, setDynamicContent] = useState('')

  useEffect(() => {
    let isCancelled = false
    setDynamicTitle('')
    setDynamicSummary('')
    setDynamicContent('')

    if (!activeArticle?.id || activeArticle.contentPartial) return

    const cacheKey = `tr_v3_${activeArticle.id}_${language}`
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.title) setDynamicTitle(parsed.title)
        if (parsed.summary) setDynamicSummary(parsed.summary)
        if (parsed.content) setDynamicContent(parsed.content)
        if (parsed.done) return
      }
    } catch {}

    const extractSource = (raw) =>
      typeof raw === 'string'
        ? raw.trim()
        : (raw && typeof raw === 'object' ? (raw.hi || raw.mr || raw.en || '').trim() : '')

    const needsTranslation = (rawField, targetLang) => {
      if (!rawField) return false
      if (typeof rawField === 'string') {
        const hasDevanagari = /[\u0900-\u097F]/.test(rawField)
        if (targetLang === 'en') return hasDevanagari
        return (!hasDevanagari && /[a-zA-Z]{4,}/.test(rawField)) || (targetLang === 'mr' && hasDevanagari)
      }
      const val = (rawField[targetLang] || '').trim()
      if (!val) return true
      const others = ['en', 'hi', 'mr']
        .filter((k) => k !== targetLang)
        .map((k) => (rawField[k] || '').trim())
        .filter(Boolean)
      if (val.length > 8 && others.some((o) => o === val)) return true
      const hasDevanagari = /[\u0900-\u097F]/.test(val)
      if (targetLang === 'en' && hasDevanagari) return true
      if (targetLang !== 'en' && !hasDevanagari && /[a-zA-Z]{4,}/.test(val)) return true
      return false
    }

    const rawTitle = activeArticle.title || ''
    const rawSummary = activeArticle.metaDescription || activeArticle.shortDescription || activeArticle.summary || ''
    const rawContent = activeArticle.content || ''

    const runDynamicTranslations = async () => {
      const out = { title: '', summary: '', content: '', done: false }

      if (needsTranslation(rawTitle, language)) {
        const src = extractSource(rawTitle)
        if (src) {
          const r = await translateToTarget(src, language, 'auto')
          if (!isCancelled && r.ok && r.translated && r.translated !== src) {
            out.title = r.translated
            setDynamicTitle(r.translated)
          }
        }
      }

      if (needsTranslation(rawSummary, language)) {
        const src = extractSource(rawSummary)
        if (src) {
          const r = await translateToTarget(src, language, 'auto')
          if (!isCancelled && r.ok && r.translated && r.translated !== src) {
            out.summary = r.translated
            setDynamicSummary(r.translated)
          }
        }
      }

      if (needsTranslation(rawContent, language)) {
        const src = extractSource(rawContent)
        if (src) {
          const r = await translateToTarget(src, language, 'auto')
          if (!isCancelled && r.ok && r.translated && r.translated !== src) {
            out.content = r.translated
            setDynamicContent(r.translated)
          }
        }
      }

      if (!isCancelled) {
        out.done = true
        try { sessionStorage.setItem(cacheKey, JSON.stringify(out)) } catch {}
      }
    }

    runDynamicTranslations().catch(() => {})
    return () => { isCancelled = true }
  }, [activeArticle?.id, language, activeArticle?.title, activeArticle?.metaDescription, activeArticle?.content, activeArticle?.contentPartial])

  const relatedNews = relatedNewsFromApi
  const sidebarLatest = latestNews.slice(0, 5)

  const title = dynamicTitle || getLocalizedText(activeArticle?.title, language)
  const category = getTranslatedCategory(activeArticle?.category, language)
  const content = dynamicContent || getLocalizedText(activeArticle?.content, language)
  const rawSummary = dynamicSummary || getLocalizedText(activeArticle?.metaDescription || activeArticle?.shortDescription || activeArticle?.summary, language)
  const cleanSummary = useMemo(() => cleanDeckSummary(rawSummary), [rawSummary])

  const readMinutes = useMemo(() => {
    const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 180))
  }, [content])

  if (!activeArticle) return null

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    const locale = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleRelatedClick = (item) => {
    if (typeof window !== 'undefined' && item?.id) {
      window.history.pushState({ view: 'news-detail', article: item }, '', `/news/${item.id}`)
    }
    if (setSelectedArticle) {
      setSelectedArticle(item)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToHome = () => {
    if (typeof window !== 'undefined') window.history.pushState({ view: 'home' }, '', '/')
    if (setCurrentView) setCurrentView('home')
  }

  const handleCopyUrl = async () => {
    if (typeof window === 'undefined' || !activeArticle?.id) return
    const url = `${window.location.origin}/news/${encodeURIComponent(activeArticle.id)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    } catch {}
  }

  const heroYoutubeId = extractYouTubeId(activeArticle.youtubeUrl || activeArticle.videoUrl)
  const heroImage =
    activeArticle.mainImage ||
    activeArticle.thumbnailUrl ||
    activeArticle.thumbnails?.[0] ||
    activeArticle.images?.find((u) => u && !u.includes('transparent.gif'))

  const labels = {
    home: t('home') || (language === 'mr' ? 'मुख्यपृष्ठ' : language === 'hi' ? 'होम' : 'Home'),
    news: t('news') || (language === 'mr' ? 'बातम्या' : language === 'hi' ? 'समाचार' : 'News'),
    save: t('save') || (language === 'mr' ? 'जतन करा' : language === 'hi' ? 'सेव' : 'Save'),
    saved: language === 'mr' ? 'जतन केले' : language === 'hi' ? 'सेव किया' : 'Saved',
    minRead: language === 'mr' ? `${readMinutes} मिनिटे वाचन` : language === 'hi' ? `${readMinutes} मिनट पढ़ें` : `${readMinutes} min read`,
    share: language === 'mr' ? 'शेअर' : language === 'hi' ? 'शेयर' : 'Share',
    copied: language === 'mr' ? 'कॉपी' : language === 'hi' ? 'कॉपी' : 'Copied',
    deskRole: language === 'mr' ? 'पुणे माझा वृत्त कक्ष' : language === 'hi' ? 'पुणे माझा समाचार डेस्क' : 'Editorial Broadcast Desk',
    deskTagline: language === 'mr' ? 'निःपक्ष, सत्यापित आणि वेगवान पत्रकारिता' : language === 'hi' ? 'निष्पक्ष, सत्यापित और तेज़ पत्रकारिता' : 'Verified. Independent. Ground-First Reporting.',
    prev: language === 'mr' ? 'मागील बातमी' : language === 'hi' ? 'पिछला समाचार' : 'Previous Story',
    next: language === 'mr' ? 'पुढील बातमी' : language === 'hi' ? 'अगला समाचार' : 'Next Story',
    filePhoto: language === 'mr' ? 'प्रतिनिधी छायाचित्र' : language === 'hi' ? 'फाइल फोटो' : 'Archive Desk Frame',
  }

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 lg:px-6 py-5 md:py-8 min-w-0 overflow-x-hidden supports-[overflow:clip]:overflow-x-clip" key={language}>
      <ReadingProgress />

      {/* Editorial Breadcrumb & Controls Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 min-w-0">
          <button type="button" onClick={handleBackToHome} className="hover:text-brand-red transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 text-brand-navy">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{labels.home}</span>
          </button>
          <span className="text-slate-300">/</span>
          <button type="button" onClick={() => setCurrentView && setCurrentView('news')} className="hover:text-brand-red transition-colors cursor-pointer shrink-0">
            {labels.news}
          </button>
          {category && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-brand-red font-extrabold uppercase tracking-wide truncate">{category}</span>
            </>
          )}
        </div>

        {/* Reading Font Size + Bookmark + Copy */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-300">
            {['sm', 'base', 'lg'].map((lvl, idx) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFontSizeLevel(lvl)}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  fontSizeLevel === lvl ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-600 hover:text-brand-navy'
                }`}
              >
                {idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition-colors cursor-pointer ${
              saved ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-slate-700 border-slate-300 hover:border-brand-navy'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
            <span>{saved ? labels.saved : labels.save}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-7 lg:gap-10 w-full min-w-0 items-start">
        {/* MAIN ARTICLE COLUMN */}
        <article className="lg:col-span-8 min-w-0 w-full bg-white lg:rounded-2xl lg:border lg:border-slate-300 lg:shadow-xs overflow-hidden">
          <div className="px-0 py-2 sm:py-3 lg:p-8 space-y-5">
            {/* Eyebrow Badge + Location */}
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span className="inline-flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {category}
                </span>
              )}
              {activeArticle.city && (
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-navy bg-blue-50 border border-slate-200 px-3 py-1 rounded-full">
                  {activeArticle.city}
                </span>
              )}
            </div>

            {/* Broadsheet Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-heading font-black text-slate-900 leading-[1.2] tracking-tight break-words [overflow-wrap:anywhere]">
              {title}
            </h1>

            {/* Crisp Highlight Deck (Zero awkward dropcap) */}
            {cleanSummary && (
              <p className="border-l-4 border-brand-red pl-4 py-0.5 text-sm sm:text-base md:text-[17px] font-medium text-slate-600 leading-relaxed break-words">
                {cleanSummary}
              </p>
            )}

            {/* Minimal Byline & Share Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 border-y border-slate-200">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-black text-xs shrink-0">
                    {(authorDisplayName(activeArticle) || 'P').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-900 font-bold">{authorDisplayName(activeArticle)}</span>
                </div>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  {formatDate(activeArticle.publishedAt || activeArticle.createdAt)}
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-brand-navy font-bold">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {labels.minRead}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button type="button" aria-label="Share on WhatsApp" onClick={() => shareArticle(activeArticle, 'whatsapp')} className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 cursor-pointer"><MessageCircle className="w-4 h-4" /></button>
                <button type="button" aria-label="Share on Facebook" onClick={() => shareArticle(activeArticle, 'facebook')} className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 cursor-pointer"><Facebook className="w-4 h-4" /></button>
                <button type="button" aria-label="Share on X" onClick={() => shareArticle(activeArticle, 'x')} className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:opacity-90 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  aria-label="Copy article link"
                  className="inline-flex items-center gap-1 px-2.5 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? labels.copied : labels.share}</span>
                </button>
              </div>
            </div>

            {/* Hero Media Frame */}
            {heroYoutubeId ? (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xs border border-slate-300 bg-slate-950">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${heroYoutubeId}?rel=0&modestbranding=1`}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : heroImage ? (
              <figure className="space-y-1.5">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-100 w-full">
                  <Image
                    src={proxyImageUrl(heroImage)}
                    alt={title}
                    fill
                    className="object-fill w-full h-full"
                    priority
                    onError={fallbackToPlaceholder}
                  />
                </div>
                <figcaption className="text-[11px] text-slate-400 font-medium flex items-center justify-between px-1">
                  <span>{labels.filePhoto}</span>
                  <span>{siteConfig.brand.name}</span>
                </figcaption>
              </figure>
            ) : null}

            {/* Clean Article Reading Body (Zero broken dropcap, auto-merged broken lines) */}
            <div className={`text-slate-800 leading-relaxed space-y-5 pt-1 pb-4 break-words [overflow-wrap:anywhere] article-prose-content max-w-[74ch] w-full min-w-0 ${
              fontSizeLevel === 'sm' ? 'text-[15px] sm:text-base' : fontSizeLevel === 'lg' ? 'text-lg sm:text-[20px]' : 'text-base sm:text-[17.5px]'
            }`}>
              {loadingFullArticle ? (
                <div className="space-y-4 animate-pulse py-2">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-11/12" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 rounded w-full mt-4" />
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                </div>
              ) : (() => {
                const hasTopVideo = Boolean(heroYoutubeId)
                const rawGallery = Array.isArray(activeArticle.galleryImages) ? activeArticle.galleryImages : []
                const rawThumbs = Array.isArray(activeArticle.thumbnails) ? activeArticle.thumbnails : []
                const rawImages = Array.isArray(activeArticle.images) ? activeArticle.images : []
                const extraThumbs = (hasTopVideo || rawThumbs.length > 1 || (rawThumbs.length === 1 && rawThumbs[0] !== activeArticle.thumbnailUrl))
                  ? rawThumbs
                  : []
                const candidateImgs = [
                  ...(hasTopVideo && activeArticle.mainImage ? [activeArticle.mainImage] : []),
                  ...rawGallery,
                  ...extraThumbs,
                  ...rawImages,
                ]
                const galleryImgs = candidateImgs.filter(
                  (img, i, arr) =>
                    img &&
                    typeof img === 'string' &&
                    !img.includes('transparent.gif') &&
                    (hasTopVideo || img !== activeArticle.mainImage) &&
                    arr.indexOf(img) === i
                )

                const cleanedHtml = sanitizeHtml(content, cleanSummary)
                if (galleryImgs.length === 0) {
                  return (
                    <div
                      className="space-y-4 article-prose-content break-words [overflow-wrap:anywhere] w-full min-w-0"
                      dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                    />
                  )
                }

                const parts = cleanedHtml ? cleanedHtml.split(/(<\/p>)/i) : ['']
                const paragraphs = []
                for (let i = 0; i < parts.length; i += 2) {
                  const chunk = parts[i] + (parts[i + 1] || '')
                  if (chunk.trim()) paragraphs.push(chunk)
                }

                if (paragraphs.length <= 1) {
                  return (
                    <>
                      <div
                        className="space-y-4 article-prose-content break-words [overflow-wrap:anywhere] w-full min-w-0"
                        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                      />
                      <div className="my-6 space-y-5 w-full min-w-0">
                        {galleryImgs.map((img, idx) => (
                          <div key={idx} className="relative w-full max-w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <Image src={proxyImageUrl(img)} alt={`${title} - Image ${idx + 2}`} fill className="object-fill w-full h-full" onError={fallbackToPlaceholder} />
                          </div>
                        ))}
                      </div>
                    </>
                  )
                }

                const insertAfterIdx = Math.min(1, paragraphs.length - 1)
                const firstPart = paragraphs.slice(0, insertAfterIdx + 1).join('')
                const secondPart = paragraphs.slice(insertAfterIdx + 1).join('')

                return (
                  <>
                    <div
                      className="space-y-4 article-prose-content break-words [overflow-wrap:anywhere] w-full min-w-0"
                      dangerouslySetInnerHTML={{ __html: firstPart }}
                    />
                    <div className="my-6 space-y-5 w-full min-w-0">
                      {galleryImgs.map((img, idx) => (
                        <div key={idx} className="relative w-full max-w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <Image src={proxyImageUrl(img)} alt={`${title} - Image ${idx + 2}`} fill className="object-fill w-full h-full" onError={fallbackToPlaceholder} />
                        </div>
                      ))}
                    </div>
                    {secondPart && (
                      <div
                        className="space-y-4 article-prose-content break-words [overflow-wrap:anywhere] w-full min-w-0"
                        dangerouslySetInnerHTML={{ __html: secondPart }}
                      />
                    )}
                  </>
                )
              })()}
            </div>

            {/* Tags */}
            {Array.isArray(activeArticle.tags) && activeArticle.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-200">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mr-1">
                  {language === 'mr' ? 'विषय:' : language === 'hi' ? 'टैग:' : 'Topics:'}
                </span>
                {activeArticle.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-brand-navy border-slate-300 bg-slate-50 font-semibold px-3 py-1 text-xs rounded-full">
                    #{String(tag).trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* Editorial Author Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-black text-lg shrink-0">
                  {(authorDisplayName(activeArticle) || 'P').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">{authorDisplayName(activeArticle)}</h4>
                    <svg className="w-4 h-4 text-brand-navy shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{labels.deskRole}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-bold tracking-wide">{labels.deskTagline}</p>
            </div>

            {/* Functional Prev / Next Story Cards */}
            {(relatedNews[0] || relatedNews[1]) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {relatedNews[0] && (
                  <button
                    type="button"
                    onClick={() => handleRelatedClick(relatedNews[0])}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-300 hover:border-brand-navy hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-brand-red group-hover:-translate-x-0.5 transition-transform shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-red mb-0.5">{labels.prev}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-brand-navy">
                        {getLocalizedText(relatedNews[0].title, language)}
                      </p>
                    </div>
                  </button>
                )}
                {relatedNews[1] && (
                  <button
                    type="button"
                    onClick={() => handleRelatedClick(relatedNews[1])}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-300 hover:border-brand-navy hover:bg-slate-50 transition-colors text-right group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 text-left sm:text-right">
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-navy mb-0.5">{labels.next}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-brand-navy">
                        {getLocalizedText(relatedNews[1].title, language)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-red group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        {/* RIGHT EDITORIAL SIDEBAR */}
        <aside className="lg:col-span-4 space-y-5 w-full min-w-0 lg:sticky lg:top-[68px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto scrollbar-hide">
          {/* Related Stories */}
          {relatedNews.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-navy">
                <h3 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-red" />
                  {t('relatedStories') || 'Related Stories'}
                </h3>
                <button type="button" onClick={() => setCurrentView && setCurrentView('news')} className="text-[11px] font-bold text-brand-red hover:underline cursor-pointer">
                  {t('viewAll') || 'View All'}
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {relatedNews.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRelatedClick(item)}
                    className="py-3 first:pt-0 last:pb-0 flex gap-3 items-start cursor-pointer group"
                  >
                    <div className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={proxyImageUrl(resolveArticleImage(item))}
                        alt={getLocalizedText(item.title, language)}
                        fill
                        className="object-fill w-full h-full"
                        onError={fallbackToPlaceholder}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-red block mb-0.5 truncate">
                        {getTranslatedCategory(item.category, language)}
                      </span>
                      <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-brand-navy line-clamp-2 leading-snug">
                        {getLocalizedText(item.title, language)}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Ranked List */}
          {sidebarLatest.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-red">
                <h3 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-red" />
                  {t('trending') || (language === 'mr' ? 'सध्या ट्रेंडिंग' : language === 'hi' ? 'ट्रेंडिंग समाचार' : 'Trending Now')}
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {sidebarLatest.slice(0, 5).map((newsItem, idx) => (
                  <div
                    key={newsItem.id}
                    onClick={() => handleRelatedClick(newsItem)}
                    className="py-2.5 first:pt-0 last:pb-0 flex gap-2.5 items-center cursor-pointer group"
                  >
                    <span className="text-xs font-black text-brand-red/80 tabular-nums shrink-0">0{idx + 1}</span>
                    <div className="relative w-20 aspect-video shrink-0 rounded-md overflow-hidden bg-slate-100">
                      <Image
                        src={proxyImageUrl(resolveArticleImage(newsItem))}
                        alt=""
                        fill
                        className="object-fill w-full h-full"
                        onError={fallbackToPlaceholder}
                      />
                    </div>
                    <p className="font-bold text-xs text-slate-900 group-hover:text-brand-navy line-clamp-2 leading-snug flex-1 min-w-0">
                      {getLocalizedText(newsItem.title, language)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stay Informed Card */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark rounded-2xl p-5 border border-slate-300 text-white shadow-sm">
            <h3 className="text-lg font-heading font-black leading-tight mb-1.5">
              {language === 'mr' ? 'पुणे माझा न्यूज अपडेट्स' : language === 'hi' ? 'पुणे माझा न्यूज़ अपडेट्स' : `Stay Informed with ${siteConfig.brand.shortName}`}
            </h3>
            <p className="text-blue-100 text-xs mb-4 leading-relaxed">
              {language === 'mr' ? 'ताज्या बातम्या आणि ग्राउंड रिपोर्ट्स थेट मिळवा.' : language === 'hi' ? 'ताज़ा ख़बरें और ब्रेकिंग अपडेट्स सीधे प्राप्त करें।' : 'Get verified local bulletins and breaking alerts.'}
            </p>
            <form
              className="flex flex-col gap-2.5"
              onSubmit={(e) => {
                e.preventDefault()
                if (newsletterEmail.trim()) {
                  setSubscribed(true)
                  setNewsletterEmail('')
                }
              }}
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={language === 'mr' ? 'तुमचा ईमेल प्रविष्ट करा' : language === 'hi' ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
              <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs py-2.5 rounded-xl">
                {subscribed
                  ? (language === 'mr' ? 'नोंदणी पूर्ण!' : language === 'hi' ? 'सदस्यता सक्रिय!' : 'Subscribed!')
                  : (language === 'mr' ? 'सदस्यता घ्या' : language === 'hi' ? 'सब्सक्राइब करें' : 'Subscribe')}
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default NewsDetailPage
