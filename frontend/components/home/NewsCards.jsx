'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Eye, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { proxyImageUrl } from '@/lib/imageProxy'
import { siteConfig } from '@/lib/siteConfig'
import { getTranslatedCategory, resolveNewsImage, fallbackNewsImage } from './newsHelpers'

// SSR-safe date component to eliminate React hydration mismatch
export const SafeDate = ({ date, format = 'short', className = '', showClock = false, clockClassName = 'w-3 h-3 text-gray-400' }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!date) return null

  let text = ''
  if (mounted) {
    try {
      const d = new Date(date)
      if (!isNaN(d.getTime())) {
        text =
          format === 'long'
            ? d.toLocaleDateString()
            : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
      }
    } catch {}
  }

  return (
    <span className={className} suppressHydrationWarning>
      {showClock && <Clock className={clockClassName} />}
      {text}
    </span>
  )
}

export const NewsBox = ({ item, onClick, language }) => {
  const { t } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const title = getLocalizedText(item.title, language) || item.title || ''
  const category = getTranslatedCategory(item.category, t, language)

  useEffect(() => {
    if (item.images && item.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [item.images])

  const getValidImages = () => {
    const imgList = []
    const isValidUrl = (url) =>
      url && !url.includes('transparent.gif') && (url.startsWith('http') || url.startsWith('data:image') || url.startsWith('/api/') || url.startsWith('/wp-content/'))

    if (isValidUrl(item.mainImage)) imgList.push(proxyImageUrl(item.mainImage))
    if (isValidUrl(item.thumbnailUrl) && !imgList.includes(proxyImageUrl(item.thumbnailUrl))) imgList.push(proxyImageUrl(item.thumbnailUrl))
    if (item.galleryImages?.length) item.galleryImages.forEach((img) => isValidUrl(img) && !imgList.includes(proxyImageUrl(img)) && imgList.push(proxyImageUrl(img)))
    if (item.thumbnails?.length) item.thumbnails.forEach((th) => isValidUrl(th) && !imgList.includes(proxyImageUrl(th)) && imgList.push(proxyImageUrl(th)))
    if (item.images?.length) item.images.forEach((img) => isValidUrl(img) && !imgList.includes(proxyImageUrl(img)) && imgList.push(proxyImageUrl(img)))
    if (!imgList.length) imgList.push(siteConfig.assets.placeholderNews)
    return imgList
  }

  const images = getValidImages()

  return (
    <div
      className="group cursor-pointer overflow-hidden bg-white border border-gray-200/80 hover:border-brand-navy/40 shadow-xs hover:shadow-lg rounded-2xl transition-all duration-300 mb-4 md:mb-0 flex flex-col h-full relative"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={images[currentImageIndex] || siteConfig.assets.placeholderNews}
          alt={title}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={fallbackNewsImage}
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={true}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {category && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy">
                {category}
              </span>
            </div>
          )}
          <h3 className="font-heading font-extrabold text-[17px] md:text-[15px] leading-[1.32] line-clamp-3 md:line-clamp-2 group-hover:text-brand-navy transition-colors tracking-tight text-gray-900">
            {title}
          </h3>
        </div>
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <SafeDate
            date={item.publishedAt || item.createdAt}
            format="long"
            showClock={true}
            clockClassName="w-3 h-3 text-brand-red"
            className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"
          />
          <span className="text-[10px] font-black text-brand-red uppercase tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            {t('readMore') || 'Read →'}
          </span>
        </div>
      </div>
      <div className="h-[2.5px] w-0 group-hover:w-full bg-gradient-to-r from-brand-navy to-brand-red transition-all duration-300" />
    </div>
  )
}

export const NewsCard = ({ item, onClick, accentColor = 'red', language }) => {
  const { t } = useLanguage()
  const title = getLocalizedText(item.title, language) || item.title || ''
  const category = getTranslatedCategory(item.category, t, language)
  const [imgSrc, setImgSrc] = useState(proxyImageUrl(resolveNewsImage(item)))

  useEffect(() => {
    setImgSrc(proxyImageUrl(resolveNewsImage(item)))
  }, [item])

  const accentBorderHover =
    {
      red: 'group-hover:text-brand-red',
      navy: 'group-hover:text-brand-navy',
      green: 'group-hover:text-green-600',
      blue: 'group-hover:text-brand-navy',
      emerald: 'group-hover:text-emerald-600',
      purple: 'group-hover:text-purple-600',
    }[accentColor] || 'group-hover:text-brand-navy'

  const badgeBg =
    {
      red: 'bg-brand-red',
      navy: 'bg-brand-navy',
      green: 'bg-green-600',
      blue: 'bg-brand-navy',
      emerald: 'bg-emerald-600',
      purple: 'bg-purple-600',
    }[accentColor] || 'bg-brand-red'

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(siteConfig.assets.placeholderNews)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized={true}
          referrerPolicy="no-referrer"
        />
        {category && (
          <span className={`absolute top-2.5 left-2.5 ${badgeBg} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow`}>
            {category}
          </span>
        )}
      </div>
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <h4 className={`font-bold text-[13px] line-clamp-2 ${accentBorderHover} transition-colors leading-snug text-gray-900`}>
          {title}
        </h4>
        <div className="text-[10px] text-gray-400 mt-2.5 flex items-center justify-between pt-2 border-t border-gray-50">
          <SafeDate
            date={item.publishedAt || item.createdAt}
            format="short"
            showClock={true}
            clockClassName="h-3 w-3"
            className="flex items-center gap-1"
          />
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {item.views || 0}
          </span>
        </div>
      </div>
    </div>
  )
}
