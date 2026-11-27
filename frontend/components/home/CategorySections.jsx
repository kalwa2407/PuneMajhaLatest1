'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Radio } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'
import LazyYouTube from '@/components/LazyYouTube'
import { SafeDate, NewsBox } from './NewsCards'
import { resolveNewsImage, fallbackNewsImage } from './newsHelpers'

const ColumnLeadCard = ({ items, title, badgeText, categoryKey, borderClass, badgeClass, onNewsClick, onCategoryClick, language, t }) => {
  if (!items?.length) return null
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs h-full flex flex-col">
      <div className={`flex items-center justify-between mb-3.5 border-b-2 ${borderClass} pb-2.5`}>
        <h2 className="text-base font-black text-brand-navy uppercase tracking-wide">{title}</h2>
        <button onClick={() => onCategoryClick(categoryKey)} className="text-brand-red text-xs font-bold hover:underline flex items-center gap-0.5">
          {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {items[0] && (
        <div onClick={() => onNewsClick(items[0])} className="cursor-pointer group mb-3">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 mb-2.5 rounded-xl">
            <Image src={proxyImageUrl(resolveNewsImage(items[0]))} alt={title} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" onError={fallbackNewsImage} />
            <Badge className={`absolute top-2.5 left-2.5 ${badgeClass} text-white border-none text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider rounded-full`}>
              {badgeText}
            </Badge>
          </div>
          <h3 className="font-extrabold text-[15px] leading-snug group-hover:text-brand-navy transition-colors mb-1.5 text-gray-900">
            {getLocalizedText(items[0].title, language)}
          </h3>
          <SafeDate date={items[0].publishedAt} format="short" showClock={true} className="text-[10px] text-gray-400 flex items-center gap-1" />
        </div>
      )}
      <div className="space-y-0 mt-auto divide-y divide-gray-100 border-t border-gray-100 pt-1">
        {items.slice(1, 3).map((item) => (
          <div key={item.id} onClick={() => onNewsClick(item)} className="flex gap-3 cursor-pointer group py-2.5 last:pb-0">
            <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden bg-slate-100 rounded-lg">
              <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-cover w-full h-full" onError={fallbackNewsImage} />
            </div>
            <div className="min-w-0">
              <h4 className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                {getLocalizedText(item.title, language)}
              </h4>
              <SafeDate date={item.publishedAt} format="short" className="text-[10px] text-gray-400 mt-1 block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const PoliticsCrimeLiveSection = ({
  cleanPoliticsNews,
  cleanCrimeNews,
  onNewsClick,
  onCategoryClick,
  setCurrentView,
}) => {
  const { t, language } = useLanguage()

  return (
    <section className="mb-10 w-full lg:max-w-[1340px] lg:mx-auto px-4 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {cleanPoliticsNews.length > 0 && (
          <div className="lg:col-span-4">
            <ColumnLeadCard
              items={cleanPoliticsNews}
              title={t('nationalPolitics') || 'National Politics'}
              badgeText={t('politics') || 'Politics'}
              categoryKey="politics"
              borderClass="border-brand-navy"
              badgeClass="bg-brand-navy"
              onNewsClick={onNewsClick}
              onCategoryClick={onCategoryClick}
              language={language}
              t={t}
            />
          </div>
        )}

        {cleanCrimeNews.length > 0 && (
          <div className="lg:col-span-4">
            <ColumnLeadCard
              items={cleanCrimeNews}
              title={t('crimeAndJustice') || 'Crime & Justice'}
              badgeText={t('crime') || 'Crime'}
              categoryKey="crime"
              borderClass="border-brand-red"
              badgeClass="bg-brand-red"
              onNewsClick={onNewsClick}
              onCategoryClick={onCategoryClick}
              language={language}
              t={t}
            />
          </div>
        )}

        {/* Dark Broadcast Console Card for Live TV (desktop) */}
        <div className="lg:col-span-4 hidden lg:flex flex-col bg-[#0B122E] text-white rounded-2xl p-4 shadow-xl border border-brand-navy-light/30">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/10">
            <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-red animate-pulse" />
              {t('liveTv') || 'Live TV'}
            </h2>
            <button onClick={() => setCurrentView('live-tv')} className="text-white bg-brand-red hover:bg-brand-red-dark text-[10px] font-black uppercase tracking-wider flex items-center gap-1 px-3 py-1 rounded-full transition-colors">
              {t('watchNow') || 'Watch Now'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="relative aspect-video bg-black overflow-hidden rounded-xl border border-white/10 shadow-inner">
            <LazyYouTube videoId={siteConfig.youtube.defaultVideoId} title={`${siteConfig.brand.shortName} Live`} />
            <div className="absolute top-2.5 left-2.5 bg-brand-red text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-full flex items-center gap-1 shadow-md pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {t('live') || 'LIVE'}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-white leading-none">{siteConfig.brand.name}</h3>
              <p className="text-[11px] text-blue-200/75 font-medium mt-1">{t('realNewsRealTime') || 'Real News. Real Time.'}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
              24x7 HD
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export const CategoryGridSection = ({
  items,
  title,
  categoryKey,
  barColor,
  linkColor,
  variant = 'grid',
  onNewsClick,
  onCategoryClick,
}) => {
  const { t, language } = useLanguage()
  if (!items?.length) return null

  return (
    <section className="mb-12 w-full max-w-[1340px] mx-auto px-4 lg:px-6">
      <div className="flex items-center justify-between mb-5 border-t-2 border-gray-200/80 pt-4">
        <h2 className="text-lg font-black text-brand-navy flex items-center gap-2.5 uppercase tracking-wide">
          <span className={`w-2 h-5 ${barColor} rounded-full block`} />
          {title}
        </h2>
        <button onClick={() => onCategoryClick(categoryKey)} className={`${linkColor} text-xs font-extrabold flex items-center gap-1 hover:underline bg-slate-50 px-3 py-1 rounded-full border border-gray-200/70`}>
          {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {variant === 'spotlight' && items.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Featured Lead */}
          <div className="lg:col-span-5">
            <NewsBox item={items[0]} onClick={onNewsClick} language={language} />
          </div>
          {/* Right 3 Stacked Horizontal Stories */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            {items.slice(1, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onNewsClick(item)}
                className="bg-white border border-gray-200/80 hover:border-brand-navy/40 rounded-2xl p-3 flex gap-4 items-center cursor-pointer group shadow-xs hover:shadow-md transition-all flex-1"
              >
                <div className="relative w-28 sm:w-36 aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={proxyImageUrl(resolveNewsImage(item))}
                    alt={getLocalizedText(item.title, language)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={fallbackNewsImage}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-[15px] text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                    {getLocalizedText(item.title, language)}
                  </h3>
                  <p className="hidden sm:block text-xs text-gray-500 line-clamp-1 mt-1">
                    {getLocalizedText(item.content, language)?.replace(/<[^>]*>/g, '').substring(0, 110)}
                  </p>
                  <SafeDate
                    date={item.publishedAt || item.createdAt}
                    format="short"
                    showClock={true}
                    clockClassName="w-3 h-3 text-brand-red"
                    className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((item) => (
            <NewsBox key={item.id} item={item} onClick={onNewsClick} language={language} />
          ))}
        </div>
      )}
    </section>
  )
}

export const MoreStoriesSection = ({ oldNews, visibleMoreStories, onLoadMore, onNewsClick }) => {
  const { t, language } = useLanguage()
  return (
    <section className="mb-16 w-full max-w-[1340px] mx-auto px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6 border-t-2 border-brand-navy pt-4">
        <h2 className="text-xl font-black text-brand-navy flex items-center gap-2 uppercase tracking-wide">
          <span className="w-2 h-5 bg-brand-red rounded-full block" />
          {t('moreStories') || 'More Stories'}
        </h2>
        <span className="text-xs text-gray-500 font-semibold">{t('exploreAllCategories') || 'Explore all categories & archives'}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {oldNews.slice(6, visibleMoreStories + 6).map((item) => (
          <NewsBox key={item.id} item={item} onClick={onNewsClick} language={language} />
        ))}
      </div>
      {oldNews.length > visibleMoreStories + 6 && (
        <div className="flex justify-center pt-10">
          <button
            className="bg-brand-navy hover:bg-brand-red text-white text-xs font-black uppercase tracking-wider px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
            onClick={onLoadMore}
          >
            {t('loadMore') || 'LOAD MORE STORIES'} ↓
          </button>
        </div>
      )}
    </section>
  )
}
