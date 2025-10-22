import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RetainFlow - AI-Powered Retention Tool for Creators',
  description: 'RetainFlow helps creators and membership providers reduce churn, increase retention, and grow their communities with AI-powered insights and automation.',
  keywords: ['retention', 'churn prevention', 'creator tools', 'membership', 'discord', 'shopify', 'whop'],
  authors: [{ name: 'Aid Destani', url: 'https://aidevelo.ai' }],
  creator: 'AIDevelopment',
  publisher: 'AIDevelopment',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aidevelo.ai',
    siteName: 'RetainFlow',
    title: 'RetainFlow - AI-Powered Retention Tool for Creators',
    description: 'Reduce churn and increase retention with AI-powered insights and automation for creators and membership providers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RetainFlow - AI-Powered Retention Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetainFlow - AI-Powered Retention Tool for Creators',
    description: 'Reduce churn and increase retention with AI-powered insights and automation.',
    images: ['/og-image.jpg'],
    creator: '@aidevelo',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          <div className="min-h-full">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
