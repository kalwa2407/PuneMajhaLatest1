'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
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
    <>
      <div className={`flex items-center justify-between mb-3 border-b-2 ${borderClass} pb-2`}>
        <h2 className="text-lg font-black text-brand-navy">{title}</h2>
        <button onClick={() => onCategoryClick(categoryKey)} className="text-brand-red text-xs font-bold hover:underline flex items-center gap-0.5">
          {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {items[0] && (
        <div onClick={() => onNewsClick(items[0])} className="cursor-pointer group mb-3">
          <div className="relative aspect-video overflow-hidden bg-gray-100 mb-2 rounded-lg">
            <Image src={proxyImageUrl(resolveNewsImage(items[0]))} alt={title} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
            <Badge className={`absolute top-2 left-2 ${badgeClass} text-white border-none text-[9px] font-black uppercase px-2 py-0.5 tracking-wider rounded-sm`}>
              {badgeText}
            </Badge>
          </div>
          <h3 className="font-bold text-[14px] leading-tight group-hover:text-brand-navy transition-colors mb-1">
            {getLocalizedText(items[0].title, language)}
          </h3>
          <SafeDate date={items[0].publishedAt} format="short" showClock={true} className="text-[10px] text-gray-400 flex items-center gap-1" />
        </div>
      )}
      <div className="space-y-0">
        {items.slice(1, 3).map((item, idx) => (
          <div key={item.id} onClick={() => onNewsClick(item)} className={`flex gap-3 cursor-pointer group py-3 ${idx < 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-gray-100 rounded-md">
              <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-fill w-full h-full" onError={fallbackNewsImage} />
            </div>
            <div className="min-w-0">
              <h4 className="text-[12px] font-bold text-gray-900 leading-[1.4] line-clamp-2 group-hover:text-brand-navy transition-colors">
                {getLocalizedText(item.title, language)}
              </h4>
              <SafeDate date={item.publishedAt} format="short" className="text-[10px] text-gray-400 mt-1 block" />
            </div>
          </div>
        ))}
      </div>
    </>
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
    <section className="mb-10 w-full lg:max-w-[1340px] lg:mx-auto px-0 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
        {cleanPoliticsNews.length > 0 && (
          <div className="lg:col-span-4 pt-4 px-4 lg:px-0">
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
          <div className="lg:col-span-4 pt-4 px-4 lg:px-0 lg:border-l lg:border-l-gray-200 lg:pl-6">
            <ColumnLeadCard
              items={cleanCrimeNews}
              title={t('crimeAndJustice') || 'Crime & Justice'}
              badgeText={t('crime') || 'Crime'}
              categoryKey="crime"
              borderClass="border-gray-800"
              badgeClass="bg-gray-900"
              onNewsClick={onNewsClick}
              onCategoryClick={onCategoryClick}
              language={language}
              t={t}
            />
          </div>
        )}

        {/* Live TV — right col (desktop) */}
        <div className="lg:col-span-4 pt-4 px-4 lg:px-0 lg:border-l lg:border-l-gray-200 lg:pl-6 hidden lg:block">
          <div className="flex items-center justify-between mb-4 border-b-2 border-brand-red pb-2">
            <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
              <span className="w-1.5 h-5 bg-brand-red rounded-full block" />
              {t('liveTv') || 'Live TV'}
            </h2>
            <button onClick={() => setCurrentView('live-tv')} className="text-brand-red text-[11px] font-black uppercase tracking-wider hover:underline flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full">
              {t('watchNow') || 'Watch Now'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="block relative aspect-video bg-gray-900 overflow-hidden group cursor-pointer rounded-lg shadow-sm">
            <LazyYouTube videoId={siteConfig.youtube.defaultVideoId} title={`${siteConfig.brand.shortName} Live`} />
            <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-black px-2 py-0.5 uppercase rounded flex items-center gap-1.5 shadow-md pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {t('live') || 'LIVE'}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-red" />
            <div>
              <h3 className="font-black text-brand-navy leading-none">{siteConfig.brand.shortName} Live</h3>
              <p className="text-[11px] text-gray-500 font-medium mt-1">{t('realNewsRealTime') || 'Real News. Real Time.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const CategoryGridSection = ({ items, title, categoryKey, barColor, linkColor, onNewsClick, onCategoryClick }) => {
  const { t, language } = useLanguage()
  if (!items?.length) return null
  return (
    <section className="mb-12 w-full max-w-[1340px] mx-auto px-4 lg:px-6">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-black text-brand-navy flex items-center gap-2">
          <span className={`w-1.5 h-5 ${barColor} rounded-full block`} />
          {title}
        </h2>
        <button onClick={() => onCategoryClick(categoryKey)} className={`${linkColor} text-xs font-bold flex items-center gap-1 hover:underline`}>
          {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((item) => (
          <NewsBox key={item.id} item={item} onClick={onNewsClick} language={language} />
        ))}
      </div>
    </section>
  )
}

export const MoreStoriesSection = ({ oldNews, visibleMoreStories, onLoadMore, onNewsClick }) => {
  const { t, language } = useLanguage()
  return (
    <section className="mb-16 w-full max-w-[1340px] mx-auto px-4 lg:px-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
        <h2 className="text-xl font-black text-brand-navy flex items-center gap-2">
          <span className="w-1.5 h-5 bg-brand-red rounded-full block" />
          {t('moreStories') || 'More Stories'}
        </h2>
        <span className="text-xs text-gray-400 font-medium">{t('exploreAllCategories') || 'Explore all categories & archives'}</span>
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
