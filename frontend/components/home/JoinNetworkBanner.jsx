'use client'

import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/lib/siteConfig'

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export function JoinNetworkBanner({ onOpenModal }) {
  const { t, language } = useLanguage()
  return (
    <>
      {/* StarNews v1 Dark Gradient Reporter Network (Mobile) */}
      <section className="lg:hidden w-full my-8 px-4">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1128] via-[#162152] to-[#0b1128] border border-blue-400/20 shadow-[0_20px_50px_rgba(30,41,107,0.28)] p-6 sm:p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-navy-light/25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col justify-between gap-7">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-red text-white font-black text-[10px] uppercase tracking-widest shadow-md">
                  {siteConfig.brand.shortName.toUpperCase()} JOURNALISM NETWORK
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 font-semibold text-[11px] backdrop-blur-sm border border-white/10">
                  Official Stringer &amp; Citizen Program
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {language === 'mr' ? 'अधिकृत ग्राउंड रिपोर्टर व्हा' : language === 'hi' ? 'अधिकृत ग्राउंड रिपोर्टर बनें' : 'Become a Verified Ground Reporter'} • <span className="text-red-400">{language === 'mr' ? 'तुमच्या शहराचा आवाज' : language === 'hi' ? 'अपने शहर की आवाज़' : 'Voice of Your City'}</span>
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {language === 'mr'
                  ? 'पुणे आणि महाराष्ट्रातील वाचकांपर्यंत ताज्या घडामोडी, जनतेचे प्रश्न आणि स्थानिक बातम्या थेट पोहोचवा. अधिकृत ओळखपत्र आणि सन्मान मिळवा.'
                  : language === 'hi'
                  ? 'पुणे और महाराष्ट्र के पाठकों तक ताज़ा खबरें, जनहित मुद्दे और स्थानीय समाचार सीधे पहुँचाएँ। अधिकृत प्रेस पहचान और प्रोत्साहन प्राप्त करें।'
                  : 'Report breaking developments, public issues, and community stories directly to readers across Pune and Maharashtra. Get official accreditation, press identity, and performance incentives.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 backdrop-blur-sm">
                  <span className="text-lg">🛡️</span>
                  <span className="text-white text-xs font-bold leading-tight">Digital Press ID</span>
                  <span className="text-gray-400 text-[10px]">Verified QR credential</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 backdrop-blur-sm">
                  <span className="text-lg">⚡</span>
                  <span className="text-white text-xs font-bold leading-tight">Instant CMS</span>
                  <span className="text-gray-400 text-[10px]">Direct byline publishing</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 backdrop-blur-sm">
                  <span className="text-lg">💰</span>
                  <span className="text-white text-xs font-bold leading-tight">Monthly Honors</span>
                  <span className="text-gray-400 text-[10px]">Performance rewards</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-1 backdrop-blur-sm">
                  <span className="text-lg">📍</span>
                  <span className="text-white text-xs font-bold leading-tight">36 Districts</span>
                  <span className="text-gray-400 text-[10px]">Pan-Maharashtra reach</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onOpenModal}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-red to-rose-600 hover:from-brand-red-dark hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <span>{t('submitApplication') || 'Apply as Ground Reporter'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => window.open('/reporter', '_self')}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>{t('login') || 'Already a Reporter? Login'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Broadsheet Reporter Network (Desktop) */}
      <section className="hidden lg:block w-full my-8 px-4 lg:px-6 max-w-[1340px] mx-auto">
      <div className="bg-white border border-slate-300 border-l-4 border-l-brand-red rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-red block">
            {siteConfig.brand.shortName.toUpperCase()} NETWORK
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy leading-tight">
            {t('joinAsReporter') || 'Join as Reporter'}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {language === 'hi'
              ? 'पुणे और महाराष्ट्र से स्थानीय ख़बरें व ग्राउंड रिपोर्ट भेजें — आधिकारिक प्रेस पहचान और सीधा पब्लिशिंग डैशबोर्ड पाएं।'
              : language === 'mr'
                ? 'पुणे आणि महाराष्ट्रातील स्थानिक बातम्या व ग्राउंड रिपोर्ट पाठवा — अधिकृत ओळख आणि थेट प्रकाशन डॅशबोर्ड मिळवा.'
                : 'Report civic news and ground updates from Pune & Maharashtra with verified accreditation and direct newsroom publishing.'}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-red text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t('submitApplication') || 'Apply Now'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.open('/reporter', '_self')}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-navy border border-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>{t('login') || 'Reporter Login'}</span>
          </button>
        </div>
      </div>
    </section>
    </>
  )
}

export function FloatingWhatsAppButton() {
  const { t } = useLanguage()
  return (
    <a
      href={siteConfig.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group active:scale-90 transition-transform hidden lg:block"
    >
      <div className="absolute right-16 bg-white text-gray-900 text-[10px] font-black px-4 py-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block border border-slate-200 italic">
        {t('needHelpChat') || 'Need help? Chat with us'}
      </div>
      <div className="bg-[#25D366] p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center">
        <WhatsAppIcon className="w-7 h-7 text-white fill-current" />
      </div>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red border-2 border-white rounded-full animate-ping opacity-75" />
    </a>
  )
}
