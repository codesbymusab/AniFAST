import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from "@/components/providers";

export const viewport: Viewport = {
  themeColor: '#0E0A1F',
}

export const metadata: Metadata = {
  title: {
    default: 'aniFast',
    template: '%s | aniFast App'
  },
  description: 'Your ultimate anime streaming and discovery platform',
  generator: 'ani.dev',
  applicationName: 'aniFast',
  referrer: 'origin-when-cross-origin',
  keywords: ['anime', 'streaming', 'watch anime', 'anime list'],
  authors: [{ name: 'aniFast Team' }],
  creator: 'aniFast Developers',
  publisher: 'aniFast',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: 'aniFast App',
    description: 'Your ultimate anime streaming and discovery platform',
    url: 'https://yourdomain.com',
    siteName: 'aniFast',
    images: [
      {
        url: 'https://yourdomain.com/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aniFast App',
    description: 'Your ultimate anime streaming and discovery platform',
    creator: '@aniFast',
    images: ['https://yourdomain.com/images/twitter-card.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains if needed */}
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}