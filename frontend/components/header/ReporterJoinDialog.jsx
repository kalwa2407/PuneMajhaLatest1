'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { siteConfig, getReporterWhatsAppVerificationUrl } from '@/lib/siteConfig'

export default function ReporterJoinDialog({ open, onOpenChange, trigger }) {
  const { language, t } = useLanguage()
  const { toast } = useToast()
  const [reporterForm, setReporterForm] = useState({
    name: '', phone: '', email: '', experience: '', portfolio: '', message: '',
  })
  const [submittingReporter, setSubmittingReporter] = useState(false)
  const [reporterSubmitted, setReporterSubmitted] = useState(false)

  const handleOpenChange = (isOpen) => {
    onOpenChange(isOpen)
    if (!isOpen) setReporterSubmitted(false)
  }

  const handleReporterSubmit = async (e) => {
    e.preventDefault()
    if (!reporterForm.name || !reporterForm.phone || !reporterForm.email) {
      alert('Please fill in all required fields.')
      return
    }
    setSubmittingReporter(true)
    try {
      const res = await fetch('/api/reporter-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: reporterForm.name,
          phone: reporterForm.phone,
          email: reporterForm.email,
          experience: reporterForm.experience,
          portfolio: reporterForm.portfolio,
          reason: reporterForm.message,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setReporterSubmitted(true)
        setReporterForm({ name: '', phone: '', email: '', experience: '', portfolio: '', message: '' })
      } else {
        alert(data.error || 'Failed to submit application. Please try again.')
      }
    } catch (err) {
      console.error('Reporter application error:', err)
      alert('Something went wrong. Please try again later.')
    } finally {
      setSubmittingReporter(false)
    }
  }

  const formUrl = siteConfig.forms.reporterGoogleFormUrl

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('joinAsReporter')}</DialogTitle>
          <DialogDescription>{t('reportJoinDesc')}</DialogDescription>
        </DialogHeader>
        {reporterSubmitted ? (
          <div className="py-5 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Application Received!</h3>
              <p className="text-sm text-gray-600">
                Thank you! Your details have been submitted to our editorial desk.
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Step 2: Complete Verification
              </p>
              <p className="text-xs text-gray-600">
                {formUrl
                  ? 'Complete your Reporter KYC & ID verification Google Form to speed up your Press ID approval.'
                  : 'Message our editorial desk on WhatsApp to complete your Reporter KYC & Press ID verification.'}
              </p>
              {formUrl ? (
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open Verification Google Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href={getReporterWhatsAppVerificationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Complete Verification on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
                {t('close') || 'Close'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleOpenChange(false)
                  toast({
                    title: 'Application Submitted!',
                    description: 'Our team will contact you soon.',
                  })
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                Done ✓
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReporterSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reporterName">{language === 'mr' ? 'पूर्ण नाव *' : language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</Label>
                <Input id="reporterName" value={reporterForm.name} onChange={(e) => setReporterForm({ ...reporterForm, name: e.target.value })} placeholder={language === 'mr' ? 'तुमचे पूर्ण नाव प्रविष्ट करा' : language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reporterPhone">{language === 'mr' ? 'फोन *' : language === 'hi' ? 'फ़ोन *' : 'Phone *'}</Label>
                  <Input id="reporterPhone" type="tel" value={reporterForm.phone} onChange={(e) => setReporterForm({ ...reporterForm, phone: e.target.value })} placeholder="+91 XXXXX" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reporterEmail">{language === 'mr' ? 'ईमेल *' : language === 'hi' ? 'ईमेल *' : 'Email *'}</Label>
                  <Input id="reporterEmail" type="email" value={reporterForm.email} onChange={(e) => setReporterForm({ ...reporterForm, email: e.target.value })} placeholder="email@example.com" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">{language === 'mr' ? 'अनुभव (वर्षे)' : language === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'}</Label>
                <Input id="experience" value={reporterForm.experience} onChange={(e) => setReporterForm({ ...reporterForm, experience: e.target.value })} placeholder={language === 'mr' ? 'उदा., पत्रकारितेत २ वर्षे' : language === 'hi' ? 'उदा., पत्रकारिता में 2 वर्ष' : 'e.g., 2 years in journalism'} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="portfolio">{language === 'mr' ? 'पोर्टफोलिओ/सोशल मीडिया लिंक' : language === 'hi' ? 'पोर्टफोलियो/सोशल मीडिया लिंक' : 'Portfolio/Social Media Link'}</Label>
                <Input id="portfolio" value={reporterForm.portfolio} onChange={(e) => setReporterForm({ ...reporterForm, portfolio: e.target.value })} placeholder="https://your-portfolio.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reporterMessage">{language === 'mr' ? 'तुम्हाला सामील का व्हायचे आहे?' : language === 'hi' ? 'आप क्यों जुड़ना चाहते हैं?' : 'Why do you want to join?'}</Label>
                <Textarea id="reporterMessage" value={reporterForm.message} onChange={(e) => setReporterForm({ ...reporterForm, message: e.target.value })} placeholder={language === 'mr' ? 'तुमच्याबद्दल थोडी माहिती द्या...' : language === 'hi' ? 'अपने बारे में बताएं...' : 'Tell us about yourself...'} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submittingReporter}>{t('cancel') || 'Cancel'}</Button>
              <Button type="submit" className="bg-brand-red hover:bg-brand-red-dark" disabled={submittingReporter}>
                {submittingReporter ? t('pleaseWait') : t('submitApplication')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
