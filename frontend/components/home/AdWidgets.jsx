'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Youtube } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'
import { fallbackNewsImage } from './newsHelpers'

export const PremiumAdBanner = ({ settings, t }) => {
  if (!settings?.enabled) return null
  return (
    <div className="z-40 relative bg-gradient-to-r from-brand-navy-dark via-brand-maroon to-brand-navy-dark shadow-xl premium-ad-banner mt-3 md:mt-4 md:mb-8 mb-4 w-full h-[100px] sm:h-[130px] md:h-40 overflow-hidden rounded-none md:rounded-2xl md:mx-auto md:max-w-7xl flex flex-col justify-center">
      {settings.imageUrl ? (
        <div className="relative h-full group w-full">
          <a href={settings.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.imageUrl}
              alt={settings.title || 'Advertisement'}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform [transition-duration:2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
          </a>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full border-y md:border border-white/10">
          <div className="text-center text-white/85">
            <p className="text-lg md:text-2xl font-serif italic font-bold">🎯 {settings.title || t('premiumAdSpace')}</p>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mt-1 md:mt-2">
              {t('contactForPlacements') || 'Reach Millions • Contact for Placements'}
            </p>
          </div>
        </div>
      )}
      <Badge className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/10 backdrop-blur-md text-white border-white/20 text-[8px] md:text-[10px] uppercase font-black tracking-widest">
        {t('advertisement')}
      </Badge>
    </div>
  )
}

export const RotatingSidebarAd = ({ settings, currentAdIndex, setCurrentAdIndex, t, variant = 'desktop' }) => {
  if (!settings?.enabled || !settings.items?.length) return null
  const items = settings.items
  const activeIdx = currentAdIndex % items.length
  const activeAd = items[activeIdx]
  const adImageSrc = proxyImageUrl(activeAd?.imageUrl || siteConfig.assets.placeholderNews)
  const openAd = () => {
    if (activeAd?.destinationUrl) window.open(activeAd.destinationUrl, '_blank')
  }

  if (variant === 'mobile') {
    return (
      <Card className="overflow-hidden border border-gray-100 shadow-md cursor-pointer rounded-2xl" onClick={openAd}>
        <CardContent className="p-0 aspect-[4/3] relative bg-brand-navy-dark">
          <Image src={adImageSrc} alt="" fill aria-hidden="true" className="object-cover scale-110 blur-xl opacity-55 brightness-75 pointer-events-none" onError={fallbackNewsImage} />
          <Image src={adImageSrc} alt="Advertisement" fill className="object-contain p-1 transition-opacity duration-700" onError={fallbackNewsImage} />
          <Badge className="absolute top-3 right-3 bg-black/60 text-white text-[9px] px-2 py-1 backdrop-blur-sm border-none uppercase tracking-wider">
            {t('advertisement') || 'Advertisement'}
          </Badge>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {items.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === activeIdx ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative overflow-hidden cursor-pointer bg-brand-navy-dark flex-1 min-h-[360px] rounded-xl shadow-sm group" onClick={openAd}>
      <Image src={adImageSrc} alt="" fill aria-hidden="true" className="object-cover scale-110 blur-xl opacity-55 brightness-75 pointer-events-none" onError={fallbackNewsImage} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45 pointer-events-none" />
      <Image src={adImageSrc} alt="Advertisement" fill className="object-contain p-1.5 transition-opacity duration-700" onError={fallbackNewsImage} />
      <Badge className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 border-none rounded-sm backdrop-blur-sm z-10">Ad</Badge>
      {items.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Ad slide ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentAdIndex(idx)
              }}
              className={`h-1.5 rounded-full transition-all ${idx === activeIdx ? 'bg-white w-4 shadow' : 'bg-white/50 hover:bg-white/80 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const BusinessAdWidget = ({ settings, t, onClick }) => {
  if (!settings?.enabled) return null
  return (
    <Card
      className="overflow-hidden border-2 border-gray-200 shadow-lg bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-red cursor-pointer transition-transform hover:scale-[1.02] mb-4"
      onClick={onClick}
    >
      <CardContent className="p-0 h-64 relative flex flex-col items-center justify-center text-center">
        <Badge className="absolute top-2 right-2 bg-white/30 text-white text-xs">{t('advertisement')}</Badge>
        {settings?.imageUrl ? (
          <div className="relative w-full h-full">
            <Image src={proxyImageUrl(settings.imageUrl)} alt="Business Ad" fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
          </div>
        ) : (
          <div className="text-white p-4">
            <p className="text-2xl font-bold mb-2">🏢 {settings?.title || 'BUSINESS'}</p>
            <p className="text-lg font-semibold">{settings?.subtitle || t('advertisement')}</p>
            <div className="mt-4 border-t border-white/30 pt-4">
              <Button
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent('openPostAdModal'))}
                className="mt-3 bg-white text-brand-navy hover:bg-gray-100 font-bold cursor-pointer shadow-sm active:scale-95 transition-transform"
              >
                {settings?.buttonText || t('postYourAd')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const SubscribeWidget = () => {
  const { t } = useLanguage()
  return (
    <Card className="overflow-hidden border-2 border-blue-100 shadow-lg bg-white mb-4">
      <CardContent className="p-4 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center shadow-lg mb-2 cursor-pointer hover:scale-110 transition-transform">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-brand-navy">{t('subscribeNow') || 'Subscribe Now!'}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('subscribeDesc') || 'Join our YouTube channel for breaking news and live updates.'}</p>
        </div>
        <a href={siteConfig.social.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-lg h-12 shadow-md transition-transform hover:scale-105">
            <Youtube className="mr-2 h-5 w-5" />
            {t('subscribe') || 'Subscribe'}
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}

export const ContactWidget = ({ t }) => (
  <Card className="overflow-hidden border-2 border-gray-200 shadow-lg bg-gradient-to-br from-brand-navy-dark via-brand-navy to-slate-900 mb-4">
    <CardContent className="p-0 h-56 relative flex flex-col items-center justify-center text-center">
      <Badge className="absolute top-2 right-2 bg-white/30 text-white text-xs">{t('contactUs')}</Badge>
      <div className="text-white p-4">
        <p className="text-2xl font-bold mb-2">📞 {siteConfig.brand.shortName}</p>
        <p className="text-lg font-semibold">{t('getInTouch')}</p>
        <div className="mt-4 border-t border-white/30 pt-4">
          <p className="text-sm">{t('whatsAppUs')}</p>
          <p className="text-lg font-bold">{siteConfig.contact.phoneDisplay}</p>
          <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="mt-3 bg-green-500 text-white hover:bg-green-600 font-bold">{t('chatNow')}</Button>
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const StickyAdWidget = ({ settings, t, onClick }) => {
  if (!settings?.sticky?.enabled) return null
  return (
    <Card className="overflow-hidden border-2 border-gray-200 shadow-lg cursor-pointer transition-transform hover:scale-[1.02] mb-4" onClick={onClick}>
      <CardContent className="p-0 min-h-[400px] relative bg-gray-100 flex items-center justify-center">
        {settings.sticky?.imageUrl ? (
          <div className="relative w-full h-full">
            <Image src={settings.sticky.imageUrl} alt={settings.sticky.title || 'Advertisement'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-4 text-white text-center">
            <p className="font-bold text-lg">{t('yourAdHere')}</p>
            <p className="text-sm opacity-80">300 x 400 px</p>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5">{t('advertisement')}</Badge>
      </CardContent>
    </Card>
  )
}
