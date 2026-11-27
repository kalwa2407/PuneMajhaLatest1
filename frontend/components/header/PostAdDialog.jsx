'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Briefcase, Tag, Upload, X, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { compressImageFile } from '@/lib/imageCompress'
import { siteConfig } from '@/lib/siteConfig'

const CLASSIFIED_CATEGORIES = [
  'IT Jobs', 'Real Estate', 'Vehicles', 'Electronics', 'Furniture', 'Fashion', 'Services', 'Other',
]

const BUSINESS_CATEGORIES = [
  'Restaurant', 'Cafe', 'Electronics', 'Fashion', 'Healthcare', 'Education',
  'Fitness', 'Beauty & Spa', 'Real Estate', 'Automotive', 'Services', 'Other',
]

const MAX_BUSINESS_GALLERY = 6

const FormStep = ({ n, done, label }) => (
  <div className="flex items-center gap-2.5 pt-2 first:pt-0">
    <span className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center transition-colors duration-200 ${done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
      {done ? '✓' : n}
    </span>
    <span className="text-[13px] font-bold text-gray-900">{label}</span>
    <span className="flex-1 h-px bg-gray-100" />
  </div>
)

export default function PostAdDialog({ open, onOpenChange, postAdTab, setPostAdTab, businessOnlyMode, setBusinessOnlyMode, trigger }) {
  const { language, t } = useLanguage()

  const [classifiedForm, setClassifiedForm] = useState({
    title: '', category: 'Other', price: '', phone: '', location: '', description: '', images: [],
  })
  const [classifiedPreviews, setClassifiedPreviews] = useState([])
  const [submittingClassified, setSubmittingClassified] = useState(false)
  const classifiedFileInputRef = useRef(null)

  const [businessForm, setBusinessForm] = useState({
    businessName: '', ownerName: '', category: 'Services', phone: '', whatsapp: '',
    email: '', address: '', description: '', coverImage: '', images: [],
  })
  const [uploadingBusinessImages, setUploadingBusinessImages] = useState(false)
  const [businessCoverPreview, setBusinessCoverPreview] = useState('')
  const [submittingBusiness, setSubmittingBusiness] = useState(false)
  const businessGalleryInputRef = useRef(null)
  const businessCoverInputRef = useRef(null)

  const uploadPublicImage = async (file) => {
    let fileToUpload = file
    if (file.size > 300 * 1024) {
      const result = await compressImageFile(file, { maxSizeKB: 300 })
      fileToUpload = new File([result.blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
    }
    const formDataUpload = new FormData()
    formDataUpload.append('file', fileToUpload)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formDataUpload,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.url) throw new Error(data.error || 'Failed to upload image')
    return data.url
  }

  const handleClassifiedImageUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    if (!files.length) return
    if (classifiedForm.images.length + files.length > 8) {
      alert('Maximum 8 images allowed')
      return
    }
    for (const file of files) {
      try {
        const url = await uploadPublicImage(file)
        setClassifiedForm((prev) => ({ ...prev, images: [...prev.images, url] }))
        setClassifiedPreviews((prev) => [...prev, url])
      } catch (err) {
        console.error('Image upload failed:', err)
        alert(err.message || 'Failed to upload image')
      }
    }
  }

  const removeClassifiedImage = (idx) => {
    setClassifiedForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    setClassifiedPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleBusinessCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    setUploadingBusinessImages(true)
    try {
      const url = await uploadPublicImage(file)
      setBusinessCoverPreview(url)
      setBusinessForm((prev) => ({ ...prev, coverImage: url }))
    } catch (err) {
      console.error('Cover upload failed:', err)
      alert(err.message || 'Failed to upload cover image')
    } finally {
      setUploadingBusinessImages(false)
    }
  }

  const handleBusinessGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    if (!files.length) return
    if ((businessForm.images?.length || 0) + files.length > MAX_BUSINESS_GALLERY) {
      alert(`Maximum ${MAX_BUSINESS_GALLERY} additional images allowed`)
      return
    }
    setUploadingBusinessImages(true)
    try {
      for (const file of files) {
        try {
          const url = await uploadPublicImage(file)
          setBusinessForm((prev) => ({ ...prev, images: [...(prev.images || []), url] }))
        } catch (err) {
          console.error('Gallery upload failed:', err)
          alert(err.message || 'Failed to upload image')
        }
      }
    } finally {
      setUploadingBusinessImages(false)
    }
  }

  const removeBusinessGalleryImage = (idx) => {
    setBusinessForm((prev) => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }))
  }

  const handleClassifiedSubmit = async (e) => {
    e.preventDefault()
    if (!classifiedForm.title?.trim() || !classifiedForm.price?.trim() || !classifiedForm.phone?.trim() || !classifiedForm.location?.trim()) {
      alert('Please fill in all required fields: Title, Category, Price, Phone, and Location.')
      return
    }
    setSubmittingClassified(true)
    try {
      const res = await fetch('/api/classifieds/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classifiedForm),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Success! Your classified ad has been submitted and is sent to the Admin Dashboard for approval.')
        onOpenChange(false)
        setClassifiedForm({ title: '', category: 'Other', price: '', phone: '', location: '', description: '', images: [] })
        setClassifiedPreviews([])
      } else {
        alert(data.error || 'Failed to submit classified ad. Please try again.')
      }
    } catch (err) {
      console.error('Classified submission error:', err)
      alert('Something went wrong. Please try again later.')
    } finally {
      setSubmittingClassified(false)
    }
  }

  const handleBusinessSubmit = async (e) => {
    e.preventDefault()
    if (!businessForm.businessName?.trim() || !businessForm.phone?.trim() || !businessForm.address?.trim()) {
      alert('Please fill in required fields: Business Name, Phone, and Address.')
      return
    }
    if (uploadingBusinessImages) {
      alert('Please wait for images to finish uploading.')
      return
    }
    setSubmittingBusiness(true)
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessForm),
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Success! Your business "${businessForm.businessName}" has been submitted and sent to the Admin pending business queue for approval.`)
        onOpenChange(false)
        setBusinessForm({
          businessName: '', ownerName: '', category: 'Services', phone: '', whatsapp: '',
          email: '', address: '', description: '', coverImage: '', images: [],
        })
        setBusinessCoverPreview('')
      } else {
        alert(data.error || 'Failed to submit business listing. Please try again.')
      }
    } catch (err) {
      console.error('Business promotion error:', err)
      alert('Something went wrong. Please try again later.')
    } finally {
      setSubmittingBusiness(false)
    }
  }

  const brandName = siteConfig.brand.localizedName[language] || siteConfig.brand.name

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) setBusinessOnlyMode(false)
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[560px] max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl p-6 pb-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            {businessOnlyMode ? (
              <>
                <Briefcase className="h-5 w-5 text-brand-navy" />
                {t('promoteYourBusinessTitle') || (language === 'mr' ? 'तुमचा व्यवसाय प्रचारित करा' : language === 'hi' ? 'अपना व्यवसाय प्रचारित करें' : 'Promote Your Business')}
              </>
            ) : (
              <>
                <Tag className="h-5 w-5 text-brand-red" />
                {t('postYourAd') || (language === 'mr' ? 'तुमची जाहिरात पोस्ट करा' : language === 'hi' ? 'अपना विज्ञापन पोस्ट करें' : 'Post Your Ad')}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {businessOnlyMode
              ? t('promoteYourBusinessDesc') ||
                (language === 'mr'
                  ? `तुमच्या व्यवसायाची यादी ${brandName} वर प्रचारित करण्यासाठी खालील तपशील भरा.`
                  : language === 'hi'
                    ? `${brandName} बिज़नेस डायरेक्टरी में अपना व्यवसाय जोड़ने के लिए विवरण भरें।`
                    : `Fill in your details and photos to promote your business on ${brandName} Directory.`)
              : language === 'mr'
                ? 'वर्गीकृत जाहिरात सबमिट करा किंवा तुमच्या व्यवसायाची यादी प्रचारित करा.'
                : language === 'hi'
                  ? 'वर्गीकृत विज्ञापन सबमिट करें या अपनी व्यावसायिक लिस्टिंग का प्रचार करें।'
                  : 'Submit a classified ad or promote your business directory listing.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={businessOnlyMode ? 'business' : postAdTab} onValueChange={setPostAdTab} className="w-full">
          {!businessOnlyMode && (
            <TabsList className="grid grid-cols-2 mb-4 h-11 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="classified" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-brand-red data-[state=active]:shadow-sm">
                {language === 'mr' ? 'वर्गीकृत जाहिरात' : language === 'hi' ? 'वर्गीकृत विज्ञापन' : 'Classified Ad'}
              </TabsTrigger>
              <TabsTrigger value="business" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm">
                {language === 'mr' ? 'व्यवसाय प्रचार' : language === 'hi' ? 'व्यापार प्रचार' : 'Promote Business'}
              </TabsTrigger>
            </TabsList>
          )}

          {/* TAB 1: CLASSIFIED AD */}
          <TabsContent value="classified">
            <form onSubmit={handleClassifiedSubmit} className="space-y-4">
              <FormStep n={1} done={!!(classifiedForm.title && classifiedForm.category && classifiedForm.price)} label={language === 'mr' ? 'तुम्ही काय पोस्ट करत आहात?' : language === 'hi' ? 'आप क्या पोस्ट कर रहे हैं?' : 'What are you posting?'} />
              <div className="space-y-1.5">
                <Label htmlFor="cTitle" className="text-sm font-semibold text-gray-700">Ad Title *</Label>
                <Input id="cTitle" placeholder="e.g., MacBook Pro M2 or 2BHK Flat for Rent" value={classifiedForm.title} onChange={(e) => setClassifiedForm({ ...classifiedForm, title: e.target.value })} required className="h-10 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700">Category *</Label>
                  <Select value={classifiedForm.category} onValueChange={(val) => setClassifiedForm({ ...classifiedForm, category: val })}>
                    <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {CLASSIFIED_CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cPrice" className="text-sm font-semibold text-gray-700">Price *</Label>
                  <Input id="cPrice" placeholder="e.g., ₹25,000" value={classifiedForm.price} onChange={(e) => setClassifiedForm({ ...classifiedForm, price: e.target.value })} required className="h-10 rounded-lg" />
                </div>
              </div>

              <FormStep n={2} done={!!(classifiedForm.phone && classifiedForm.location)} label={language === 'mr' ? 'संपर्क आणि तपशील' : language === 'hi' ? 'संपर्क और विवरण' : 'Contact & details'} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cPhone" className="text-sm font-semibold text-gray-700">Phone Number *</Label>
                  <Input id="cPhone" type="tel" placeholder="+91 98765 43210" value={classifiedForm.phone} onChange={(e) => setClassifiedForm({ ...classifiedForm, phone: e.target.value })} required className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cLocation" className="text-sm font-semibold text-gray-700">Location (City/Area) *</Label>
                  <Input id="cLocation" placeholder="e.g., Pune / Vishrantwadi" value={classifiedForm.location} onChange={(e) => setClassifiedForm({ ...classifiedForm, location: e.target.value })} required className="h-10 rounded-lg" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cDesc" className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea id="cDesc" placeholder="Provide details about your classified ad..." rows={3} value={classifiedForm.description} onChange={(e) => setClassifiedForm({ ...classifiedForm, description: e.target.value })} className="rounded-lg resize-none" />
              </div>

              <FormStep n={3} done={classifiedForm.images.length > 0} label={language === 'mr' ? 'फोटो (ऐच्छिक)' : language === 'hi' ? 'फ़ोटो (वैकल्पिक)' : 'Photos (optional)'} />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Upload Images</Label>
                  <span className="text-xs text-emerald-500 font-medium">(Auto-compressed, max 8)</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {classifiedPreviews.map((preview, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeClassifiedImage(idx)} className="absolute top-0.5 right-0.5 bg-brand-red text-white rounded-full p-0.5 hover:bg-brand-red-dark">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {classifiedForm.images.length < 8 && (
                    <button type="button" onClick={() => classifiedFileInputRef.current?.click()} className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-brand-red hover:bg-red-50/50 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4 text-gray-400" />
                      <span className="text-[9px] text-gray-500 mt-1 font-medium">+ Add</span>
                    </button>
                  )}
                </div>
                <input ref={classifiedFileInputRef} type="file" accept="image/*" multiple onChange={handleClassifiedImageUpload} className="hidden" />
              </div>

              <DialogFooter className="sticky bottom-0 -mx-6 px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:pb-3 bg-white/95 backdrop-blur border-t border-gray-100 flex-row gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submittingClassified}>{t('cancel')}</Button>
                <Button type="submit" className="bg-brand-red hover:bg-brand-red-dark text-white font-bold" disabled={submittingClassified}>
                  {submittingClassified ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Ad'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* TAB 2: PROMOTE BUSINESS */}
          <TabsContent value="business">
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <FormStep n={1} done={!!(businessForm.businessName && businessForm.category)} label={language === 'mr' ? 'तुमचा व्यवसाय' : language === 'hi' ? 'आपका व्यवसाय' : 'Your business'} />
              <div className="space-y-1.5">
                <Label htmlFor="bName" className="text-sm font-semibold text-gray-700">Business Name *</Label>
                <Input id="bName" placeholder="e.g., Royal Spices Restaurant" value={businessForm.businessName} onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })} required className="h-10 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700">Category *</Label>
                  <Select value={businessForm.category} onValueChange={(val) => setBusinessForm({ ...businessForm, category: val })}>
                    <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bOwner" className="text-sm font-semibold text-gray-700">Owner Name</Label>
                  <Input id="bOwner" placeholder="e.g., Rajesh Sharma" value={businessForm.ownerName} onChange={(e) => setBusinessForm({ ...businessForm, ownerName: e.target.value })} className="h-10 rounded-lg" />
                </div>
              </div>

              <FormStep n={2} done={!!(businessForm.phone && businessForm.address)} label={language === 'mr' ? 'संपर्क आणि पत्ता' : language === 'hi' ? 'संपर्क और पता' : 'Contact & address'} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bPhone" className="text-sm font-semibold text-gray-700">Phone *</Label>
                  <Input id="bPhone" type="tel" placeholder="+91 98765 43210" value={businessForm.phone} onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })} required className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bWhatsapp" className="text-sm font-semibold text-gray-700">WhatsApp Number</Label>
                  <Input id="bWhatsapp" type="tel" placeholder="+91 98765 43210" value={businessForm.whatsapp} onChange={(e) => setBusinessForm({ ...businessForm, whatsapp: e.target.value })} className="h-10 rounded-lg" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bAddress" className="text-sm font-semibold text-gray-700">Full Address *</Label>
                <Input id="bAddress" placeholder="Shop 12, Vishrantwadi, Pune, Maharashtra" value={businessForm.address} onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })} required className="h-10 rounded-lg" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bDesc" className="text-sm font-semibold text-gray-700">About Business</Label>
                <Textarea id="bDesc" placeholder="Tell customers about your products or services..." rows={3} value={businessForm.description} onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })} className="rounded-lg resize-none" />
              </div>

              <FormStep n={3} done={!!(businessForm.coverImage || businessForm.images?.length)} label={language === 'mr' ? 'फोटो' : language === 'hi' ? 'फ़ोटो' : 'Photos'} />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Cover Image / Logo</Label>
                  <span className="text-xs text-emerald-500 font-medium">(Auto-compressed)</span>
                </div>
                <div className="flex items-center gap-3">
                  {businessCoverPreview ? (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={businessCoverPreview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setBusinessCoverPreview(''); setBusinessForm((prev) => ({ ...prev, coverImage: '' })) }} className="absolute top-0.5 right-0.5 bg-brand-red text-white rounded-full p-0.5 hover:bg-brand-red-dark">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => businessCoverInputRef.current?.click()} className="h-16 px-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center gap-2 hover:border-brand-navy hover:bg-blue-50/50 transition-colors cursor-pointer text-xs text-gray-600 font-medium">
                      <Upload className="h-4 w-4 text-gray-400" />
                      Upload Image
                    </button>
                  )}
                </div>
                <input ref={businessCoverInputRef} type="file" accept="image/*" onChange={handleBusinessCoverUpload} className="hidden" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">More Images</Label>
                  <span className="text-xs text-emerald-500 font-medium">(Auto-compressed, max {MAX_BUSINESS_GALLERY})</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {(businessForm.images || []).map((img, idx) => (
                    <div key={img + idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Business image ${idx + 1}`} className="w-full h-full object-cover" />
                      <button type="button" aria-label="Remove image" onClick={() => removeBusinessGalleryImage(idx)} className="absolute top-0.5 right-0.5 bg-brand-red text-white rounded-full p-0.5 hover:bg-brand-red-dark">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {(businessForm.images?.length || 0) < MAX_BUSINESS_GALLERY && (
                    <button type="button" disabled={uploadingBusinessImages} onClick={() => businessGalleryInputRef.current?.click()} className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-brand-navy hover:bg-blue-50/50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait">
                      {uploadingBusinessImages ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <Upload className="h-4 w-4 text-gray-400" />}
                      <span className="text-[9px] text-gray-500 mt-1 font-medium">+ Add</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">Show your shop, products or menu. These appear in your listing&apos;s photo gallery.</p>
                <input ref={businessGalleryInputRef} type="file" accept="image/*" multiple onChange={handleBusinessGalleryUpload} className="hidden" />
              </div>

              <DialogFooter className="sticky bottom-0 -mx-6 px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:pb-3 bg-white/95 backdrop-blur border-t border-gray-100 flex-row gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submittingBusiness}>{t('cancel')}</Button>
                <Button type="submit" className="bg-brand-navy hover:bg-brand-navy-dark text-white font-bold" disabled={submittingBusiness || uploadingBusinessImages}>
                  {submittingBusiness ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Business'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-red-50 border border-blue-100 p-3.5 flex items-center gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-brand-navy uppercase tracking-wide">Want a Custom / Premium Ad?</p>
            <p className="text-[12px] text-gray-600 mt-0.5">Contact us directly for better placement &amp; reach</p>
          </div>
          <a href={siteConfig.contact.phoneHref} className="flex-shrink-0 bg-brand-red hover:bg-brand-red-dark text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors whitespace-nowrap">
            📞 {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
