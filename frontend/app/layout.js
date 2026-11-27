import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { siteConfig } from '@/lib/siteConfig'

export const metadata = {
  title: `${siteConfig.brand.name} - ${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  icons: {
    icon: [
      { url: `${siteConfig.assets.favicon}?v=2`, type: 'image/png', sizes: '256x256' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    shortcut: `${siteConfig.assets.favicon}?v=2`,
    apple: siteConfig.assets.appleIcon,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="overflow-x-hidden supports-[overflow:clip]:overflow-x-clip max-w-full" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden supports-[overflow:clip]:overflow-x-clip max-w-full min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
