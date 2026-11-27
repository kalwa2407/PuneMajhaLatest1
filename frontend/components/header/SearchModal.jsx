'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Search, X, Loader2, Tag } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLocalizedText } from '@/lib/newsData'
import { siteConfig } from '@/lib/siteConfig'

export default function SearchModal({ open, onOpenChange, onSelectArticle, onBrowseAll }) {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearching(false)
      setHasSearched(false)
      return
    }

    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/news?search=${encodeURIComponent(searchQuery.trim())}&limit=20`)
        const data = await res.json()
        const articles = Array.isArray(data) ? data : (data.articles || data.news || [])
        setSearchResults(articles.filter((a) => a && (a.status === 'approved' || !a.status)))
      } catch (err) {
        console.error('Search error:', err)
        setSearchResults([])
      } finally {
        setSearching(false)
        setHasSearched(true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchQuery('')
      setSearchResults([])
      setHasSearched(false)
    }
  }, [open])

  const topics =
    language === 'mr'
      ? ['राजकारण', 'गुन्हे', 'महाराष्ट्र', 'खेळ', 'मनोरंजन', 'व्यापार', 'तंत्रज्ञान', 'लाइव्ह टीव्ही']
      : language === 'hi'
        ? ['राजनीति', 'अपराध', 'महाराष्ट्र', 'खेल', 'मनोरंजन', 'व्यापार', 'तकनीक', 'लाइव टीवी']
        : ['Politics', 'Crime', 'Maharashtra', 'Sports', 'Entertainment', 'Business', 'Technology', 'Live TV']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-2xl border border-gray-100 shadow-2xl bg-white">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex items-center gap-3">
          <Search className="h-5 w-5 text-brand-navy shrink-0" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={
              t('searchPublishedNewsPlaceholder') ||
              (language === 'mr'
                ? 'बातम्या, विषय, कीवर्ड शोधा...'
                : language === 'hi'
                  ? 'समाचार, विषय, कीवर्ड खोजें...'
                  : 'Search published news, topics, keywords...')
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium placeholder:text-gray-400 h-10 px-0 shadow-none"
          />
          {searching && <Loader2 className="h-5 w-5 text-gray-400 animate-spin shrink-0" />}
          {searchQuery && !searching && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title={language === 'mr' ? 'साफ करा' : language === 'hi' ? 'साफ़ करें' : 'Clear'}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-gray-100">
          {!searchQuery.trim() && (
            <div className="py-3 px-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {language === 'mr' ? 'लोकप्रिय विषय' : language === 'hi' ? 'लोकप्रिय विषय' : 'Popular Topics'}
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchQuery(topic)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-brand-navy/10 hover:text-brand-navy text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Tag className="h-3 w-3 opacity-60" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searching && searchResults.length === 0 && (
            <div className="py-8 text-center text-gray-400 space-y-2">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-red" />
              <p className="text-sm">
                {language === 'mr'
                  ? 'प्रकाशित बातम्या शोधत आहे...'
                  : language === 'hi'
                    ? 'प्रकाशित समाचार लेख खोजे जा रहे हैं...'
                    : 'Searching published news articles...'}
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-2 pb-1 text-xs font-semibold text-gray-400">
                <span>
                  {language === 'mr'
                    ? `${searchResults.length} प्रकाशित बातम्या सापडल्या`
                    : language === 'hi'
                      ? `${searchResults.length} प्रकाशित समाचार मिले`
                      : `Found ${searchResults.length} published article${searchResults.length === 1 ? '' : 's'}`}
                </span>
                <span className="text-[11px] text-gray-400">
                  {language === 'mr'
                    ? 'उघडण्यासाठी क्लिक करा'
                    : language === 'hi'
                      ? 'खोलने के लिए क्लिक करें'
                      : 'Click to open'}
                </span>
              </div>
              {searchResults.map((article) => {
                const title = getLocalizedText(article.title, language) || article.title || 'Untitled Article'
                const desc = getLocalizedText(article.shortDescription || article.metaDescription, language) || ''
                const image = article.mainImage || article.images?.[0] || article.thumbnails?.[0] || siteConfig.assets.placeholderNews
                const cat = typeof article.category === 'string' ? article.category : article.category?.en || 'News'
                const dateStr =
                  article.publishedAt || article.createdAt
                    ? new Date(article.publishedAt || article.createdAt).toLocaleDateString()
                    : ''

                return (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="flex gap-3.5 p-2.5 rounded-xl hover:bg-blue-50/60 cursor-pointer transition-colors group items-start"
                  >
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = siteConfig.assets.placeholderNews
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-brand-red bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-full uppercase">
                          {cat}
                        </span>
                        {dateStr && <span className="text-[10px] text-gray-400">{dateStr}</span>}
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-navy transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h4>
                      {desc && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{desc}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {hasSearched && !searching && searchResults.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-gray-700">
                {language === 'mr' ? 'कोणतेही लेख सापडले नाहीत' : language === 'hi' ? 'कोई लेख नहीं मिला' : 'No articles found'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'mr'
                  ? `"${searchQuery}" साठी काहीही सापडले नाही. दुसरा कीवर्ड वापरून पहा.`
                  : language === 'hi'
                    ? `"${searchQuery}" के लिए कुछ नहीं मिला। भिन्न कीवर्ड आज़माएं।`
                    : `We couldn't find anything for "${searchQuery}". Try a different keyword or topic.`}
              </p>
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="hidden sm:inline">
            {language === 'mr' ? 'बंद करण्यासाठी ESC दाबा' : language === 'hi' ? 'बंद करने के लिए ESC दबाएं' : 'Press ESC to close'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBrowseAll(searchQuery)}
            className="ml-auto text-brand-navy hover:text-brand-red hover:bg-blue-50 font-bold text-xs"
          >
            {language === 'mr'
              ? 'सर्व बातम्या पहा →'
              : language === 'hi'
                ? 'समाचार में सभी लेख देखें →'
                : 'Browse all articles in News →'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
