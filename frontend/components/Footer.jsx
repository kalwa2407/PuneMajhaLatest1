'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/lib/siteConfig'
import { FacebookIcon, WhatsAppIcon, InstagramIcon, YouTubeIcon, TwitterIcon } from '@/components/header/SocialIcons'

const Footer = ({ setCurrentView }) => {
  const { t, language } = useLanguage()
  const brandTitle = siteConfig.brand.localizedName[language] || siteConfig.brand.name
  const addressText = siteConfig.contact.address[language] || siteConfig.contact.address.en
  const creditText = siteConfig.brand.credit[language] || siteConfig.brand.credit.en

  const socialItems = [
    { href: siteConfig.social.facebook, label: 'Facebook', hover: 'hover:bg-[#1877F2]', icon: <FacebookIcon className="w-4 h-4" /> },
    { href: siteConfig.social.whatsapp, label: 'WhatsApp', hover: 'hover:bg-[#25D366]', icon: <WhatsAppIcon className="w-4 h-4" /> },
    { href: siteConfig.social.instagram, label: 'Instagram', hover: 'hover:bg-[#E4405F]', icon: <InstagramIcon className="w-4 h-4" /> },
    { href: siteConfig.social.youtube, label: 'YouTube', hover: 'hover:bg-brand-red', icon: <YouTubeIcon className="w-4 h-4" /> },
    { href: siteConfig.social.twitter, label: 'X', hover: 'hover:bg-black', icon: <TwitterIcon className="w-4 h-4" /> },
  ].filter((item) => Boolean(item.href))

  return (
    <footer className="bg-[#0b1128] text-gray-300 mt-12 border-t-4 border-brand-red">
      <div className="container mx-auto px-5 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={siteConfig.assets.logo} alt={siteConfig.brand.name} className="w-11 h-11 rounded-full bg-white p-0.5 object-contain shrink-0" />
              <div>
                <h3 className="font-black text-lg text-white leading-tight">{brandTitle}</h3>
                <p className="text-[11px] font-bold text-red-400 tracking-wide">{siteConfig.brand.motto[language] || siteConfig.brand.tagline}</p>
              </div>
            </div>
            <p className="text-sm mb-4 text-gray-400 leading-relaxed">{t('footerAbout')}</p>
            <div className="flex gap-2.5">
              {socialItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-gray-200 ${item.hover} transition-colors`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">{t('home')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('cityNews')}</button></li>
              <li><button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">{t('aboutUs')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('politics')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('sports')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('entertainment')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('categories')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('crime')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('education')}</button></li>
              <li><button onClick={() => setCurrentView('classifieds')} className="hover:text-white transition-colors">{t('jobs')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('trending')}</button></li>
              <li><button onClick={() => setCurrentView('news')} className="hover:text-white transition-colors">{t('specialReports')}</button></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-white mb-4">{t('contactUs')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span className="text-gray-300 leading-snug">{addressText}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="flex flex-wrap gap-x-2">
                  <a href={siteConfig.contact.phoneHref} className="hover:text-white transition-colors">{siteConfig.contact.phoneDisplay}</a>
                  <span className="text-gray-600">/</span>
                  <a href={siteConfig.contact.secondaryPhoneHref} className="hover:text-white transition-colors">{siteConfig.contact.secondaryPhoneDisplay}</a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors break-all">{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} {siteConfig.brand.copyright}. {t('allRightsReserved')}.</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <button onClick={() => setCurrentView('terms')} className="text-gray-400 hover:text-white transition-colors">{t('termsConditions')}</button>
            <span className="text-gray-600">|</span>
            <button onClick={() => setCurrentView('privacy')} className="text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</button>
            <span className="text-gray-600">|</span>
            <button onClick={() => setCurrentView('about')} className="text-gray-400 hover:text-white transition-colors">{t('aboutUs')}</button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">{creditText}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
