'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { SafeDate } from './NewsCards'
import { BusinessAdWidget, StickyAdWidget, SubscribeWidget } from './AdWidgets'
import { resolveNewsImage, fallbackNewsImage } from './newsHelpers'

export default function BusinessEconomySection({
  cleanBusinessNews,
  stockData,
  businessAdSettings,
  articleAdSettings,
  onNewsClick,
  onCategoryClick,
}) {
  const { t, language } = useLanguage()
  if (!cleanBusinessNews?.length) return null

  const labels = [t('markets') || 'Markets', t('economy') || 'Economy', t('corporate') || 'Corporate']
  const labelTextColors = ['text-brand-red', 'text-emerald-700', 'text-brand-navy']

  return (
    <>
      <div className="lg:hidden px-4 mb-6">
        {businessAdSettings?.enabled && <BusinessAdWidget settings={businessAdSettings} t={t} onClick={() => { }} />}
      </div>

      <section className="mb-10 w-full lg:max-w-[1340px] lg:mx-auto px-4 lg:px-6">
        <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 sm:p-6 shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b-2 border-brand-navy">
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-brand-navy flex items-center gap-2">
                <span className="w-2 h-5 bg-brand-red rounded-full shrink-0" />
                <span>{t('business') || 'Business'} &amp; {t('economy') || 'Economy'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t('businessTagline') || 'Markets. Policy. Business. Your edge in a changing economy.'}
              </p>
            </div>
            <button
              type="button"
              className="self-start sm:self-auto text-brand-navy hover:text-brand-red bg-white border border-slate-300 hover:border-brand-navy font-bold text-xs px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 shrink-0"
              onClick={() => onCategoryClick('business')}
            >
              {t('viewAll') || 'View All'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimal Live Index Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-6 bg-white border border-slate-300 px-4 py-2.5 mb-5 rounded-xl">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-[11px] font-black text-brand-navy uppercase tracking-wider">SENSEX</span>
              <span className="text-sm sm:text-base font-black text-gray-900 tabular-nums">{stockData.sensex.value}</span>
              <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${stockData.sensex.up ? 'text-emerald-700' : 'text-brand-red'}`}>
                {stockData.sensex.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {stockData.sensex.change} ({stockData.sensex.pct})
              </span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-slate-200" />
            <div className="flex items-center justify-between sm:justify-start gap-3 pt-2 sm:pt-0 border-t border-slate-200 sm:border-t-0">
              <span className="text-[11px] font-black text-brand-navy uppercase tracking-wider">NIFTY 50</span>
              <span className="text-sm sm:text-base font-black text-gray-900 tabular-nums">{stockData.nifty.value}</span>
              <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${stockData.nifty.up ? 'text-emerald-700' : 'text-brand-red'}`}>
                {stockData.nifty.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {stockData.nifty.change} ({stockData.nifty.pct})
              </span>
            </div>
          </div>

          {/* Clean 3-Card Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cleanBusinessNews.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNewsClick(item)}
                className="cursor-pointer group bg-white border border-slate-300 hover:border-brand-navy rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={proxyImageUrl(resolveNewsImage(item))}
                    alt={getLocalizedText(item.title, language)}
                    fill
                    className="object-fill w-full h-full"
                    onError={fallbackNewsImage}
                  />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${labelTextColors[idx]} block mb-1`}>
                      {labels[idx]}
                    </span>
                    <h4 className="text-[14px] font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors">
                      {getLocalizedText(item.title, language)}
                    </h4>
                  </div>
                  <SafeDate date={item.publishedAt || item.createdAt} format="short" showClock={true} className="text-[10px] text-gray-400 mt-2.5 flex items-center gap-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lg:hidden px-4 mb-10 space-y-4">
        {articleAdSettings?.banner?.enabled && articleAdSettings.banner.imageUrl && (
          <Card className="overflow-hidden border border-slate-300 shadow-sm rounded-2xl cursor-pointer" onClick={() => articleAdSettings.banner.linkUrl && window.open(articleAdSettings.banner.linkUrl, '_blank')}>
            <CardContent className="p-0 aspect-[21/9] relative">
              <Image src={proxyImageUrl(articleAdSettings.banner.imageUrl)} alt="Banner Ad" fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-black/50 text-white text-[8px] px-1.5 py-0.5">{t('advertisement') || 'Advertisement'}</Badge>
            </CardContent>
          </Card>
        )}
        {articleAdSettings?.sticky?.enabled && (
          <StickyAdWidget settings={articleAdSettings} t={t} onClick={() => articleAdSettings.sticky.linkUrl && window.open(articleAdSettings.sticky.linkUrl, '_blank')} />
        )}
        <SubscribeWidget />
      </div>
    </>
  )
}
