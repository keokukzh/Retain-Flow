'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// import Lottie from 'lottie-react';
// import aiAnimation from '/ai.json';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden circuit-bg pt-28 md:pt-32"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-secondary-900/60 to-primary-900/80" />
      
      {/* Animated background via Lottie - temporarily disabled */}
      {/* <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Lottie animationData={aiAnimation} loop={true} />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Logo removed for cleaner header/hero overlap */}

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-relaxed">
            <span className="gradient-text">AI-Powered</span>
            <br />
            <span className="text-white">Retention Tool</span>
            <br />
            <span className="text-primary-300">for Creators</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Reduce churn by up to 30%
            <br className="hidden sm:block" />
            with intelligent automation, <span className="font-bold text-primary-300">Discord integration</span>, and <span className="font-bold text-primary-300">AI-powered insights</span> designed specifically for creator communities.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Plug & Play</h3>
              <p className="text-gray-300 text-sm">No coding required. Connect Discord, Whop, and Shopify in minutes.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300 text-sm">Predict churn before it happens with machine learning algorithms.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community-First</h3>
              <p className="text-gray-300 text-sm">Built specifically for Discord communities and creator platforms.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="btn-glow bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 glow"
            >
              Start Free Trial
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/demo"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-5 px-10 rounded-xl border border-white/20 transition-all duration-300"
            >
              Watch Demo
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-white/80 text-sm mb-6">Trusted by creators worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <Image src="/integrations/discord.svg" alt="Discord" width={120} height={32} />
              <Image src="/integrations/whop.svg" alt="Whop" width={120} height={32} />
              <Image src="/integrations/shopify.svg" alt="Shopify" width={120} height={32} />
              <Image src="/integrations/patreon.svg" alt="Patreon" width={120} height={32} />
              <Image src="/integrations/gumroad.svg" alt="Gumroad" width={120} height={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTAs on mobile */}
      <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center md:hidden px-4">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2 flex gap-2">
          <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-5 rounded-lg">Start Free Trial</Link>
          <Link href="/demo" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-lg border border-white/20">Watch Demo</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
