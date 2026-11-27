'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Menu, X, Home, Newspaper, Building2, FileText, Tag, Shield, LogOut, LogIn, Search, Briefcase, UserPlus, MapPin, Zap } from 'lucide-react'
import VideoLogo from '@/components/VideoLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { ROLES } from '@/lib/roles'
import { siteConfig } from '@/lib/siteConfig'

export default function MobileHeader({
  user,
  isAdminUser,
  currentView,
  setCurrentView,
  handleLogout,
  onOpenSearch,
  onOpenPromote,
  onOpenReporter,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, changeLanguage, t, languageOptions } = useLanguage()

  const navItems = [
    { view: 'home', label: t('home') },
    { view: 'news', label: t('news') },
    { view: 'city', label: t('cityNews') },
    { view: 'enewspaper', label: t('eNewspaper') },
    { view: 'shorts', label: t('shorts') || 'Shorts' },
    { view: 'businesses', label: t('businessDirectory') },
    { view: 'classifieds', label: t('classified') },
  ]

  return (
    <div className="lg:hidden w-full max-w-full overflow-hidden">
      {/* Top Crisp White Editorial Bar with Navy Top Accent */}
      <div className="bg-white border-t-[3px] border-t-brand-navy border-b border-gray-200 flex items-center justify-between px-3.5 h-16 sticky top-0 z-50 w-full max-w-full shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-1 hover:bg-blue-50 text-brand-navy rounded-xl transition-colors active:scale-95 shrink-0"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer min-w-0" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl border border-brand-navy/15 bg-white p-0.5 shrink-0 overflow-hidden shadow-xs">
              <VideoLogo className="w-full h-full" />
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-serif text-[16px] font-black tracking-tight text-brand-navy truncate">
                {siteConfig.brand.localizedName[language] || siteConfig.brand.shortName}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-red truncate mt-0.5">
                {siteConfig.brand.tagline}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Search news"
          >
            <Search className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[10px] font-black px-2.5 h-8 flex items-center justify-center rounded-full bg-brand-navy text-white shadow-sm">
                {language.toUpperCase()}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languageOptions.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navy Scrolling Category Strip */}
      <div className="bg-brand-navy text-white overflow-x-auto scrollbar-hide sticky top-16 z-40 w-full max-w-full border-b border-brand-navy-dark shadow-sm">
        <div className="flex items-center px-3 py-1.5 space-x-2 whitespace-nowrap">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`text-[12px] font-bold px-3 py-1 rounded-full transition-all ${
                currentView === item.view
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-blue-100/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentView('live-tv')}
            className={`text-[12px] font-black px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              currentView === 'live-tv'
                ? 'bg-white text-brand-red'
                : 'bg-brand-red/20 text-red-200 border border-red-400/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            {t('liveTv') || 'Live TV'}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-white w-[280px] h-full shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center rounded-lg border border-gray-200 bg-white">
                  <VideoLogo className="w-full h-full" />
                </div>
                <span className="font-bold text-base text-brand-navy">
                  {siteConfig.brand.shortName}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'mr' ? 'मुख्य' : language === 'hi' ? 'मुख्य' : 'Main'}
              </div>
              <Button variant="ghost" className="justify-start text-base font-semibold h-12 hover:bg-blue-50 hover:text-brand-navy text-brand-navy" onClick={() => { setMobileMenuOpen(false); onOpenSearch() }}>
                <Search className="mr-3 h-5 w-5 text-brand-red" />{t('searchNews') || (language === 'mr' ? 'बातम्या शोधा' : language === 'hi' ? 'समाचार खोजें' : 'Search News')}
              </Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('home'); setMobileMenuOpen(false) }}><Home className="mr-3 h-5 w-5" />{t('home')}</Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('news'); setMobileMenuOpen(false) }}><Newspaper className="mr-3 h-5 w-5" />{t('news')}</Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('enewspaper'); setMobileMenuOpen(false) }}><FileText className="mr-3 h-5 w-5" />{t('eNewspaper')}</Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('city'); setMobileMenuOpen(false) }}><MapPin className="mr-3 h-5 w-5" />{t('cityNews')}</Button>
              <Button variant="ghost" className="w-full justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('shorts'); setMobileMenuOpen(false) }}>
                <Zap className="mr-3 h-5 w-5" />{t('shorts') || 'Shorts'}
              </Button>

              <div className="my-2 border-t border-gray-100" />
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'mr' ? 'सेवा' : language === 'hi' ? 'सेवाएं' : 'Services'}
              </div>

              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('classifieds'); setMobileMenuOpen(false) }}><Tag className="mr-3 h-5 w-5" />{t('classified')}</Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-blue-50 hover:text-brand-navy" onClick={() => { setCurrentView('businesses'); setMobileMenuOpen(false) }}><Building2 className="mr-3 h-5 w-5" />{t('businessDirectory')}</Button>
              <Button variant="ghost" className="justify-start text-base font-medium h-12 hover:bg-red-50 hover:text-brand-red" onClick={() => { setCurrentView('live-tv'); setMobileMenuOpen(false) }}>
                <span className="mr-3 flex items-center justify-center h-5 w-5"><span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" /></span>{t('liveTv') || 'Live TV'}
              </Button>

              <div className="my-2" />
              <Button className="w-full bg-brand-navy hover:bg-brand-navy-dark text-white justify-center" onClick={() => { onOpenPromote(); setMobileMenuOpen(false) }}>
                <Briefcase className="mr-2 h-4 w-4" />{t('promoteYourBusiness')}
              </Button>
              <Button className="w-full bg-brand-red hover:bg-brand-red-dark text-white justify-center mt-2" onClick={() => { onOpenReporter(); setMobileMenuOpen(false) }}>
                <UserPlus className="mr-2 h-4 w-4" />{t('joinAsReporter')}
              </Button>

              <div className="my-2 border-t border-gray-100" />

              {user ? (
                <div className="px-2 py-2 bg-gray-50 rounded-lg mx-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10"><AvatarImage src={user.profileImage} /><AvatarFallback className="bg-blue-100 text-brand-navy">{user.name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</p>
                    </div>
                  </div>
                  {isAdminUser && (
                    <Button variant="default" size="sm" className="w-full justify-center bg-brand-navy hover:bg-brand-navy-dark text-white mb-2" onClick={() => { setCurrentView('admin-dashboard'); setMobileMenuOpen(false) }}>
                      <Shield className="mr-2 h-4 w-4 text-brand-red" /> Admin Dashboard
                    </Button>
                  )}
                  {user.role === ROLES.REPORTER && (
                    <Button variant="default" size="sm" className="w-full justify-center bg-brand-red hover:bg-brand-red-dark text-white mb-2" onClick={() => { setCurrentView('reporter-dashboard'); setMobileMenuOpen(false) }}>
                      <Newspaper className="mr-2 h-4 w-4" /> {t('reporterDashboard') || 'Reporter Dashboard'}
                    </Button>
                  )}
                  {user.role === ROLES.ADVERTISER && (
                    <Button variant="default" size="sm" className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white mb-2" onClick={() => { setCurrentView('advertiser-dashboard'); setMobileMenuOpen(false) }}>
                      <Briefcase className="mr-2 h-4 w-4" /> Advertiser Dashboard
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="w-full justify-center text-brand-red border-red-200 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />{t('logout')}
                  </Button>
                </div>
              ) : (
                <div className="px-2 mx-2">
                  <Button variant="outline" size="sm" className="w-full justify-center border-blue-200 text-brand-navy hover:bg-blue-50 font-bold h-10 rounded-xl" onClick={() => { setCurrentView('login'); setMobileMenuOpen(false) }}>
                    <LogIn className="mr-2 h-4 w-4" /> {language === 'mr' ? 'लॉगिन / रिपोर्टर लॉगिन' : language === 'hi' ? 'लॉगिन / रिपोर्टर लॉगिन' : 'Login / Reporter Login'}
                  </Button>
                </div>
              )}

              <div className="my-4 px-2">
                <p className="text-xs text-center text-gray-400 mb-2">{t('language')}</p>
                <div className="flex justify-center gap-2">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${language === lang.code ? 'bg-brand-navy border-brand-navy text-white' : 'bg-white border-gray-300 text-gray-600'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
