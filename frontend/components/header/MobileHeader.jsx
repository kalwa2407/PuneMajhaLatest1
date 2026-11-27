'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Menu, X, Home, Newspaper, Building2, FileText, Tag, Shield, LogOut, LogIn, Search, Briefcase, UserPlus, MapPin, Zap } from 'lucide-react'
import VideoLogo from '@/components/VideoLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { ROLES } from '@/lib/roles'

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
    { view: 'enewspaper', label: t('eNewspaper') },
    { view: 'city', label: t('cityNews') },
    { view: 'shorts', label: t('shorts') || 'Shorts' },
    { view: 'classifieds', label: t('classified') },
    { view: 'businesses', label: t('businessDirectory') },
  ]

  return (
    <div className="lg:hidden w-full max-w-full overflow-hidden">
      {/* Top Navy Brand Bar */}
      <div
        className="text-white flex items-center justify-between px-4 h-16 sticky top-0 z-50 relative overflow-hidden w-full max-w-full shadow-[0_3px_14px_rgba(19,27,77,0.38)]"
        style={{ background: 'linear-gradient(180deg, #27368A 0%, #1E296B 60%, #131B4D 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(130px 64px at 50% 50%, rgba(255,255,255,0.22), transparent 72%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent pointer-events-none" />

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 relative z-10" aria-label="Menu">
          <Menu className="h-6 w-6 text-white" />
        </button>

        {/* Center Logo Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10" onClick={() => setCurrentView('home')}>
          <VideoLogo className="w-[52px] h-[52px] rounded-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.32)] active:scale-95 transition-transform duration-150" />
        </div>

        <div className="flex items-center gap-1 relative z-10">
          <button
            onClick={onOpenSearch}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Search news"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-full bg-white text-brand-navy ml-1 shadow-sm">
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

      {/* Scrolling Category Bar */}
      <div className="bg-white/90 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06] overflow-x-auto scrollbar-hide py-0.5 sticky top-16 z-40 w-full max-w-full">
        <div className="flex items-center px-4 space-x-6 whitespace-nowrap">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`text-[13px] font-extrabold pb-2.5 pt-2 border-b-2 transition-all ${
                currentView === item.view ? 'text-brand-navy border-brand-red' : 'text-gray-500 border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentView('live-tv')}
            className={`text-[13px] font-extrabold pb-2.5 pt-2 border-b-2 transition-all flex items-center gap-1.5 ${
              currentView === 'live-tv' ? 'text-brand-red border-brand-red' : 'text-gray-500 border-transparent'
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
              <div className="w-12 h-12 rounded-full relative overflow-hidden flex items-center justify-center">
                <VideoLogo className="w-full h-full" />
              </div>
              <span className="font-bold text-lg text-brand-navy absolute left-1/2 -translate-x-1/2">
                {t('menu') || (language === 'mr' ? 'मेनू' : language === 'hi' ? 'मेनू' : 'Menu')}
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
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
