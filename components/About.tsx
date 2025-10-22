'use client';

// import Image from 'next/image'; // Temporarily disabled for deployment

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built by creators, for creators
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              RetainFlow was born from the frustration of watching amazing creator communities 
              struggle with member retention. We believe every creator deserves the tools to 
              build lasting, engaged communities.
            </p>

            {/* Founder Story */
            }
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    {/* Replace with next/image when enabled */}
                    <img src="/team/aid-destani.svg" alt="Aid Destani" className="w-16 h-16 object-cover" />
                  </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Aid Destani</h3>
                  <p className="text-gray-600">Founder & CEO, AIDevelopment</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic leading-relaxed">
                &ldquo;After building multiple creator communities myself, I realized that retention 
                was the biggest challenge. Traditional tools were either too complex or not 
                designed for creators. RetainFlow bridges that gap with AI-powered simplicity.&rdquo;
              </blockquote>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start bg-white rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplicity First</h3>
                  <p className="text-gray-600">
                    Complex tools create barriers. We believe powerful retention tools should be 
                    simple enough for any creator to use effectively.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community-Centric</h3>
                  <p className="text-gray-600">
                    Every feature is designed with creator communities in mind. We understand 
                    the unique challenges of building and maintaining engaged audiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white rounded-xl p-6 shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h3>
                  <p className="text-gray-600">
                    We leverage cutting-edge AI to predict churn and automate retention, 
                    giving creators superpowers they never had before.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="relative lg:w-5/6 mx-auto">
            {/* Main Image */}
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">AD</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">AIDevelopment</h3>
                  <p className="text-primary-100 mb-6">
                    Empowering creators with AI-driven tools for community growth and retention.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold">50k+</div>
                      <div className="text-sm text-primary-100">Creators Served</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">30%</div>
                      <div className="text-sm text-primary-100">Avg. Churn Reduction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-6 w-48">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">GDPR Compliant</span>
              </div>
              <p className="text-xs text-gray-600">
                Your data is secure and you maintain full control over your community information.
              </p>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-6 w-48">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Enterprise Security</span>
              </div>
              <p className="text-xs text-gray-600">
                Bank-level encryption and security protocols protect your data and your community.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              To democratize community retention tools by making AI-powered insights and 
              automation accessible to every creator, regardless of their technical expertise 
              or budget. We believe that when creators succeed, communities thrive, and 
              the world becomes a more connected place.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-primary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Have questions? We&apos;d love to hear from you.
            </h3>
            <p className="text-primary-100 mb-6">
              Our team is here to help you succeed with your community retention goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
              <button className="border border-white/30 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
