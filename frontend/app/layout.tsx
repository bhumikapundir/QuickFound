import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/Navbar'

/* ============================================================
   FONT LOADING — Sora (display) + DM Sans (body)
   ============================================================ */
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

/* ============================================================
   METADATA
   ============================================================ */
export const metadata: Metadata = {
  title: {
    default: 'QuickFound — Campus Lost & Found',
    template: '%s | QuickFound',
  },
  description:
    'A smart, real-time Lost & Found platform for university campuses. Post lost items, discover found ones, and reclaim what matters.',
  keywords: ['lost and found', 'campus', 'university', 'QuickFound'],
  authors: [{ name: 'Web_Weavers Team' }],
  openGraph: {
    title: 'QuickFound — Campus Lost & Found',
    description: 'Reuniting students with their belongings.',
    type: 'website',
  },
}

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            {/* Navbar is rendered globally on every page */}
            <Navbar />

            {/* Main content — pages render here */}
            <main className="min-h-[calc(100dvh-64px)]">
              {children}
            </main>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}