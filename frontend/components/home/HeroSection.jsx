'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'
import WeatherWidget from '@/components/WeatherWidget'
import { SafeDate } from './NewsCards'
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
      {/* --- MOBILE HERO & HEADLINES (StarNews v1 design) --- */}
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
                className="relative w-full flex-shrink-0 min-w-full sm:min-w-[340px] h-[72dvh] sm:h-auto sm:aspect-square rounded-none sm:rounded-[32px] overflow-hidden cursor-pointer snap-center shadow-lg border-y sm:border border-gray-100 bg-slate-950"
              >
                {/* Ambient backdrop + uncropped centered upper frame so image never stretches vertically or cuts edges */}
                <Image src={proxyImageUrl(resolveNewsImage(item))} alt="" aria-hidden="true" fill priority={idx === 0} className="object-cover scale-110 blur-xl opacity-50 brightness-75 pointer-events-none" onError={fallbackNewsImage} />
                <div className="absolute inset-x-0 top-0 bottom-36 z-10 flex items-center justify-center p-2">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-slate-900">
                    <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language) || 'News Image'} fill priority={idx === 0} className="object-fill w-full h-full" onError={fallbackNewsImage} />
                  </div>
                </div>
                <div className="absolute inset-0 z-[15] bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
                  <Badge className="bg-brand-red text-white border-none mb-3 px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">
                    {idx === 0 ? (t('topStory') || 'Top Story') : (getTranslatedCategory(item.category, t, language) || 'Featured')}
                  </Badge>
                  <h3 className="text-2xl font-heading font-black text-white leading-tight drop-shadow-2xl line-clamp-3">
                    {getLocalizedText(item.title, language)}
                  </h3>
                  <SafeDate date={item.publishedAt || item.createdAt} format="long" showClock={true} clockClassName="w-3.5 h-3.5 text-brand-red" className="mt-3 flex items-center gap-2 text-gray-300 text-xs font-bold" />
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

        {/* Mobile Weather Strip */}
        <div className="px-4">
          <WeatherWidget compact className="rounded-2xl shadow-md p-3.5 w-full" />
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
                <div key={item.id} onClick={() => onNewsClick(item)} className="p-4 bg-white flex gap-4 items-center active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0">
                  <div className="relative w-32 aspect-video shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                    <Image src={proxyImageUrl(resolveNewsImage(item))} alt={title || 'Thumbnail'} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
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

      {/* --- DESKTOP 3-ZONE EDITORIAL FRONT PAGE (3 | 6 | 3) --- */}
      <div className="hidden lg:block max-w-[1340px] mx-auto px-6 pt-3 mb-8">
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* LEFT RAIL (3 cols): LIVE WIRE / LATEST BULLETINS */}
          <div className="col-span-3 flex flex-col bg-white rounded-2xl border border-slate-300 shadow-sm p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-navy">
              <h2 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                {t('latestNews') || 'Latest News'}
              </h2>
              <button onClick={() => setCurrentView('news')} className="text-[11px] font-bold text-brand-red hover:underline flex items-center">
                {t('viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between divide-y divide-slate-200">
              {cleanLatestNews.slice(0, 6).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onNewsClick(item)}
                  className="py-2.5 first:pt-0 last:pb-0 flex gap-2.5 items-start cursor-pointer group"
                >
                  <span className="text-xs font-black text-brand-red/70 group-hover:text-brand-red tabular-nums pt-0.5 shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                      {getLocalizedText(item.title, language)}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-navy/70">
                        {getTranslatedCategory(item.category, t, language)}
                      </span>
                      <SafeDate date={item.publishedAt || item.createdAt} format="short" className="text-[10px] text-gray-400" />
                    </div>
                  </div>
                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <Image src={proxyImageUrl(resolveNewsImage(item))} alt="" fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER STAGE (6 cols): HERO FEATURE + 2 SUB-FEATURES */}
          <div className="col-span-6 flex flex-col gap-4">
            {cleanMainNews[0] && (
              <div
                onClick={() => onNewsClick(cleanMainNews[0])}
                className="relative overflow-hidden cursor-pointer group bg-slate-950 rounded-2xl shadow-md border border-slate-300 aspect-video"
              >
                <Image
                  src={proxyImageUrl(resolveNewsImage(cleanMainNews[0]))}
                  alt={getLocalizedText(cleanMainNews[0].title, language)}
                  fill
                  className="object-fill w-full h-full"
                  priority
                  onError={fallbackNewsImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge className="bg-brand-red text-white border-none text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                      {t('topStory') || 'Top Story'}
                    </Badge>
                    {cleanMainNews[0].category && (
                      <Badge className="bg-brand-navy/90 text-white border border-white/20 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
                        {getTranslatedCategory(cleanMainNews[0].category, t, language)}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-white text-2xl xl:text-[32px] font-black leading-[1.15] mb-2 group-hover:text-red-100 transition-colors drop-shadow">
                    {getLocalizedText(cleanMainNews[0].title, language)}
                  </h1>
                  <p className="text-gray-200 text-xs xl:text-[13px] line-clamp-2 mb-3 max-w-2xl leading-relaxed">
                    {getLocalizedText(cleanMainNews[0].content, language)?.replace(/<[^>]*>/g, '').substring(0, 170)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <SafeDate date={cleanMainNews[0].publishedAt || cleanMainNews[0].createdAt} format="long" showClock={true} clockClassName="w-3.5 h-3.5 text-brand-red" className="text-xs font-bold text-gray-300 flex items-center gap-1.5" />
                    <span className="inline-flex items-center gap-1.5 bg-brand-red group-hover:bg-brand-red-dark text-white text-[11px] font-black px-4 py-1.5 rounded-full transition-colors">
                      {t('readMore') || 'Read More'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2 Dual Feature Sub-Cards side-by-side */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {cleanMainNews.slice(1, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNewsClick(item)}
                  className="bg-white rounded-2xl border border-slate-300 hover:border-brand-navy shadow-xs hover:shadow-md overflow-hidden cursor-pointer group flex flex-col transition-all"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
                    {item.category && (
                      <span className="absolute bottom-2 left-2 bg-brand-navy/90 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {getTranslatedCategory(item.category, t, language)}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h3 className="text-[14px] font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                      {getLocalizedText(item.title, language)}
                    </h3>
                    <SafeDate date={item.publishedAt || item.createdAt} format="short" showClock={true} clockClassName="w-3 h-3 text-brand-red" className="text-[10px] font-semibold text-gray-400 flex items-center gap-1 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT RAIL (3 cols): WEATHER AT TOP + AD + COMPACT E-PAPER */}
          <div className="col-span-3 flex flex-col gap-4">
            <WeatherWidget compact className="rounded-2xl shadow-md p-3.5 w-full shrink-0" />

            <RotatingSidebarAd settings={sidebarAdSettings} currentAdIndex={currentAdIndex} setCurrentAdIndex={setCurrentAdIndex} t={t} variant="desktop" />

            <div
              onClick={() => setCurrentView('enewspaper')}
              className="bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white rounded-2xl p-3.5 shadow-md hover:shadow-xl transition-all cursor-pointer group shrink-0 flex items-center gap-3 border border-brand-navy-light/30"
            >
              <div className="relative w-16 h-22 min-h-[82px] rounded-xl overflow-hidden bg-white shrink-0 shadow group-hover:scale-105 transition-transform">
                <Image src={siteConfig.assets.epaperPreview} alt={`${siteConfig.brand.name} E-Paper`} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-red-300 block">{t('eNewspaper')}</span>
                <h3 className="font-black text-sm leading-snug mt-0.5">{t('todaysEpaper') || "Today's E-Paper"}</h3>
                <span className="inline-flex items-center gap-1 mt-2 bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full">
                  {t('readEpaper') || 'Read'} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MUST-READ HORIZONTAL EDITORIAL RIBBON */}
        <div className="mt-6 bg-slate-50 border border-slate-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-300">
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-red rounded-full" />
              {t('mustRead') || 'Must Read'}
            </h2>
            <button onClick={() => setCurrentView('news')} className="text-xs font-bold text-brand-navy hover:text-brand-red flex items-center gap-0.5">
              {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 divide-x divide-slate-300">
            {cleanMainNews.slice(3, 7).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNewsClick(item)}
                className="flex gap-3 items-start cursor-pointer group pl-4 first:pl-0"
              >
                <span className="text-2xl font-black text-brand-navy/35 group-hover:text-brand-red transition-colors leading-none shrink-0 tabular-nums">
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-[12.5px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                    {getLocalizedText(item.title, language)}
                  </h4>
                  <SafeDate date={item.publishedAt || item.createdAt} format="short" className="text-[10px] text-gray-400 mt-1 block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
