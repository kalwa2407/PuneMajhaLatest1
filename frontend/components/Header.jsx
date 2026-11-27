'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Newspaper, Shield, LogOut, LogIn, Search, ChevronDown, Briefcase, UserPlus, MapPin, Radio } from 'lucide-react'
import VideoLogo from '@/components/VideoLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { ROLES } from '@/lib/roles'
import { siteConfig, isAllowlistedAdminEmail } from '@/lib/siteConfig'
import { SocialLinksBar } from '@/components/header/SocialIcons'
import SearchModal from '@/components/header/SearchModal'
import PostAdDialog from '@/components/header/PostAdDialog'
import ReporterJoinDialog from '@/components/header/ReporterJoinDialog'
import MobileHeader from '@/components/header/MobileHeader'

const Header = ({ user, currentView, setCurrentView, handleLogout, setSelectedArticle }) => {
  const [mounted, setMounted] = useState(false)
  const [allNewsOpen, setAllNewsOpen] = useState(false)
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false)
  const [reporterDialogOpen, setReporterDialogOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [postAdTab, setPostAdTab] = useState('classified')
  const [businessOnlyMode, setBusinessOnlyMode] = useState(false)

  const { language, changeLanguage, t, languageOptions } = useLanguage()

  const userRoleLower = String(user?.role || '').toLowerCase().trim()
  const isAdminUser =
    !!user &&
    (userRoleLower === 'super_admin' ||
      userRoleLower === 'admin' ||
      userRoleLower === 'superadmin' ||
      isAllowlistedAdminEmail(user?.email))

  useEffect(() => {
    setMounted(true)
  }, [])

  // Global Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Global listener to open Post Your Ad dialog from any button on site
  useEffect(() => {
    const handleOpen = (e) => {
      if (e?.detail?.tab) setPostAdTab(e.detail.tab)
      setBusinessOnlyMode(Boolean(e?.detail?.businessOnly))
      setPromoteDialogOpen(true)
    }
    window.addEventListener('openPostAdModal', handleOpen)
    return () => window.removeEventListener('openPostAdModal', handleOpen)
  }, [])

  const handleSelectArticle = (article) => {
    setSearchModalOpen(false)
    if (setSelectedArticle) setSelectedArticle(article)
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'news-detail', article }, '', `/news/${article.id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setCurrentView('news-detail')
  }

  const handleBrowseAllNews = (query) => {
    setSearchModalOpen(false)
    if (query?.trim()) {
      localStorage.setItem('searchQuery', query.trim())
      window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: query.trim() }))
    }
    setCurrentView('news')
  }

  const handleCategoryClick = (category) => {
    setCurrentView('news')
    localStorage.setItem('selectedCategory', category)
    window.dispatchEvent(new Event('categoryChange'))
    setAllNewsOpen(false)
  }

  const navTabClass = (active) =>
    `text-[13px] font-extrabold tracking-wide px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
      active
        ? 'bg-brand-navy text-white shadow-sm'
        : 'text-gray-700 hover:text-brand-navy hover:bg-blue-50/80'
    }`

  return (
    <>
      {/* --- DESKTOP UTILITY BAR (Navy Dark) --- */}
      <div className="hidden lg:block bg-brand-navy-dark text-white border-b border-white/10">
        <div className="max-w-[1340px] mx-auto px-6 h-9 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-bold text-blue-100">
              <MapPin className="h-3.5 w-3.5 text-brand-red" />
              {siteConfig.contact.shortLocation[language] || siteConfig.contact.shortLocation.en}
            </span>
            <span className="text-white/25">|</span>
            <span className="text-gray-300 font-medium" suppressHydrationWarning>
              {mounted
                ? new Date().toLocaleDateString(
                    language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US',
                    { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }
                  )
                : ''}
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-red/90 text-white px-2.5 py-0.5 rounded-full">
              {siteConfig.brand.motto[language] || siteConfig.brand.tagline}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SocialLinksBar className="scale-90 [&_a]:bg-white/10 [&_a]:text-white/90 [&_a:hover]:text-white" />
            <div className="w-px h-4 bg-white/20" />

            {/* 1-Click Segmented Language Switcher */}
            <div className="inline-flex items-center bg-white/10 rounded-full p-0.5 border border-white/15">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    language === lang.code
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-white/20" />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
                    <Avatar className="h-6 w-6 ring-1 ring-white/40">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="bg-brand-red text-white text-[10px] font-bold">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] font-bold text-white max-w-[110px] truncate">{user.name}</span>
                    <ChevronDown className="h-3 w-3 text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-gray-100">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-bold">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdminUser && (
                    <DropdownMenuItem onClick={() => setCurrentView('admin-dashboard')} className="rounded-lg font-semibold text-brand-navy">
                      <Shield className="mr-2 h-4 w-4 text-brand-red" />Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  {user.role === ROLES.REPORTER && (
                    <DropdownMenuItem onClick={() => setCurrentView('reporter-dashboard')} className="rounded-lg">
                      <Newspaper className="mr-2 h-4 w-4" />{t('reporterDashboard')}
                    </DropdownMenuItem>
                  )}
                  {user.role === ROLES.ADVERTISER && (
                    <DropdownMenuItem onClick={() => setCurrentView('advertiser-dashboard')} className="rounded-lg">
                      <Briefcase className="mr-2 h-4 w-4" />Advertiser Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-brand-red focus:text-brand-red rounded-lg">
                    <LogOut className="mr-2 h-4 w-4" />{t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="inline-flex items-center gap-1.5 font-bold text-white hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-brand-red" />
                <span>{t('login') || 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- DESKTOP BROADSHEET MASTHEAD --- */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-[1340px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Left Quick Action */}
          <div className="flex items-center gap-2.5 min-w-[210px]">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-gray-700 font-semibold text-xs px-3.5 py-2 rounded-full border border-gray-200 transition-colors cursor-pointer"
              title="Search published articles (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-brand-navy" />
              <span>{t('search') || 'Search'}</span>
              <kbd className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('live-tv')}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-brand-red text-brand-red hover:text-white font-black text-[11px] uppercase tracking-wider px-3 py-2 rounded-full border border-red-200/80 transition-all cursor-pointer"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>24x7</span>
            </button>
          </div>

          {/* Center Editorial Masthead */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="h-[62px] w-[62px] rounded-2xl border-2 border-brand-navy/15 bg-white shadow-sm p-0.5 flex items-center justify-center overflow-hidden">
              <VideoLogo className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[28px] xl:text-[32px] font-black tracking-tight text-brand-navy">
                {siteConfig.brand.localizedName[language] || siteConfig.brand.name}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-0.5 w-6 bg-brand-red rounded-full" />
                <span className="text-[10px] font-black tracking-[0.2em] text-brand-red uppercase">
                  {siteConfig.brand.tagline}
                </span>
                <span className="h-0.5 w-6 bg-brand-navy rounded-full" />
              </div>
            </div>
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-2 min-w-[210px] justify-end">
            <PostAdDialog
              open={promoteDialogOpen}
              onOpenChange={setPromoteDialogOpen}
              postAdTab={postAdTab}
              setPostAdTab={setPostAdTab}
              businessOnlyMode={businessOnlyMode}
              setBusinessOnlyMode={setBusinessOnlyMode}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setBusinessOnlyMode(false)
                    setPostAdTab('business')
                  }}
                  className="border-brand-navy/25 text-brand-navy hover:bg-brand-navy hover:text-white font-bold text-xs rounded-full px-4 h-9 transition-all"
                >
                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-brand-red" />
                  {t('promoteYourBusiness')}
                </Button>
              }
            />

            <ReporterJoinDialog
              open={reporterDialogOpen}
              onOpenChange={setReporterDialogOpen}
              trigger={
                <Button
                  type="button"
                  size="sm"
                  className="bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-full px-4 h-9 shadow-sm transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  {t('joinAsReporter')}
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* --- DESKTOP STICKY CLEAN NAVIGATION BAR --- */}
      <header className="hidden lg:block bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b-2 border-brand-navy shadow-sm">
        <div className="max-w-[1340px] mx-auto px-6">
          <nav className="flex items-center justify-between h-12">
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentView('home')} className={navTabClass(currentView === 'home')}>
                {t('home')}
              </button>

              <DropdownMenu open={allNewsOpen} onOpenChange={setAllNewsOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={navTabClass(currentView === 'news')}>
                    {t('news')}<ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-xl shadow-xl border-gray-100 mt-1">
                  <DropdownMenuItem onClick={() => { setCurrentView('news'); localStorage.removeItem('selectedCategory'); setAllNewsOpen(false) }} className="rounded-lg">{t('allNews')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCategoryClick('crime')} className="rounded-lg">{t('crime')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryClick('politics')} className="rounded-lg">{t('politics')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryClick('education')} className="rounded-lg">{t('education')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryClick('sports')} className="rounded-lg">{t('sports')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryClick('entertainment')} className="rounded-lg">{t('entertainment')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryClick('trending')} className="rounded-lg">{t('trending')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={() => setCurrentView('city')} className={navTabClass(currentView === 'city')}>{t('cityNews')}</button>
              <button onClick={() => setCurrentView('enewspaper')} className={navTabClass(currentView === 'enewspaper')}>{t('eNewspaper')}</button>
              <button onClick={() => setCurrentView('shorts')} className={navTabClass(currentView === 'shorts')}>{t('shorts') || 'Shorts'}</button>
              <button onClick={() => setCurrentView('businesses')} className={navTabClass(currentView === 'businesses')}>{t('businessDirectory')}</button>
              <button onClick={() => setCurrentView('classifieds')} className={navTabClass(currentView === 'classifieds')}>{t('classified')}</button>
            </div>

            <button
              onClick={() => setCurrentView('live-tv')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                currentView === 'live-tv'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {t('liveTv') || 'Live TV'}
            </button>
          </nav>
        </div>
      </header>

      {/* --- MOBILE HEADER --- */}
      <MobileHeader
        user={user}
        isAdminUser={isAdminUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenPromote={() => {
          setBusinessOnlyMode(false)
          setPostAdTab('business')
          setPromoteDialogOpen(true)
        }}
        onOpenReporter={() => setReporterDialogOpen(true)}
      />

      {/* --- GLOBAL SEARCH MODAL --- */}
      <SearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onSelectArticle={handleSelectArticle}
        onBrowseAll={handleBrowseAllNews}
      />
    </>
  )
}

export default Header
