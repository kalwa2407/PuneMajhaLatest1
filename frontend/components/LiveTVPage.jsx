'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { extractYouTubeId } from '@/lib/youtube'
import { siteConfig } from '@/lib/siteConfig'
import {
  Tv,
  Play,
  Share2,
  CheckCircle2,
  Search,
  Maximize2,
  Minimize2,
  VolumeX,
  Volume2,
  Radio,
  Calendar,
  Clock,
  Flame,
  TrendingUp,
  Sun,
  Music2,
  Trophy,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  Film,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const CATEGORY_CATALOG = [
  { id: 'all', en: 'All Channels', mr: 'सर्व चॅनेल्स', hi: 'सभी चैनल', Icon: Flame },
  { id: 'news', en: 'News Desk', mr: 'बातम्या', hi: 'समाचार', Icon: Radio },
  { id: 'business', en: 'Markets & Business', mr: 'व्यापार', hi: 'बिजनेस', Icon: TrendingUp },
  { id: 'sports', en: 'Sports Desk', mr: 'क्रीडा', hi: 'खेल', Icon: Trophy },
  { id: 'devotional', en: 'Live Darshan', mr: 'देवदर्शन', hi: 'दर्शन', Icon: Sun },
  { id: 'kids', en: 'Kids', mr: 'मुले', hi: 'बच्चे', Icon: Sparkles },
  { id: 'music', en: 'Music', mr: 'संगीत', hi: 'संगीत', Icon: Music2 },
]

const SCHEDULE_ITEMS = [
  { startHour: 6, endHour: 8.5, time: '06:00 – 08:30', title: 'Maharashtra Prabhat', titleMr: 'महाराष्ट्र प्रभात', desc: 'Morning regional headlines, weather & traffic updates' },
  { startHour: 8.5, endHour: 10.5, time: '08:30 – 10:30', title: 'Pune City & Kondhwa Ground Report', titleMr: 'पुणे शहर व कोंढवा ग्राउंड रिपोर्ट', desc: 'Dedicated civic, municipal & local Pune neighborhood coverage' },
  { startHour: 10.5, endHour: 13.5, time: '10:30 – 13:30', title: 'Newsroom 360 Live', titleMr: 'न्यूजरूम ३६० लाइव्ह', desc: 'Maharashtra politics, cabinet briefings & press conferences' },
  { startHour: 13.5, endHour: 16.5, time: '13:30 – 16:30', title: 'Market & Economy Pulse', titleMr: 'बाजारपेठ व अर्थव्यवस्था', desc: 'Sensex, Nifty updates, agri-mandi rates & local commerce' },
  { startHour: 16.5, endHour: 19, time: '16:30 – 19:00', title: 'Law, Order & Investigation Desk', titleMr: 'कायदा व तपास डेस्क', desc: 'Police updates, civic enforcement & verified legal reports' },
  { startHour: 19, endHour: 21, time: '19:00 – 21:00', title: 'Prime Bulletin & Debate', titleMr: 'प्राइम बुलेटिन व चर्चा', desc: 'Flagship evening news roundup & citizen discussions' },
  { startHour: 21, endHour: 23.5, time: '21:00 – 23:30', title: 'Districts Express 36', titleMr: 'जिल्हे एक्सप्रेस ३६', desc: 'Comprehensive wrap of major stories across Maharashtra' },
  { startHour: 23.5, endHour: 6, time: '23:30 – 06:00', title: 'Night Wire & 24/7 Feed', titleMr: 'नाइट वायर २४x७', desc: 'Continuous overnight breaking headlines and top replays' },
]

const LABELS = {
  en: {
    studioTitle: 'Broadcast Studio',
    studioSub: '24/7 Live Bulletins, Ground Reports & Newsroom Feeds',
    streamsLabel: 'Channels',
    searchPlaceholder: 'Search channels, bulletins or reports...',
    cinemaOn: 'Lights On',
    cinemaOff: 'Theater',
    backHome: 'Back to News',
    unmute: 'Tap to unmute',
    live: 'LIVE',
    report: 'VIDEO REPORT',
    watchYoutube: 'Subscribe on YouTube',
    share: 'Share',
    expand: 'Wide View',
    compact: 'Split View',
    channelsTab: 'Channels',
    bulletinsTab: 'Bulletins',
    scheduleTab: 'Schedule (IST)',
    nowPlaying: 'Playing',
    onAirNow: 'On Air Now',
    directoryTitle: 'Live Broadcast Channels',
    videosTitle: 'Latest News Video Bulletins',
    loadMore: 'Load More Bulletins',
    copiedToast: 'Broadcast link copied!',
    defaultDesc: `Verified ground reports, civic updates, and breaking coverage from the ${siteConfig.brand.name} broadcast desk.`,
  },
  hi: {
    studioTitle: 'लाइव प्रसारण स्टूडियो',
    studioSub: '24x7 ताज़ा बुलेटिन, ग्राउंड रिपोर्ट और न्यूज़ फ़ीड',
    streamsLabel: 'चैनल',
    searchPlaceholder: 'चैनल या वीडियो समाचार खोजें...',
    cinemaOn: 'लाइट्स ऑन',
    cinemaOff: 'थिएटर मोड',
    backHome: 'मुख्य समाचार',
    unmute: 'आवाज़ चालू करें (Unmute)',
    live: 'लाइव',
    report: 'वीडियो रिपोर्ट',
    watchYoutube: 'YouTube सब्सक्राइब करें',
    share: 'शेयर करें',
    expand: 'वाइड व्यू',
    compact: 'स्प्लिट व्यू',
    channelsTab: 'चैनल',
    bulletinsTab: 'ताज़ा वीडियो',
    scheduleTab: 'कार्यक्रम (IST)',
    nowPlaying: 'चल रहा है',
    onAirNow: 'अभी लाइव',
    directoryTitle: 'लाइव समाचार चैनल',
    videosTitle: 'ताज़ा वीडियो बुलेटिन',
    loadMore: 'और वीडियो देखें',
    copiedToast: 'लाइव लिंक कॉपी हो गया!',
    defaultDesc: `${siteConfig.brand.name} न्यूज़ डेस्क से सत्यापित ग्राउंड रिपोर्ट, शहर अपडेट और ब्रेकिंग न्यूज़।`,
  },
  mr: {
    studioTitle: 'थेट प्रक्षेपण स्टुडिओ',
    studioSub: '२४ तास ताज्या बातम्या, ग्राउंड रिपोर्ट आणि न्यूजरूम अपडेट्स',
    streamsLabel: 'चॅनेल्स',
    searchPlaceholder: 'चॅनेल किंवा बातमीचा विषय शोधा...',
    cinemaOn: 'लाइट्स ऑन',
    cinemaOff: 'थिएटर मोड',
    backHome: 'मुख्य पृष्ठ',
    unmute: 'आवाज सुरू करा (Unmute)',
    live: 'थेट',
    report: 'व्हिडिओ रिपोर्ट',
    watchYoutube: 'YouTube सबस्क्राईब करा',
    share: 'शेअर करा',
    expand: 'मोठी स्क्रीन',
    compact: 'सामान्य व्ह्यू',
    channelsTab: 'चॅनेल्स',
    bulletinsTab: 'व्हिडिओ बातम्या',
    scheduleTab: 'वेळापत्रक (IST)',
    nowPlaying: 'सुरू आहे',
    onAirNow: 'सध्या प्रसारित',
    directoryTitle: 'थेट बातम्यांचे चॅनेल्स',
    videosTitle: 'ताज्या व्हिडिओ बातम्या',
    loadMore: 'आणखी व्हिडिओ पहा',
    copiedToast: 'लाइव्ह लिंक कॉपी झाली!',
    defaultDesc: `${siteConfig.brand.name} न्यूजरूमकडून सत्यापित ग्राउंड रिपोर्ट, पुणे शहर अपडेट्स आणि ताज्या घडामोडी.`,
  },
}

/* Branded tile fallback when YouTube thumbnail is dead or unavailable */
const ChannelThumb = ({ channel, src, className }) => {
  const [dead, setDead] = useState(!src || channel.thumbAvailable === false)

  useEffect(() => {
    setDead(!src || channel.thumbAvailable === false)
  }, [src, channel.thumbAvailable])

  if (dead) {
    const name = String(channel.channelName || channel.title || 'Live')
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-white select-none bg-gradient-to-br from-brand-navy-dark via-brand-navy to-slate-950 p-2">
        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/25">
          <Radio className="w-4 h-4 text-red-400" />
        </span>
        <span className="px-2 text-center text-[11px] font-bold leading-tight line-clamp-2">{name}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={channel.title || channel.channelName || 'Stream'}
      loading="lazy"
      className={className}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth > 0 && e.currentTarget.naturalWidth <= 120) setDead(true)
      }}
      onError={() => setDead(true)}
    />
  )
}

function getCurrentIstDecimalHour() {
  try {
    const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    return ist.getHours() + ist.getMinutes() / 60
  } catch {
    return 18
  }
}

function isSlotOnAir(slot, hour) {
  if (slot.startHour < slot.endHour) return hour >= slot.startHour && hour < slot.endHour
  return hour >= slot.startHour || hour < slot.endHour
}

export default function LiveTVPage({ setCurrentView }) {
  const { language } = useLanguage()
  const ui = LABELS[language] || LABELS.en

  const playerRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)
  const [cinemaBackdrop, setCinemaBackdrop] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)

  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStreamId, setActiveStreamId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [shareToast, setShareToast] = useState('')
  const [activeSidebarTab, setActiveSidebarTab] = useState('channels')

  const [newsVideos, setNewsVideos] = useState([])
  const [videoLang, setVideoLang] = useState('all')
  const [videoLimit, setVideoLimit] = useState(8)
  const [istHour, setIstHour] = useState(18)

  useEffect(() => {
    setIstHour(getCurrentIstDecimalHour())
  }, [])

  const unmutePlayer = () => {
    const win = playerRef.current?.contentWindow
    if (win) {
      const send = (func, args = []) => win.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
      send('unMute')
      send('setVolume', [100])
      send('playVideo')
    }
    setSoundOn(true)
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/live-tv')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        if (data && Array.isArray(data.streams) && data.streams.length > 0) {
          setChannels(data.streams)
          setActiveStreamId(data.primaryStreamId || data.streams[0].id)
        }
      })
      .catch((err) => console.error('Failed to load Live TV channels:', err))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    fetch('/api/news-videos')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!mounted || !d || !Array.isArray(d.videos)) return
        const nonShorts = d.videos.filter((v) => !v.isShort && v.videoId)
        setNewsVideos(nonShorts)

        // Check deep-link ?video=<id> from homepage Live TV card
        if (typeof window !== 'undefined') {
          const vParam = new URLSearchParams(window.location.search).get('video')
          if (vParam) {
            const match = nonShorts.find((v) => v.videoId === vParam)
            if (match) {
              const id = `vid-${match.videoId}`
              setChannels((prev) =>
                prev.some((c) => c.id === id)
                  ? prev
                  : [
                    ...prev,
                    {
                      id,
                      title: match.title,
                      channelName: match.channel,
                      category: 'news',
                      url: `https://www.youtube.com/watch?v=${match.videoId}`,
                      thumbnail: `https://i.ytimg.com/vi/${match.videoId}/mqdefault.jpg`,
                      isLive: false,
                      isActive: true,
                      description: match.channel,
                    },
                  ]
              )
              setActiveStreamId(id)
              setActiveSidebarTab('bulletins')
            }
          }
        }
      })
      .catch(() => { })
    return () => { mounted = false }
  }, [])

  const activeChannel = useMemo(
    () => channels.find((ch) => ch.id === activeStreamId) || channels[0] || null,
    [channels, activeStreamId]
  )

  const youtubeId = useMemo(
    () =>
      activeChannel
        ? extractYouTubeId(activeChannel.url) || siteConfig.youtube.defaultVideoId
        : siteConfig.youtube.defaultVideoId,
    [activeChannel]
  )

  // Keep mute stable for the active videoId until user taps Unmute
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const embedMute = useMemo(() => (soundOn ? 0 : 1), [youtubeId])

  const availableCategories = useMemo(() => {
    const present = new Set(channels.map((c) => c.category).filter(Boolean))
    return CATEGORY_CATALOG.filter((c) => c.id === 'all' || present.has(c.id))
  }, [channels])

  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return channels.filter((ch) => {
      const matchCat = selectedCategory === 'all' || ch.category === selectedCategory
      const matchSearch =
        !q ||
        ch.title?.toLowerCase().includes(q) ||
        ch.channelName?.toLowerCase().includes(q) ||
        ch.description?.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [channels, selectedCategory, searchQuery])

  const switchChannel = useCallback((id) => {
    setActiveStreamId(id)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const playNewsVideo = (v) => {
    const id = `vid-${v.videoId}`
    setChannels((prev) =>
      prev.some((c) => c.id === id)
        ? prev
        : [
          ...prev,
          {
            id,
            title: v.title,
            channelName: v.channel,
            category: 'news',
            url: `https://www.youtube.com/watch?v=${v.videoId}`,
            thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
            isLive: false,
            isActive: true,
            description: `${v.channel}${v.published ? ` • ${new Date(v.published).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}`,
          },
        ]
    )
    switchChannel(id)
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    const shareUrl = `${window.location.origin}/?view=live-tv`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareToast(ui.copiedToast)
        setTimeout(() => setShareToast(''), 2500)
      })
    }
  }

  const visibleVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return newsVideos.filter((v) => {
      const matchLang = videoLang === 'all' || v.lang === videoLang
      const matchQ = !q || v.title?.toLowerCase().includes(q) || v.channel?.toLowerCase().includes(q)
      return matchLang && matchQ
    })
  }, [newsVideos, videoLang, searchQuery])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-14">
      {/* Editorial Studio Control Strip */}
      <div className="bg-white border-b border-slate-300 sticky top-0 z-30">
        <div className="max-w-[1340px] mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{ui.live}</span>
            </span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-heading font-black text-brand-navy leading-tight truncate">
                {siteConfig.brand.shortName} · {ui.studioTitle}
              </h1>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium truncate">
                {ui.studioSub}
              </p>
            </div>
          </div>

          {/* Search & Utility Actions */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end max-w-full">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={ui.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-brand-navy focus:bg-white rounded-full pl-8 pr-3.5 py-1.5 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setCinemaBackdrop((prev) => !prev)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer shrink-0 ${cinemaBackdrop
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-slate-700 border-slate-300 hover:border-brand-navy'
                }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{cinemaBackdrop ? ui.cinemaOn : ui.cinemaOff}</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView && setCurrentView('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:border-brand-red hover:text-brand-red transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ui.backHome}</span>
            </button>
          </div>
        </div>

        {/* Clean Category Filter Pills (shown when more than 1 category exists) */}
        {availableCategories.length > 2 && (
          <div className="border-t border-slate-200 bg-slate-50/70">
            <div className="max-w-[1340px] mx-auto px-4 lg:px-6 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {availableCategories.map((cat) => {
                const selected = selectedCategory === cat.id
                const label = cat[language] || cat.en
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${selected
                      ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-brand-navy'
                      }`}
                  >
                    <cat.Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-navy text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl border border-white/15 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Broadcast Stage Wrapper (Optional Lights-Off Studio Dimming for Player Band ONLY) */}
      <div className={`transition-colors duration-300 ${cinemaBackdrop ? 'bg-[#090e1c] py-6 border-b border-slate-800' : 'pt-5 sm:pt-6'}`}>
        <div role="region" aria-label="Live TV player and channels" className="max-w-[1340px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* LEFT: Studio Player & Editorial Broadcast Details */}
            <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-4`}>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-[radial-gradient(circle_at_center,#172554_0%,#090d1a_68%,#04060d_100%)]">
                <iframe
                  ref={playerRef}
                  key={`stream-${youtubeId}`}
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${embedMute}&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                  title={activeChannel?.title || `${siteConfig.brand.name} Live Broadcast`}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

                {/* Top Broadcast Indicator */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                  {activeChannel?.isLive === false ? (
                    <span className="bg-brand-navy/90 backdrop-blur text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider border border-white/15">
                      {ui.report}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{ui.live}</span>
                    </span>
                  )}
                  <span className="bg-black/60 backdrop-blur text-white/95 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                    {activeChannel?.channelName || siteConfig.brand.shortName}
                  </span>
                </div>

                {/* Unmute Pill Control (preserves audio access without page reload) */}
                {!soundOn && (
                  <button
                    type="button"
                    onClick={unmutePlayer}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 bg-white/95 hover:bg-white text-brand-navy text-xs font-black px-4 py-2 rounded-full border border-slate-300 shadow-lg cursor-pointer transition-transform active:scale-95"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-brand-red" />
                    <span>{ui.unmute}</span>
                  </button>
                )}
              </div>

              {/* Crisp Editorial Details Card */}
              <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-red" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-navy">
                      {activeChannel?.channelName || siteConfig.brand.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-navy" />
                  </div>
                  {activeChannel?.category && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {activeChannel.category}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-2xl font-heading font-black text-slate-900 leading-snug">
                  {activeChannel?.title || `${siteConfig.brand.name} 24/7 Live Broadcast`}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeChannel?.description || ui.defaultDesc}
                </p>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                  <a
                    href={siteConfig.social.youtubeSubscribe}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black tracking-wide transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{ui.watchYoutube}</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <div className="flex items-center gap-2">
                    {soundOn && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Audio On</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-brand-navy" />
                      <span>{ui.share}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTheaterMode((prev) => !prev)}
                      className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5 text-brand-navy" /> : <Maximize2 className="w-3.5 h-3.5 text-brand-navy" />}
                      <span>{isTheaterMode ? ui.compact : ui.expand}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Broadcast Desk Sidebar (Channels Queue | Video Bulletins | Schedule IST) */}
            <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-4'} flex flex-col`}>
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xs flex flex-col h-[500px] lg:h-[640px] overflow-hidden">
                {/* Clean Tab Bar */}
                <div className="p-1.5 bg-slate-100 border-b border-slate-200 grid grid-cols-3 gap-1 shrink-0">
                  {[
                    { id: 'channels', label: `${ui.channelsTab} (${filteredChannels.length})`, Icon: Tv },
                    { id: 'bulletins', label: ui.bulletinsTab, Icon: Play },
                    { id: 'schedule', label: ui.scheduleTab, Icon: Calendar },
                  ].map((tab) => {
                    const active = activeSidebarTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSidebarTab(tab.id)}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${active
                          ? 'bg-brand-navy text-white shadow-xs'
                          : 'text-slate-600 hover:text-brand-navy hover:bg-white/70'
                          }`}
                      >
                        <tab.Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-red-300' : 'text-brand-red'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* TAB 1: CHANNELS QUEUE */}
                {activeSidebarTab === 'channels' && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 hide-scrollbar">
                    {loading && channels.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-semibold">Loading streams...</div>
                    ) : filteredChannels.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500 font-semibold">No matching channels found.</div>
                    ) : (
                      filteredChannels.map((channel) => {
                        const cYouTubeId = extractYouTubeId(channel.url)
                        const isPlaying = channel.id === activeStreamId
                        const thumbUrl =
                          channel.thumbnail ||
                          (cYouTubeId && channel.thumbAvailable !== false
                            ? `https://i.ytimg.com/vi/${cYouTubeId}/mqdefault.jpg`
                            : null)

                        return (
                          <div
                            key={channel.id}
                            onClick={() => switchChannel(channel.id)}
                            className={`flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all border group ${isPlaying
                              ? 'bg-red-50/70 border-brand-red shadow-xs'
                              : 'bg-white border-slate-200 hover:border-brand-navy hover:bg-slate-50'
                              }`}
                          >
                            <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                              <ChannelThumb
                                channel={channel}
                                src={thumbUrl}
                                className="w-full h-full object-fill"
                              />
                              <span className="absolute bottom-1 left-1 bg-brand-red text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                <span>{channel.isLive === false ? 'CLIP' : ui.live}</span>
                              </span>
                              {isPlaying && (
                                <div className="absolute inset-0 bg-brand-navy/35 flex items-center justify-center">
                                  <span className="bg-brand-red text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow">
                                    {ui.nowPlaying}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-navy">
                                  {channel.title}
                                </h4>
                                <p className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
                                  {channel.channelName || siteConfig.brand.shortName}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
                                <span className="uppercase">{channel.category || 'news'}</span>
                                {channel.viewers && <span className="text-brand-red">● {channel.viewers}</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {/* TAB 2: VIDEO BULLETINS QUEUE */}
                {activeSidebarTab === 'bulletins' && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 hide-scrollbar">
                    {newsVideos.slice(0, 15).map((v) => {
                      const isPlaying = activeStreamId === `vid-${v.videoId}`
                      return (
                        <button
                          key={v.videoId}
                          type="button"
                          onClick={() => playNewsVideo(v)}
                          className={`w-full text-left flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all border group ${isPlaying
                            ? 'bg-red-50/70 border-brand-red shadow-xs'
                            : 'bg-white border-slate-200 hover:border-brand-navy hover:bg-slate-50'
                            }`}
                        >
                          <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                              alt={v.title}
                              loading="lazy"
                              className="w-full h-full object-fill"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                              <span className="w-7 h-7 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow">
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              </span>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-navy">
                              {v.title}
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-500 mt-1.5 truncate">
                              {v.channel}
                              {v.published ? ` · ${new Date(v.published).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* TAB 3: DYNAMIC IST SCHEDULE */}
                {activeSidebarTab === 'schedule' && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 hide-scrollbar">
                    {SCHEDULE_ITEMS.map((prog, idx) => {
                      const live = isSlotOnAir(prog, istHour)
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all ${live
                            ? 'bg-red-50/70 border-brand-red shadow-xs'
                            : 'bg-white border-slate-200'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-mono font-bold text-brand-navy flex items-center gap-1">
                              <Clock className="w-3 h-3 text-brand-red" />
                              {prog.time}
                            </span>
                            {live && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-red text-white flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                {ui.onAirNow}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900">
                            {language === 'mr' ? prog.titleMr : prog.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{prog.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory & Video Archive Workspace */}
      <div className="max-w-[1340px] mx-auto px-4 lg:px-6 mt-10 space-y-12">
        {/* Live Channels Grid */}
        {filteredChannels.length > 0 && (
          <section>
            <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-brand-navy">
              <h2 className="text-lg sm:text-xl font-heading font-black text-brand-navy uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-5 bg-brand-red rounded-full" />
                <span>{ui.directoryTitle}</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {filteredChannels.length} {ui.streamsLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredChannels.map((channel) => {
                const cYouTubeId = extractYouTubeId(channel.url)
                const isPlaying = channel.id === activeStreamId
                const thumbUrl =
                  channel.thumbnail ||
                  (cYouTubeId && channel.thumbAvailable !== false
                    ? `https://i.ytimg.com/vi/${cYouTubeId}/mqdefault.jpg`
                    : null)

                return (
                  <div
                    key={channel.id}
                    onClick={() => switchChannel(channel.id)}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer group flex flex-col ${isPlaying
                      ? 'border-brand-red ring-2 ring-brand-red/25 shadow-md'
                      : 'border-slate-300 hover:border-brand-navy shadow-xs hover:shadow-md'
                      }`}
                  >
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      <ChannelThumb
                        channel={channel}
                        src={thumbUrl}
                        className="w-full h-full object-fill"
                      />
                      <span className="absolute bottom-2 left-2 bg-brand-red text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{channel.isLive === false ? ui.report : ui.live}</span>
                      </span>
                      {isPlaying && (
                        <div className="absolute inset-0 bg-brand-navy/35 flex items-center justify-center">
                          <span className="bg-brand-red text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow">
                            {ui.nowPlaying}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-red block mb-1">
                          {channel.channelName || siteConfig.brand.shortName}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-navy">
                          {channel.title}
                        </h3>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span className="uppercase">{channel.category || 'news'}</span>
                        <span className="text-brand-navy group-hover:text-brand-red inline-flex items-center gap-1">
                          <Play className="w-3 h-3 fill-current" />
                          <span>{ui.live}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Latest News Videos RSS Library */}
        {newsVideos.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b-2 border-slate-300">
              <h2 className="text-lg sm:text-xl font-heading font-black text-brand-navy uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-5 bg-brand-navy rounded-full" />
                <span>{ui.videosTitle}</span>
              </h2>
              <div className="flex gap-1.5">
                {[
                  ['all', language === 'mr' ? 'सर्व' : language === 'hi' ? 'सभी' : 'All'],
                  ['mr', 'मराठी'],
                  ['hi', 'हिंदी'],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setVideoLang(k)
                      setVideoLimit(8)
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${videoLang === k
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-brand-navy'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleVideos.slice(0, videoLimit).map((v) => {
                const playing = activeStreamId === `vid-${v.videoId}`
                return (
                  <button
                    key={v.videoId}
                    type="button"
                    onClick={() => playNewsVideo(v)}
                    className={`text-left bg-white rounded-2xl overflow-hidden border transition-all group flex flex-col cursor-pointer ${playing
                      ? 'border-brand-red ring-2 ring-brand-red/25 shadow-md'
                      : 'border-slate-300 hover:border-brand-navy shadow-xs hover:shadow-md'
                      }`}
                  >
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                        alt={v.title}
                        loading="lazy"
                        className="w-full h-full object-fill"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors">
                        <span className="w-11 h-11 rounded-full bg-brand-red/95 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </span>
                      </span>
                      {playing && (
                        <span className="absolute top-2 left-2 bg-brand-red text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                          {ui.nowPlaying}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-navy">
                        {v.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-2.5 pt-2 border-t border-slate-100 truncate">
                        {v.channel}
                        {v.published ? ` · ${new Date(v.published).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {visibleVideos.length > videoLimit && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setVideoLimit((n) => n + 8)}
                  className="px-7 py-2.5 rounded-full bg-brand-navy hover:bg-brand-red text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  {ui.loadMore}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
