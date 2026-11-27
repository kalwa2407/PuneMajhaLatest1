'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Newspaper, Shield, LogOut, LogIn, Search, ChevronDown, Briefcase, UserPlus, Globe } from 'lucide-react'
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
    `relative text-[13px] font-semibold tracking-wide px-4 h-full flex items-center text-white/95 hover:text-white transition-all duration-200 ${
      active
        ? 'after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:bg-brand-red after:rounded-full'
        : 'hover:after:absolute hover:after:bottom-0 hover:after:left-2 hover:after:right-2 hover:after:h-[2px] hover:after:bg-white/40 hover:after:rounded-full'
    }`

  return (
    <>
      {/* --- DESKTOP TOP BRAND BAR --- */}
      <div className="hidden lg:block relative">
        <div className="h-[3px] bg-gradient-to-r from-brand-navy via-brand-red to-brand-navy" />

        <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' }}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-2.5">
              {/* LEFT: Logo + Brand Wordmark + Date */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
                  <div className="flex-shrink-0 h-[66px] w-[66px] relative overflow-hidden flex items-center justify-center rounded-full ring-2 ring-brand-navy/10 shadow-sm bg-white p-0.5">
                    <VideoLogo className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[20px] font-black tracking-tight text-brand-navy">
                      {siteConfig.brand.localizedName[language] || siteConfig.brand.name}
                    </span>
                    <span className="text-[11px] font-extrabold tracking-wider text-brand-red uppercase mt-1">
                      {siteConfig.brand.motto[language] || siteConfig.brand.tagline}
                    </span>
                  </div>
                </div>

                {/* Date display */}
                <div className="hidden xl:flex flex-col pl-4 border-l border-gray-200 min-w-[140px]" suppressHydrationWarning>
                  {mounted ? (
                    <>
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider" suppressHydrationWarning>
                        {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', { weekday: 'long' })}
                      </span>
                      <span className="text-[13px] font-bold text-gray-700 tracking-tight" suppressHydrationWarning>
                        {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </>
                  ) : (
                    <div className="h-8 w-28 bg-gray-50/50 rounded" />
                  )}
                </div>
              </div>

              {/* RIGHT: Social Media, Language & Account */}
              <div className="flex items-center gap-4">
                <SocialLinksBar />

                <div className="w-px h-8 bg-gray-200" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="font-semibold tracking-tight text-gray-700 hover:bg-blue-50/60 hover:text-brand-navy rounded-full px-3">
                      <Globe className="h-4 w-4 mr-1.5 text-brand-navy" />
                      {languageOptions.find((l) => l.code === language)?.label || 'हिं'}
                      <ChevronDown className="h-3 w-3 ml-1 opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-gray-100">
                    {languageOptions.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center justify-between rounded-lg ${language === lang.code ? 'bg-blue-50 font-bold text-brand-navy' : ''}`}
                      >
                        <span>{lang.fullName}</span>
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {user ? (
                  <>
                    <div className="w-px h-8 bg-gray-200" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                          <Avatar className="h-9 w-9 ring-2 ring-brand-navy/15">
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback className="bg-brand-navy text-white text-xs font-bold">{user.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-gray-700">{user.name}</span>
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
                  </>
                ) : (
                  <>
                    <div className="w-px h-8 bg-gray-200" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentView('login')}
                      className="border-gray-200 text-brand-navy hover:text-brand-red hover:border-blue-200 hover:bg-blue-50/70 rounded-full font-semibold px-4 h-9 shadow-sm"
                    >
                      <LogIn className="h-4 w-4 mr-1.5 text-brand-red" /> {t('login') || 'Login'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </div>

      {/* --- DESKTOP STICKY NAVY NAVIGATION BAR --- */}
      <header className="hidden lg:block bg-brand-navy/95 backdrop-blur-xl backdrop-saturate-150 sticky top-0 z-50 border-b border-brand-navy-dark shadow-md">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-12">
            <div className="flex items-center h-full">
              <button onClick={() => setCurrentView('home')} className={navTabClass(currentView === 'home')}>
                {t('home')}
              </button>
              <div className="w-px h-4 bg-white/15" />

              <DropdownMenu open={allNewsOpen} onOpenChange={setAllNewsOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={`${navTabClass(currentView === 'news')} gap-1`}>
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
              <div className="w-px h-4 bg-white/15" />

              <button onClick={() => setCurrentView('enewspaper')} className={navTabClass(currentView === 'enewspaper')}>{t('eNewspaper')}</button>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={() => setCurrentView('city')} className={navTabClass(currentView === 'city')}>{t('cityNews')}</button>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={() => setCurrentView('shorts')} className={navTabClass(currentView === 'shorts')}>{t('shorts') || 'Shorts'}</button>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={() => setCurrentView('classifieds')} className={navTabClass(currentView === 'classifieds')}>{t('classified')}</button>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={() => setCurrentView('businesses')} className={navTabClass(currentView === 'businesses')}>{t('businessDirectory')}</button>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={() => setCurrentView('live-tv')} className={`${navTabClass(currentView === 'live-tv')} gap-2`}>
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse ring-2 ring-white/40" />
                {t('liveTv') || 'Live TV'}
              </button>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 shadow-sm cursor-pointer"
                title="Search published articles"
              >
                <Search className="h-3.5 w-3.5 text-white" />
                <span>{t('search') || 'Search'}</span>
              </button>

              <PostAdDialog
                open={promoteDialogOpen}
                onOpenChange={setPromoteDialogOpen}
                postAdTab={postAdTab}
                setPostAdTab={setPostAdTab}
                businessOnlyMode={businessOnlyMode}
                setBusinessOnlyMode={setBusinessOnlyMode}
                trigger={
                  <button
                    onClick={() => {
                      setBusinessOnlyMode(false)
                      setPostAdTab('business')
                    }}
                    className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-brand-navy font-bold text-[12px] px-3.5 py-1.5 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-brand-red" />
                    {t('promoteYourBusiness')}
                  </button>
                }
              />

              <ReporterJoinDialog
                open={reporterDialogOpen}
                onOpenChange={setReporterDialogOpen}
                trigger={
                  <button className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-[12px] px-3.5 py-1.5 rounded-full shadow-sm transition-all duration-200 hover:shadow-md">
                    <UserPlus className="h-3.5 w-3.5" />
                    {t('joinAsReporter')}
                  </button>
                }
              />
            </div>
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
