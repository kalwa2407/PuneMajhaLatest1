'use client'

import { useState, useEffect, useCallback } from 'react'
import { news } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import {
  getPremiumAdSettings,
  getSidebarAdSettings,
  getArticleAdSettings,
  getBusinessAdSettings,
} from '@/lib/contentStore'
import ReporterApplicationModal from './ReporterApplicationModal'
import { NewsBox } from './home/NewsCards'
import { PremiumAdBanner } from './home/AdWidgets'
import HeroSection from './home/HeroSection'
import BusinessEconomySection from './home/BusinessEconomySection'
import { PoliticsCrimeLiveSection, CategoryGridSection, MoreStoriesSection } from './home/CategorySections'
import { JoinNetworkBanner, FloatingWhatsAppButton } from './home/JoinNetworkBanner'
import { normalizeCategory } from './home/newsHelpers'

const HomePage = ({ setCurrentView, setSelectedArticle, newsData, setNewsData }) => {
  const { t, language } = useLanguage()
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [newsKey, setNewsKey] = useState(0)
  const [visibleMoreStories, setVisibleMoreStories] = useState(18)
  const [isReporterModalOpen, setIsReporterModalOpen] = useState(false)

  const [stockData, setStockData] = useState({
    sensex: { value: '81,523.12', change: '+620.18', pct: '+0.77%', up: true },
    nifty: { value: '24,972.40', change: '+182.35', pct: '+0.74%', up: true },
  })

  const [premiumAdSettings, setPremiumAdSettings] = useState({ enabled: true, imageUrl: '', linkUrl: '', title: '' })
  const [sidebarAdSettings, setSidebarAdSettings] = useState({ enabled: true, items: [] })
  const [articleAdSettings, setArticleAdSettings] = useState({
    banner: { enabled: true, imageUrl: '', linkUrl: '', title: 'Advertise Your Business' },
    sticky: { enabled: true, imageUrl: '', linkUrl: '', title: 'Premium Ad Space' },
  })
  const [businessAdSettings, setBusinessAdSettings] = useState({
    enabled: true, imageUrl: '', linkUrl: '', title: 'BUSINESS', subtitle: 'Advertisement', buttonText: 'POST YOUR AD',
  })

  const mainNewsBoxes = newsData?.mainNewsBoxes || []
  const politicsNews = newsData?.trendingNews || []
  const businessNews = newsData?.businessNews || []
  const crimeNews = newsData?.crimeNews || []
  const sportsNews = newsData?.sportsNews || []
  const educationNews = newsData?.educationNews || []
  const healthNews = newsData?.healthNews || []
  const technologyNews = newsData?.technologyNews || []
  const oldNews = newsData?.oldNews || []
  const latestNews = newsData?.latestNews || newsData?.mainNewsBoxes?.slice(0, 8) || oldNews.slice(0, 8)

  const fetchNews = useCallback(async () => {
    if (newsData?.loaded) return

    try {
      const response = await news.getAll({ limit: 50 })
      const articles = [...(response.articles || [])].sort(
        (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      )

      const featured = articles.filter((a) => a.featured)
      const nonFeatured = articles.filter((a) => !a.featured)
      const topNews = [...featured, ...nonFeatured].slice(0, 6)
      const topNewsIds = new Set(topNews.map((a) => a.id))
      const remaining = articles.filter((a) => !topNewsIds.has(a.id))

      const byCat = (list) =>
        remaining.filter((a) => list.includes(normalizeCategory(a.category || a.categoryId))).slice(0, 5)

      const pNews = byCat(['politics', 'citynews', 'city news', 'city', 'civic'])
      const bNews = byCat(['business', 'economy', 'finance'])
      const nNews = byCat(['national', 'nation', 'india'])
      const eNews = byCat(['entertainment', 'bollywood', 'movies', 'music'])
      const cNews = byCat(['crime', 'murder'])
      const sNews = byCat(['sports'])
      const edNews = byCat(['education'])
      const hNews = byCat(['health'])
      const tNews = byCat(['technology', 'tech'])

      const usedIds = new Set(
        [...pNews, ...bNews, ...nNews, ...eNews, ...cNews, ...sNews, ...edNews, ...hNews, ...tNews].map((a) => a.id)
      )
      const oldNewsFiltered = remaining.filter((a) => !usedIds.has(a.id))
      const heroId = topNews[0]?.id
      const latestNewsFiltered = articles.filter((a) => a.id !== heroId).slice(0, 10)

      if (setNewsData) {
        setNewsData((prev) => ({
          ...prev,
          mainNewsBoxes: topNews,
          latestNews: latestNewsFiltered,
          trendingNews: pNews,
          businessNews: bNews,
          nationNews: nNews,
          entertainmentNews: eNews,
          crimeNews: cNews,
          sportsNews: sNews,
          educationNews: edNews,
          healthNews: hNews,
          technologyNews: tNews,
          oldNews: oldNewsFiltered,
          loaded: true,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      try {
        const { newsData: staticArticles } = await import('@/lib/newsData')
        const fallback = staticArticles || []
        if (setNewsData) {
          setNewsData((prev) => ({ ...prev, mainNewsBoxes: fallback.slice(0, 6), oldNews: fallback.slice(6) }))
        }
      } catch (e) {
        console.error('Failed to load static news:', e)
      }
    }
  }, [newsData?.loaded, setNewsData])

  useEffect(() => {
    fetchNews()
    setNewsKey((prev) => prev + 1)
  }, [language, fetchNews])

  useEffect(() => {
    const loadSettings = async () => {
      setPremiumAdSettings(await getPremiumAdSettings())
      setSidebarAdSettings(await getSidebarAdSettings())
      setArticleAdSettings(getArticleAdSettings())
      setBusinessAdSettings(getBusinessAdSettings())
    }
    loadSettings()

    const handleSettingsChange = () => loadSettings()
    if (typeof window !== 'undefined') {
      window.addEventListener('adSettingsChanged', handleSettingsChange)
      window.addEventListener('storage', handleSettingsChange)
    }

    const interval = setInterval(loadSettings, 300000)
    return () => {
      clearInterval(interval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('adSettingsChanged', handleSettingsChange)
        window.removeEventListener('storage', handleSettingsChange)
      }
    }
  }, [])

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const [sensexRes, niftyRes] = await Promise.all([
          fetch('/api/finance?symbol=%5EBSESN'),
          fetch('/api/finance?symbol=%5ENSEI'),
        ])
        const [sensexJson, niftyJson] = await Promise.all([sensexRes.json(), niftyRes.json()])
        const toIndian = (n) => (typeof n === 'number' && !isNaN(n) ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : null)
        const fmt = (n) => (typeof n === 'number' && !isNaN(n) ? (n >= 0 ? '+' : '') + toIndian(n) : null)
        const sensexMeta = sensexJson?.chart?.result?.[0]?.meta
        const niftyMeta = niftyJson?.chart?.result?.[0]?.meta
        if (sensexMeta && niftyMeta) {
          const sPrice = sensexMeta.regularMarketPrice
          const sPrev = sensexMeta.previousClose || sensexMeta.chartPreviousClose
          const nPrice = niftyMeta.regularMarketPrice
          const nPrev = niftyMeta.previousClose || niftyMeta.chartPreviousClose
          if (typeof sPrice === 'number' && sPrev > 0 && typeof nPrice === 'number' && nPrev > 0) {
            const sChange = sPrice - sPrev
            const nChange = nPrice - nPrev
            setStockData({
              sensex: { value: toIndian(sPrice) || '81,523.12', change: fmt(sChange) || '+620.18', pct: (fmt((sChange / sPrev) * 100) || '+0.77') + '%', up: sChange >= 0 },
              nifty: { value: toIndian(nPrice) || '24,972.40', change: fmt(nChange) || '+182.35', pct: (fmt((nChange / nPrev) * 100) || '+0.74') + '%', up: nChange >= 0 },
            })
          }
        }
      } catch {}
    }
    fetchStocks()
    const stockTimer = setInterval(fetchStocks, 60000)
    return () => clearInterval(stockTimer)
  }, [])

  useEffect(() => {
    const items = sidebarAdSettings?.items || []
    if (items.length > 1) {
      const adTimer = setInterval(() => setCurrentAdIndex((prev) => (prev + 1) % items.length), 5000)
      return () => clearInterval(adTimer)
    }
  }, [sidebarAdSettings])

  const handleNewsClick = (article) => {
    window.history.pushState({ view: 'news-detail', article }, '', `/news/${article.id}`)
    setSelectedArticle(article)
    setCurrentView('news-detail')
  }

  const handleCategoryClick = (category) => {
    window.history.pushState({ view: 'news' }, '', `?category=${category}`)
    setCurrentView('news')
  }

  const filterNews = (newsArray) =>
    (newsArray || []).filter((item) => {
      const title = getLocalizedText(item.title, language) || ''
      return !title.toLowerCase().includes('test article') && title.trim() !== ''
    })

  const cleanMainNews = filterNews(mainNewsBoxes)
  const cleanPoliticsNews = filterNews(politicsNews)
  const cleanBusinessNews = filterNews(businessNews)
  const cleanCrimeNews = filterNews(crimeNews)
  const cleanSportsNews = filterNews(sportsNews)
  const cleanEducationNews = filterNews(educationNews)
  const cleanHealthNews = filterNews(healthNews)
  const cleanTechnologyNews = filterNews(technologyNews)
  const cleanLatestNews = filterNews(latestNews)

  return (
    <div className="space-y-0 md:space-y-4" key={newsKey}>
      <PremiumAdBanner settings={premiumAdSettings} t={t} />

      <HeroSection
        cleanMainNews={cleanMainNews}
        cleanLatestNews={cleanLatestNews}
        sidebarAdSettings={sidebarAdSettings}
        currentAdIndex={currentAdIndex}
        setCurrentAdIndex={setCurrentAdIndex}
        onNewsClick={handleNewsClick}
        setCurrentView={setCurrentView}
      />

      <PoliticsCrimeLiveSection
        cleanPoliticsNews={cleanPoliticsNews}
        cleanCrimeNews={cleanCrimeNews}
        onNewsClick={handleNewsClick}
        onCategoryClick={handleCategoryClick}
        setCurrentView={setCurrentView}
      />

      <BusinessEconomySection
        cleanBusinessNews={cleanBusinessNews}
        stockData={stockData}
        businessAdSettings={businessAdSettings}
        articleAdSettings={articleAdSettings}
        onNewsClick={handleNewsClick}
        onCategoryClick={handleCategoryClick}
      />

      <JoinNetworkBanner onOpenModal={() => setIsReporterModalOpen(true)} />

      {/* Mobile-only Politics & Crime */}
      {cleanPoliticsNews.length > 0 && (
        <section className="mb-10 w-full lg:hidden px-4">
          <div className="mag-section-header mb-4">
            <h2 className="text-3xl font-heading font-black tracking-tighter text-brand-navy">{t('nationalPolitics') || 'National Politics'}</h2>
          </div>
          <div className="space-y-0">
            {cleanPoliticsNews.slice(0, 2).map((item) => (
              <NewsBox key={item.id} item={item} onClick={handleNewsClick} language={language} />
            ))}
          </div>
        </section>
      )}

      {cleanCrimeNews.length > 0 && (
        <section className="mb-10 w-full px-4 lg:hidden">
          <div className="mag-section-header mb-4">
            <h2 className="text-3xl font-heading font-black tracking-tighter text-brand-navy">
              <span className="text-brand-red">{t('crime') || 'Crime'}</span> &amp; {t('justice') || 'Justice'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10">
            {cleanCrimeNews.slice(0, 2).map((item) => (
              <NewsBox key={item.id} item={item} onClick={handleNewsClick} language={language} />
            ))}
          </div>
        </section>
      )}

      <CategoryGridSection items={cleanSportsNews} title={t('sportsNews') || 'Sports News'} categoryKey="sports" barColor="bg-green-600" linkColor="text-green-600 hover:text-green-700" variant="spotlight" onNewsClick={handleNewsClick} onCategoryClick={handleCategoryClick} />
      <CategoryGridSection items={cleanEducationNews} title={t('educationAndLearning') || 'Education & Learning'} categoryKey="education" barColor="bg-brand-navy" linkColor="text-brand-navy hover:text-brand-navy-dark" onNewsClick={handleNewsClick} onCategoryClick={handleCategoryClick} />
      <CategoryGridSection items={cleanHealthNews} title={t('healthAndWellness') || 'Health & Wellness'} categoryKey="health" barColor="bg-emerald-600" linkColor="text-emerald-600 hover:text-emerald-700" variant="spotlight" onNewsClick={handleNewsClick} onCategoryClick={handleCategoryClick} />
      <CategoryGridSection items={cleanTechnologyNews} title={t('technologyAndInnovation') || 'Technology & Innovation'} categoryKey="technology" barColor="bg-purple-600" linkColor="text-purple-600 hover:text-purple-700" onNewsClick={handleNewsClick} onCategoryClick={handleCategoryClick} />

      <FloatingWhatsAppButton />

      <MoreStoriesSection
        oldNews={oldNews}
        visibleMoreStories={visibleMoreStories}
        onLoadMore={() => setVisibleMoreStories((prev) => prev + 12)}
        onNewsClick={handleNewsClick}
      />

      <ReporterApplicationModal isOpen={isReporterModalOpen} onClose={() => setIsReporterModalOpen(false)} />
    </div>
  )
}

export default HomePage
