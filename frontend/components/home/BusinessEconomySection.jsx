'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const labelColors = ['bg-brand-red', 'bg-emerald-600', 'bg-brand-navy-light']

  return (
    <>
      <div className="lg:hidden px-4 mb-6">
        {businessAdSettings?.enabled && <BusinessAdWidget settings={businessAdSettings} t={t} onClick={() => {}} />}
      </div>

      <section className="mb-10 w-full lg:max-w-[1340px] lg:mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative text-white py-7 sm:py-10 px-4 sm:px-6 lg:px-10 overflow-hidden shadow-2xl rounded-2xl">
          <div className="absolute inset-0 z-0">
            <Image src="/business-economy-bg.jpg" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d163c]/95 via-[#131d4f]/85 to-[#0a1230]/75" />
          </div>

          <div className="flex items-end justify-between mb-5 sm:mb-6 relative z-10">
            <div>
              <h2 className="font-black text-2xl sm:text-3xl lg:text-4xl leading-tight">
                {t('business') || 'Business'} &amp; <span className="text-emerald-400 italic font-serif">{t('economy') || 'Economy'}</span>
              </h2>
              <p className="text-[11px] sm:text-[12px] text-gray-300 mt-1">
                {t('businessTagline') || 'Markets. Policy. Business. Your edge in a changing economy.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 bg-white/5 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white font-black text-xs px-3.5 sm:px-5 h-8 sm:h-9 rounded-lg transition-all backdrop-blur-sm shrink-0"
              onClick={() => onCategoryClick('business')}
            >
              {t('viewAll') || 'View All'} <ChevronRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Live Stock Ticker */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-6 bg-white/5 backdrop-blur-md border border-white/10 px-4 sm:px-6 py-3 mb-6 relative z-10 rounded-xl">
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">SENSEX</span>
              <span className="text-base sm:text-xl font-black text-white">{stockData.sensex.value}</span>
              <span className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${stockData.sensex.up ? 'text-green-400' : 'text-red-400'}`}>
                {stockData.sensex.up ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {stockData.sensex.change} ({stockData.sensex.pct})
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/15" />
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">NIFTY 50</span>
              <span className="text-base sm:text-xl font-black text-white">{stockData.nifty.value}</span>
              <span className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${stockData.nifty.up ? 'text-green-400' : 'text-red-400'}`}>
                {stockData.nifty.up ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {stockData.nifty.change} ({stockData.nifty.pct})
              </span>
            </div>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 gap-4 lg:gap-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 hide-scrollbar snap-x snap-mandatory relative z-10 -mx-1 px-1">
            {cleanBusinessNews.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onNewsClick(item)}
                className="min-w-[270px] sm:min-w-0 flex-1 snap-start cursor-pointer group overflow-hidden relative bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-all rounded-xl hover:bg-white/10 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-900 rounded-t-xl">
                  <Image src={proxyImageUrl(resolveNewsImage(item))} alt={getLocalizedText(item.title, language)} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" onError={fallbackNewsImage} />
                  <span className={`absolute top-2.5 left-2.5 ${labelColors[idx]} text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-full shadow-md`}>
                    {labels[idx]}
                  </span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <h4 className="text-[13px] sm:text-[14px] font-bold text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
                    {getLocalizedText(item.title, language)}
                  </h4>
                  <SafeDate date={item.publishedAt || item.createdAt} format="short" className="text-[10px] text-gray-400 mt-2 block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lg:hidden px-4 mb-10 space-y-4">
        {articleAdSettings?.banner?.enabled && articleAdSettings.banner.imageUrl && (
          <Card className="overflow-hidden border border-gray-100 shadow-md rounded-2xl cursor-pointer" onClick={() => articleAdSettings.banner.linkUrl && window.open(articleAdSettings.banner.linkUrl, '_blank')}>
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
