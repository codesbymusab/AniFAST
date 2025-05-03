import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from "next-auth/react";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: 'aniFast App',
  description: 'Created with anifast',
  generator: 'ani.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
        <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}



