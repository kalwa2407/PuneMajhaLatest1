'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/lib/siteConfig'

// Default breaking news headlines (shown when no API data)
const DEFAULT_BREAKING_NEWS = siteConfig.tickerDefaults.join(' • ')

const BreakingNewsTicker = () => {
  const { t, language } = useLanguage()
  const [tickerKey, setTickerKey] = useState(0)
  const [ticker, setTicker] = useState({ enabled: true, text: DEFAULT_BREAKING_NEWS })
  const [translatedText, setTranslatedText] = useState(DEFAULT_BREAKING_NEWS)
  const [loading, setLoading] = useState(true)

  // Load breaking ticker from API
  const loadTicker = useCallback(async () => {
    try {
      const response = await fetch('/api/breaking-ticker')
      if (!response.ok) {
        setTicker({ enabled: true, text: DEFAULT_BREAKING_NEWS })
        return
      }
      const data = await response.json()

      if (data.enabled && data.text) {
        setTicker({ enabled: true, text: data.text })
      } else {
        // Use default text when API returns empty
        setTicker({ enabled: true, text: DEFAULT_BREAKING_NEWS })
      }
    } catch (error) {
      console.error('Failed to load breaking ticker:', error)
      setTicker({ enabled: true, text: DEFAULT_BREAKING_NEWS })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTicker()
    setTickerKey(prev => prev + 1)

    // Refresh every 5 minutes — breaking news changes rarely, and the API
    // already has a 1-minute server-side cache. 30-second polling was generating
    // ~10,000+ unnecessary Vercel invocations/hour at real traffic.
    const interval = setInterval(loadTicker, 300000)
    return () => clearInterval(interval)
  }, [loadTicker])

  // Handle dynamic translation — must be above any conditional return
  useEffect(() => {
    let isMounted = true;
    const updateTranslation = async () => {
      const hasDevanagari = /[\u0900-\u097F]/.test(ticker.text || '');
      const skip =
        (language === 'hi' && hasDevanagari) ||
        (language === 'en' && !hasDevanagari);
      if (skip) {
        if (isMounted) setTranslatedText(ticker.text);
        return;
      }
      try {
        const { translateText } = await import('@/lib/translation');
        const res = await translateText(ticker.text, hasDevanagari ? 'hi' : 'en');
        if (isMounted) setTranslatedText(res[language] || ticker.text);
      } catch (err) {
        console.error('Translation failed', err);
        if (isMounted) setTranslatedText(ticker.text);
      }
    };
    updateTranslation();
    return () => { isMounted = false; };
  }, [language, ticker.text]);

  // Hide if loading or no ticker
  if (loading || !ticker.enabled || !ticker.text) {
    return null
  }

  // Duplicate text for seamless scrolling
  const tickerContent = translatedText + '  ◆  '

  return (
    // NOTE: .ticker-wrapper and .ticker-content animation are defined in globals.css
    // (previously were in a <style jsx> tag which is NOT supported in App Router)
    <div className="overflow-hidden sticky top-0 lg:static z-40 flex h-9 bg-brand-navy-dark lg:bg-slate-950 w-full max-w-full min-w-0 border-b border-white/10 lg:border-brand-navy-dark/50">
      <div className="w-full lg:max-w-[1340px] lg:mx-auto lg:px-6 flex items-center min-w-0">
        {/* Left: Crimson BREAKING label */}
        <div className="breaking-label-container lg:rounded-full bg-brand-red flex items-center gap-2.5 pl-4 pr-6 lg:px-4 lg:h-6 h-full shrink-0 relative z-10 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-black text-white text-[11px] lg:text-[10px] uppercase tracking-[0.15em]">{t('breakingNews') || 'BREAKING'}</span>
        </div>
        {/* Right: Scrolling newsroom ticker */}
        <div className="flex-1 flex items-center overflow-hidden pl-4 -ml-[2px] lg:ml-0">
          <div className="ticker-wrapper" key={`${tickerKey}-${language}`}>
            <div className="ticker-content whitespace-nowrap font-semibold text-[12px] tracking-wide text-gray-100">
              {tickerContent}{tickerContent}{tickerContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreakingNewsTicker
