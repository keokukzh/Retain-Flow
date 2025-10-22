export const RetainFlowBlocks = [
  {
    id: 'retainflow-hero',
    label: 'RetainFlow Hero',
    category: 'RetainFlow',
    content: `
      <section class="retainflow-hero bg-gradient-to-br from-primary-950 via-secondary-900 to-primary-900 min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div class="absolute inset-0 z-0">
          <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 0.5s;"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="mb-8 flex justify-center">
            <div class="relative">
              <div class="w-30 h-30 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full glow-lg animate-pulse-slow flex items-center justify-center">
                <span class="text-white font-bold text-2xl">RF</span>
              </div>
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 opacity-20 animate-ping"></div>
            </div>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span class="gradient-text">AI-Powered</span><br>Retention for Creators
          </h1>
          <p class="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop churn before it starts. RetainFlow uses intelligent AI to predict cancellations and deliver personalized retention offers.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg transform hover:scale-105 btn-glow">
              Start Your Free Trial
            </button>
            <button class="border border-gray-400 text-gray-200 font-semibold py-3 px-8 rounded-xl transition-colors hover:bg-gray-800 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>
    `,
    attributes: {
      class: 'gjs-block-retainflow-hero',
    },
  },
  {
    id: 'retainflow-pricing-card',
    label: 'RetainFlow Pricing Card',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-pricing-card bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Pro Plan</h3>
        <p class="text-gray-500 mb-6">Grow your community with advanced tools.</p>
        <div class="text-5xl font-bold text-primary-600 mb-6">
          $49<span class="text-xl text-gray-500">/month</span>
        </div>
        <ul class="text-left text-gray-700 space-y-3 mb-8">
          <li class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            5,000 Members
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Advanced AI Churn Prediction
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Discord & Email Integrations
          </li>
        </ul>
        <button class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors btn-glow">
          Choose Pro
        </button>
      </div>
    `,
    attributes: {
      class: 'gjs-block-retainflow-pricing',
    },
  },
  {
    id: 'retainflow-testimonial',
    label: 'RetainFlow Testimonial',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-testimonial bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-white font-bold text-xl">JD</span>
        </div>
        <blockquote class="text-xl text-gray-800 mb-6 leading-relaxed">
          "RetainFlow helped me reduce churn by 40% in just 3 months. The AI predictions are incredibly accurate."
        </blockquote>
        <div class="text-gray-600">
          <div class="font-semibold">John Doe</div>
          <div class="text-sm">Creator with 50K+ followers</div>
        </div>
        <div class="flex justify-center mt-4">
          <div class="flex text-yellow-400">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          </div>
        </div>
      </div>
    `,
    attributes: {
      class: 'gjs-block-retainflow-testimonial',
    },
  },
  {
    id: 'retainflow-integration-card',
    label: 'RetainFlow Integration Card',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-integration-card bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
            <span class="text-white font-bold text-lg">D</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Discord Integration</h3>
        </div>
        <p class="text-gray-600 mb-4">
          Automatically welcome new members, assign roles, and track activity to predict churn before it happens.
        </p>
        <div class="flex items-center text-sm text-gray-500">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Connected
        </div>
      </div>
    `,
    attributes: {
      class: 'gjs-block-retainflow-integration',
    },
  },
  {
    id: 'retainflow-cta-button',
    label: 'RetainFlow CTA Button',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-cta-button text-center">
        <button class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg transform hover:scale-105 btn-glow">
          Start Your Free Trial
        </button>
      </div>
    `,
    attributes: {
      class: 'gjs-block-retainflow-cta',
    },
  },
];