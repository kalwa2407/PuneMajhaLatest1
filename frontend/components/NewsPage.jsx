'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Newspaper, ChevronRight, Loader2, Flame, TrendingUp, Clock, ArrowRight, Search, X } from 'lucide-react'
import Image from 'next/image'
import { news, categories } from '@/lib/api'

import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText, getTranslatedCategory } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'

const ARTICLES_PER_PAGE = 30

const NewsPage = ({ setSelectedArticle, setCurrentView, newsPageState, setNewsPageState }) => {
  const { t, language } = useLanguage()
  const [newsArticles, setLocalNewsArticles] = useState([])
  const [categoryList, setLocalCategoryList] = useState([])
  const [selectedCategory, setLocalSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Track the last fetched category and query to know when to re-fetch
  const lastFetchedCategory = useRef(null)
  const lastFetchedQuery = useRef(null)

  // Derived state
  const articles = newsPageState?.articles?.length > 0 ? newsPageState.articles : newsArticles
  const categoriesData = newsPageState?.categories?.length > 0 ? newsPageState.categories : categoryList
  const currentCategory = newsPageState?.selectedCategory || selectedCategory

  // Setters
  const setArticles = (data) => setNewsPageState ? setNewsPageState(prev => ({ ...prev, articles: data })) : setLocalNewsArticles(data)
  const setCategories = (data) => setNewsPageState ? setNewsPageState(prev => ({ ...prev, categories: data })) : setLocalCategoryList(data)
  const setSelectedCategoryState = (cat) => setNewsPageState ? setNewsPageState(prev => ({ ...prev, selectedCategory: cat })) : setLocalSelectedCategory(cat)
  const setLoaded = (status) => setNewsPageState && setNewsPageState(prev => ({ ...prev, loaded: status }))

  useEffect(() => {
    setMounted(true)
    const storedCategory = localStorage.getItem('selectedCategory')
    if (storedCategory) {
      setSelectedCategoryState(storedCategory)
      localStorage.removeItem('selectedCategory')
    }
    const storedQuery = localStorage.getItem('searchQuery')
    if (storedQuery) {
      setSearchQuery(storedQuery)
      localStorage.removeItem('searchQuery')
    }

    const handleCategoryChange = () => {
      const newCategory = localStorage.getItem('selectedCategory')
      if (newCategory) {
        setSelectedCategoryState(newCategory)
        localStorage.removeItem('selectedCategory')
      }
    }

    const handleSearchChange = (e) => {
      const q = e?.detail || localStorage.getItem('searchQuery') || ''
      setSearchQuery(q)
      if (localStorage.getItem('searchQuery')) localStorage.removeItem('searchQuery')
    }

    window.addEventListener('categoryChange', handleCategoryChange)
    window.addEventListener('searchQueryChange', handleSearchChange)
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange)
      window.removeEventListener('searchQueryChange', handleSearchChange)
    }
  }, [])

  useEffect(() => {
    // Only skip fetch if we already fetched this exact category and search query
    if (newsPageState?.loaded && lastFetchedCategory.current === currentCategory && lastFetchedQuery.current === searchQuery) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setVisibleCount(ARTICLES_PER_PAGE) // Reset pagination on filter change
      await loadCategories()
      await loadNews(searchQuery)
      setLoading(false)
      lastFetchedCategory.current = currentCategory
      lastFetchedQuery.current = searchQuery
      if (setNewsPageState && !searchQuery) setLoaded(true)
    }
    fetchData()
  }, [currentCategory, searchQuery])

  const loadCategories = async () => {
    try {
      if (newsPageState?.categories?.length > 0) return
      const data = await categories.getAll()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadNews = async (query = searchQuery) => {
    try {
      let params = {}
      if (currentCategory !== 'all' && currentCategory !== 'trending' && currentCategory !== 'special') {
        // Send slug directly — the API supports slug-based lookup
        params.category = currentCategory
      } else if (currentCategory === 'trending') {
        params.featured = true
      }
      if (query && query.trim()) {
        params.search = query.trim()
      }
      const data = await news.getAll(params)
      const dbArticles = data.articles || []
      setArticles(dbArticles)
    } catch (error) {
      console.error('Error loading news:', error)
    }
  }

  const handleCategoryChange = (cat) => {
    setSelectedCategoryState(cat)
    setVisibleCount(ARTICLES_PER_PAGE)
  }

  const handleShowMore = () => {
    setLoadingMore(true)
    // Small delay for smooth UX
    setTimeout(() => {
      setVisibleCount(prev => prev + ARTICLES_PER_PAGE)
      setLoadingMore(false)
    }, 300)
  }

  const viewArticle = (article) => {
    window.history.pushState({ view: 'news-detail', article }, '', `/news/${article.id}`)
    setSelectedArticle(article)
    setCurrentView('news-detail')
  }

  if (loading) return (
    <div className="px-4 md:px-8 max-w-[1920px] mx-auto pb-12 pt-8">
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="w-full h-[400px] md:h-[480px] bg-slate-100 rounded-[32px] mb-10" />
        {/* Stats Bar Skeleton */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="w-32 h-4 bg-slate-100 rounded" />
          <div className="h-px flex-1 mx-6 bg-slate-50" />
          <div className="w-24 h-4 bg-slate-100 rounded" />
        </div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className={`flex flex-col h-full border border-slate-100 rounded-[24px] overflow-hidden ${i === 1 ? 'sm:col-span-2 sm:row-span-1' : ''}`}>
              <div className={`w-full bg-slate-100 ${i === 1 ? 'aspect-[2/1]' : 'aspect-[16/10]'}`} />
              <div className="p-5 md:p-6 bg-white">
                <div className="w-16 h-4 bg-slate-100 rounded mb-4" />
                <div className="w-full h-6 bg-slate-100 rounded mb-2" />
                <div className="w-3/4 h-6 bg-slate-100 rounded mb-6" />
                <div className="w-full h-3 bg-slate-100 rounded mb-2" />
                <div className="w-5/6 h-3 bg-slate-100 rounded mb-6" />
                <div className="flex justify-between">
                  <div className="w-16 h-3 bg-slate-100 rounded" />
                  <div className="w-12 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const visibleArticles = articles.slice(0, visibleCount)
  const hasMore = visibleCount < articles.length

  // Featured article for hero (first article)
  const heroArticle = articles.length > 0 ? articles[0] : null
  // The newest article sits in the desktop-only hero card; below lg it must stay in the grid,
  // otherwise phones/tablets never see the latest story (BUG-024).
  const gridArticles = visibleArticles

  return (
    <div className="px-4 md:px-8 max-w-[1920px] mx-auto pb-12">
      {/* HERO BANNER */}
      <div className="relative w-full rounded-[24px] overflow-hidden mb-8 h-[160px] md:h-[200px] shadow-sm">
        <Image src="/city_icon_delhi_1789524771933.jpg" alt="All News" fill className="absolute inset-0 object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

        <div className="relative z-10 w-full h-full flex items-center justify-between p-6 md:px-12">
          {/* Left Text */}
          <div className="max-w-md">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-brand-navy leading-none">
              {language === 'mr' ? <>सर्व <span className="text-brand-red">बातम्या</span></> : language === 'hi' ? <>सभी <span className="text-brand-red">समाचार</span></> : <>All <span className="text-brand-red">News</span></>}
            </h1>
            <p className="text-gray-600 font-medium text-xs md:text-sm leading-relaxed hidden sm:block">
              {language === 'hi' ? 'पुणे, महाराष्ट्र और देश से ताज़ा ख़बरें' : language === 'mr' ? 'पुणे, महाराष्ट्र आणि देशातील ताज्या बातम्या' : 'Explore the latest news, in-depth analysis and stories from Pune, Maharashtra and beyond.'}
            </p>
          </div>

          {/* Right Top Story Card (Hidden on Mobile) */}
          {heroArticle && (
            <div className="hidden lg:block w-[380px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-300 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all" onClick={() => viewArticle(heroArticle)}>
              <Badge className="bg-brand-red text-white border-none font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 mb-3 shadow-sm">
                {t('topStory') || (language === 'mr' ? 'टॉप स्टोरी' : language === 'hi' ? 'टॉप स्टोरी' : 'TOP STORY')}
              </Badge>
              <h3 className="font-heading font-black text-lg text-gray-900 leading-tight tracking-tight mb-3 group-hover:text-brand-navy transition-colors line-clamp-2">
                {getLocalizedText(heroArticle.title, language) || heroArticle.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest" suppressHydrationWarning>
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  {mounted && (heroArticle.publishedAt || heroArticle.createdAt) ? new Date(heroArticle.publishedAt || heroArticle.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </span>
                <div className="w-7 h-7 rounded-full bg-brand-navy group-hover:bg-brand-red flex items-center justify-center text-white shadow-md transform group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH QUERY BANNER */}
      {searchQuery && (
        <div className="mb-6 bg-blue-50/70 border border-slate-300 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-red uppercase tracking-wider">{t('searchResults') || 'Search Results'}</p>
              <h3 className="text-base font-black text-gray-900 leading-tight">
                {language === 'mr' ? `"${searchQuery}" साठी बातम्या दाखवत आहे` : language === 'hi' ? `"${searchQuery}" के लिए समाचार दिखा रहे हैं` : `Showing articles for "${searchQuery}"`}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-brand-red text-xs font-bold text-gray-700 hover:text-brand-red rounded-full transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> {t('clearSearch') || 'Clear Search'}
          </button>
        </div>
      )}

      {/* FILTER & SORT BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4 relative z-20">
        {/* Category Pills */}
        <div className="flex-1 w-full overflow-x-auto hide-scrollbar flex items-center gap-2 pb-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wide font-black whitespace-nowrap transition-all border shadow-xs ${currentCategory === 'all' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-slate-300 hover:border-brand-navy'}`}
          >
            {t('all') || (language === 'mr' ? 'सर्व' : language === 'hi' ? 'सभी' : 'All')}
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wide font-black whitespace-nowrap transition-all border shadow-xs ${currentCategory === cat.slug ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-600 border-slate-300 hover:border-brand-navy'}`}
            >
              {getTranslatedCategory(cat.name, language)}
            </button>
          ))}
        </div>

        {/* Sort & Layout Controls */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <Select defaultValue="latest">
            <SelectTrigger className="w-[130px] h-8 bg-white border-slate-300 rounded-md text-[11px] font-bold text-gray-600 focus:ring-0 shadow-xs uppercase tracking-wide">
              <SelectValue placeholder={t('latestFirst') || 'Latest First'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest" className="text-xs font-bold">{t('latestFirst') || 'Latest First'}</SelectItem>
              <SelectItem value="oldest" className="text-xs font-bold">{t('oldestFirst') || 'Oldest First'}</SelectItem>
              <SelectItem value="popular" className="text-xs font-bold">{t('mostPopular') || 'Most Popular'}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-slate-50 rounded-md p-1 border border-slate-300 shadow-xs hidden sm:flex">
            <button className="w-7 h-6 rounded flex items-center justify-center bg-brand-navy text-white shadow-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button className="w-7 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4"></rect><rect x="3" y="10" width="18" height="4"></rect><rect x="3" y="16" width="18" height="4"></rect></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Premium News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {gridArticles.map((article, idx) => (
          <div
            key={article.id}
            className={`group rounded-2xl overflow-hidden cursor-pointer border border-slate-300 hover:border-brand-navy bg-white hover:shadow-lg active:scale-[0.99] transition-all duration-300 flex flex-row sm:flex-col h-full ${idx === 0 && heroArticle?.id === article.id ? 'lg:hidden' : ''}`}
            onClick={() => viewArticle(article)}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-slate-100 w-[124px] aspect-video shrink-0 self-center ml-2.5 sm:ml-0 rounded-xl sm:rounded-none sm:w-full sm:aspect-video">
              <Image
                src={proxyImageUrl(
                  (article.thumbnails && article.thumbnails[0]) ||
                  article.thumbnailUrl ||
                  article.mainImage ||
                  '/placeholder-news.svg'
                )}
                alt={(article && article.title) ? (getLocalizedText(article.title, language) || article.title) : 'News Article'}
                fill
                className="object-contain w-full h-full transition-opacity duration-300 group-hover:opacity-95"
                sizes="(max-width: 640px) 124px, (max-width: 1024px) 50vw, 25vw"
                priority={idx === 0}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-news.svg';
                  e.currentTarget.srcset = '';
                }}
              />

              {/* Top-Left Category Badge */}
              <div className="absolute top-3 left-3 z-10 hidden sm:block">
                <Badge className="bg-brand-navy hover:bg-brand-navy-dark text-white text-[10px] font-bold px-3 py-1 rounded-full border-none shadow-sm capitalize">
                  {getTranslatedCategory(article.category, language) || t('news')}
                </Badge>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-3 sm:p-5 flex-1 flex flex-col min-w-0">
              {/* Date/Time */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mb-1 sm:mb-2 order-last sm:order-none mt-auto sm:mt-0" suppressHydrationWarning>
                <Clock className="w-3.5 h-3.5 text-brand-red" />
                <span suppressHydrationWarning>
                  {mounted && (article.publishedAt || article.createdAt) ? new Date(article.publishedAt || article.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-black text-[15px] sm:text-[17px] leading-snug sm:leading-tight mb-1 sm:mb-2 text-gray-900 group-hover:text-brand-navy transition-colors line-clamp-3">
                {getLocalizedText(article.title, language) || article.title}
              </h3>

              {/* Excerpt */}
              <p className="hidden sm:block text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                {getLocalizedText(article.content, language)?.replace(/<[^>]*>/g, '').substring(0, 120) || article.metaDescription || `Read the full story on ${siteConfig.brand.name}...`}
              </p>

              {/* Read More */}
              <div className="mt-auto pt-1 hidden sm:block">
                <span className="font-bold text-brand-red text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t('readMore') || 'Read More'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center pt-12 pb-4">
          <Button
            onClick={handleShowMore}
            disabled={loadingMore}
            className="group bg-brand-navy hover:bg-brand-red text-white font-black text-xs uppercase tracking-wider px-10 py-6 rounded-full shadow-md transition-all disabled:opacity-60"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('pleaseWait') || 'Loading...'}
              </>
            ) : (
              <>
                {t('showMore') || 'Show More News'}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      )}

      {articles.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
          <Newspaper className="h-16 w-16 mx-auto mb-6 text-gray-200" />
          <h3 className="text-xl font-heading font-black text-gray-400 mb-2">{t('noResults') || 'No articles found'}</h3>
          <p className="text-sm text-gray-400">{language === 'mr' ? 'दुसरी श्रेणी निवडून पहा' : language === 'hi' ? 'कोई अन्य श्रेणी चुनकर देखें' : 'Try selecting a different category'}</p>
        </div>
      )}
    </div>
  )
}

export default NewsPage