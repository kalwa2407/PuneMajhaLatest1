'use client'

import React from 'react'
import { siteConfig } from '@/lib/siteConfig'

/**
 * Brand logo component for Pune Majha News.
 * Renders the crisp circular Pune Majha emblem cleanly with zero hydration mismatch
 * and zero dependency on legacy video assets.
 */
export default function VideoLogo({ className = '', style = {}, tight = false }) {
  return (
    <div
      className={`relative flex items-center justify-center ${tight ? 'overflow-hidden' : ''} ${className}`}
      style={style}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.assets.logo}
        alt={siteConfig.brand.name}
        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
        suppressHydrationWarning
      />
    </div>
  )
}
