'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'
import WeatherWidget from '@/components/WeatherWidget'
import { SafeDate, NewsBox } from './NewsCards'
import { RotatingSidebarAd } from './AdWidgets'
import { getTranslatedCategory, resolveNewsImage, fallbackNewsImage } from './newsHelpers'

export default function HeroSection({
  cleanMainNews,
  cleanLatestNews,
  sidebarAdSettings,
  currentAdIndex,
  setCurrentAdIndex,
  onNewsClick,
  setCurrentView,
}) {
  const { t, language } = useLanguage()

  return (
    <>
      {/* --- MOBILE HERO & HEADLINES --- */}
      <div className="lg:hidden space-y-6 mb-10 pt-5">
        <div className="px-4">
          <div className="mag-section-header mb-4">
            <h2 className="text-2xl font-heading font-black tracking-tight flex items-center gap-2 leading-tight text-brand-navy">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
              {t('featured') || 'Featured News'}
            </h2>
          </div>

          <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-0">
            {cleanMainNews.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNewsClick(item)}
                className="relative w-full flex-shrink-0 min-w-full sm:min-w-[340px] h-[75dvh] sm:h-auto sm:aspect-square rounded-none sm:rounded-[32px] overflow-hidden cursor-pointer snap-center shadow-lg border-y sm:border border-gray-100"
              >
                <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language) || 'News Image'} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <Badge className="bg-brand-red text-white border-none mb-4 px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">
                    {idx === 0 ? (t('topStory') || 'Top Story') : (getTranslatedCategory(item.category, t, language) || 'Featured')}
                  </Badge>
                  <h3 className="text-2xl font-heading font-black text-white leading-tight drop-shadow-2xl">
                    {getLocalizedText(item.title, language)}
                  </h3>
                  <SafeDate date={item.publishedAt || item.createdAt} format="long" showClock={true} clockClassName="w-3.5 h-3.5 text-brand-red" className="mt-4 flex items-center gap-2 text-gray-300 text-xs font-bold" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Ads Block 1 */}
        <div className="px-4">
          <RotatingSidebarAd settings={sidebarAdSettings} currentAdIndex={currentAdIndex} setCurrentAdIndex={setCurrentAdIndex} t={t} variant="mobile" />
        </div>

        {/* Mobile Today's E-Paper Card */}
        <div className="px-4">
          <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setCurrentView('enewspaper')}>
            <div className="p-4 pb-2 relative z-10 bg-white">
              <h3 className="font-black text-lg text-brand-navy">{t('todaysEpaper') || "Today's E-Paper"}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{t('readLatestEdition') || 'Read the latest edition'}</p>
            </div>
            <div className="relative w-full overflow-hidden flex justify-center items-center bg-gray-50/50" style={{ height: '320px' }}>
              <Image src={siteConfig.assets.epaperPreview} alt={`${siteConfig.brand.name} E-Paper`} fill className="object-contain group-hover:scale-105 transition-transform duration-500 p-2" priority={false} />
            </div>
            <button className="w-full mt-0 bg-brand-navy hover:bg-brand-red text-white text-sm font-bold py-3.5 px-4 transition-colors flex items-center justify-between relative z-10 shadow-lg">
              <span>{t('readEpaper') || 'Read E-Paper'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Today's Headlines */}
        <div className="mt-8 mb-6">
          <div className="mag-section-header mb-4 px-4 border-l-4 border-brand-red">
            <h2 className="text-2xl font-heading font-black tracking-tighter italic pl-2 text-brand-navy">{t('todaysHeadlines') || "Today's Headlines"}</h2>
          </div>
          <div className="flex flex-col border-y border-gray-100">
            {cleanMainNews.slice(5, 15).map((item) => {
              const title = getLocalizedText(item.title, language)
              const category = getTranslatedCategory(item.category, t, language)
              return (
                <div key={item.id} onClick={() => onNewsClick(item)} className="p-4 bg-white flex gap-4 items-stretch active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0">
                  <div className="relative w-32 h-[90px] shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                    <Image src={proxyImageUrl(item.thumbnailUrl || item.mainImage || item.images?.[0] || siteConfig.assets.placeholderNews)} alt={title || 'Thumbnail'} fill className="object-fill w-full h-full" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-red block mb-1">{category}</span>
                      <h3 className="font-heading font-bold text-[15px] leading-[1.3] text-gray-900 line-clamp-2">{title}</h3>
                    </div>
                    <SafeDate date={item.publishedAt || item.createdAt} format="long" showClock={true} clockClassName="w-3 h-3 text-gray-400" className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- DESKTOP HERO + SIDEBAR + LATEST/MUST-READ --- */}
      <div className="hidden lg:block max-w-[1340px] mx-auto px-6 mb-8">
        <div className="grid grid-cols-12 gap-5">
          {/* LEFT: Big Hero */}
          <div className="col-span-6 flex">
            {cleanMainNews[0] && (
              <div onClick={() => onNewsClick(cleanMainNews[0])} className="relative w-full flex-shrink-0 overflow-hidden cursor-pointer group bg-gray-100 rounded-xl shadow-md" style={{ minHeight: '460px' }}>
                <Image src={proxyImageUrl(resolveNewsImage(cleanMainNews[0]))} alt={getLocalizedText(cleanMainNews[0].title, language)} fill className="object-fill w-full h-full" priority onError={fallbackNewsImage} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent rounded-xl" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex gap-2 mb-3">
                    <Badge className="bg-brand-red text-white border-none text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm">{t('topStory') || 'Top Story'}</Badge>
                    {cleanMainNews[0].category && (
                      <Badge className="bg-brand-navy/85 backdrop-blur-sm text-white border-none text-[10px] font-bold uppercase px-3 py-1 rounded-sm">
                        {getTranslatedCategory(cleanMainNews[0].category, t, language)}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] mb-3 group-hover:text-blue-100 transition-colors drop-shadow-xl">
                    {getLocalizedText(cleanMainNews[0].title, language)}
                  </h1>
                  <p className="text-gray-300 text-[13px] md:text-sm line-clamp-2 mb-4 leading-relaxed max-w-2xl">
                    {getLocalizedText(cleanMainNews[0].content, language)?.substring(0, 180)}...
                  </p>
                  <button className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-[12px] font-black px-5 py-2.5 rounded-full transition-colors shadow-lg">
                    {t('readFullStory') || t('readMore') || 'Read Full Story'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MIDDLE: 3 Stacked Sub-Articles */}
          <div className="col-span-3 flex flex-col gap-4">
            {cleanMainNews.slice(1, 4).map((item) => (
              <div key={item.id} onClick={() => onNewsClick(item)} className="flex flex-col flex-1 cursor-pointer group bg-white border border-gray-100 hover:border-brand-navy/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
                <div className="relative w-full aspect-[16/10] flex-shrink-0 overflow-hidden bg-gray-100">
                  <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="bg-brand-navy text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-md">
                      {getTranslatedCategory(item.category, t, language) || t('news') || 'News'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-[15px] font-extrabold leading-[1.3] text-gray-900 group-hover:text-brand-navy transition-colors line-clamp-2">
                      {getLocalizedText(item.title, language)}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                      {getLocalizedText(item.content, language)?.replace(/<[^>]*>/g, '').substring(0, 95)}...
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <SafeDate date={item.publishedAt || item.createdAt} format="short" showClock={true} clockClassName="w-3.5 h-3.5 text-brand-red" className="flex items-center gap-1.5" />
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">2 min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR: Rotating Ad + E-Paper + Weather */}
          <div className="col-span-3 flex flex-col gap-4">
            <RotatingSidebarAd settings={sidebarAdSettings} currentAdIndex={currentAdIndex} setCurrentAdIndex={setCurrentAdIndex} t={t} variant="desktop" />

            <div className="border border-gray-100 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group shrink-0" onClick={() => setCurrentView('enewspaper')}>
              <div className="p-4 pb-2 relative z-10 bg-white">
                <h3 className="font-black text-base text-brand-navy">{t('todaysEpaper') || "Today's E-Paper"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('readLatestEdition') || 'Read the latest edition'}</p>
              </div>
              <div className="relative w-full overflow-hidden flex justify-center items-center" style={{ height: '280px' }}>
                <Image src={siteConfig.assets.epaperPreview} alt={`${siteConfig.brand.name} E-Paper`} fill className="object-contain group-hover:scale-105 transition-transform duration-500 p-2" />
              </div>
              <button className="w-full mt-0 bg-brand-navy hover:bg-brand-red text-white text-sm font-bold py-3.5 px-4 transition-colors flex items-center justify-between relative z-10 shadow-lg rounded-b-xl">
                {t('readEpaper') || 'Read E-Paper'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <WeatherWidget compact className="rounded-xl shadow-lg p-3.5 mb-0 w-full shrink-0" />
          </div>
        </div>

        {/* LATEST NEWS + MUST READ ROW */}
        <div className="grid grid-cols-12 gap-5 mt-8 border-t border-gray-200 pt-6">
          <div className="col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-red rounded-full block" />
                {t('latestNews') || 'Latest News'}
              </h2>
              <button onClick={() => setCurrentView('news')} className="text-brand-navy hover:text-brand-red text-xs font-black hover:underline flex items-center gap-1">
                {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {cleanLatestNews.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => onNewsClick(item)} className="cursor-pointer group flex flex-col h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-3 rounded-lg shadow-sm">
                    <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                  </div>
                  {item.category && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-red mb-1.5 block">
                      {getTranslatedCategory(item.category, t, language)}
                    </span>
                  )}
                  <h4 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand-navy transition-colors mb-2">
                    {getLocalizedText(item.title, language)}
                  </h4>
                  <SafeDate date={item.publishedAt || item.createdAt} format="short" showClock={true} clockClassName="w-3 h-3 text-gray-300" className="mt-auto flex items-center gap-1.5 text-[10px] font-semibold text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 border-l border-gray-200 pl-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-navy rounded-full block" />
                {t('mustRead') || 'Must Read'}
              </h2>
              <div className="flex gap-1">
                <button className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors text-sm">&#8249;</button>
                <button className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors text-sm">&#8250;</button>
              </div>
            </div>
            <div className="space-y-4">
              {cleanMainNews.slice(4, 8).map((item, idx) => (
                <div key={item.id} onClick={() => onNewsClick(item)} className="flex gap-3 cursor-pointer group border-b border-gray-100 pb-3.5 last:border-b-0 last:pb-0">
                  <span className="text-[28px] font-black text-gray-200 group-hover:text-brand-red transition-colors shrink-0 leading-none w-8">0{idx + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-bold text-gray-900 leading-[1.4] line-clamp-2 group-hover:text-brand-navy transition-colors">
                      {getLocalizedText(item.title, language)}
                    </h4>
                    <SafeDate date={item.publishedAt || item.createdAt} format="short" className="text-[10px] text-gray-400 mt-1 block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LATEST NEWS SECTION */}
      {cleanLatestNews.length > 0 && (
        <section className="mb-10 w-full lg:container lg:mx-auto px-0 md:px-6 lg:hidden">
          <div className="mag-section-header mb-6 md:mb-8 px-4 md:px-0 flex items-center justify-between">
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-brand-navy">
              <span className="text-brand-red">{t('latestNews') || 'Latest'}</span> {t('update') || 'Update'}
            </h2>
            <div className="h-px flex-1 bg-gray-100 mx-4 md:mx-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10">
            {cleanLatestNews.slice(0, 4).map((item) => (
              <NewsBox key={item.id} item={item} onClick={onNewsClick} language={language} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
