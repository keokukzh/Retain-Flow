'use client';

import { useState, useEffect } from 'react';
// import Image from 'next/image'; // Temporarily disabled for deployment

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  platform: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Content Creator',
    company: 'TechTutorials',
    avatar: '/avatars/sarah-chen.jpg',
    content: 'RetainFlow helped me reduce my Discord community churn by 35% in just 2 months. The AI predictions are incredibly accurate and the automation saves me hours every week.',
    rating: 5,
    platform: 'Discord',
    results: [
      { metric: 'Churn Rate', value: '35%', improvement: 'reduction' },
      { metric: 'Engagement', value: '2.5x', improvement: 'increase' },
      { metric: 'Time Saved', value: '10h', improvement: 'per week' },
    ],
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Digital Product Creator',
    company: 'DesignMastery',
    avatar: '/avatars/marcus-rodriguez.jpg',
    content: 'The Shopify integration is a game-changer. I can now track my digital product subscribers and automatically send retention campaigns. My revenue increased by 40% since implementing RetainFlow.',
    rating: 5,
    platform: 'Shopify',
    results: [
      { metric: 'Revenue', value: '40%', improvement: 'increase' },
      { metric: 'LTV', value: '60%', improvement: 'increase' },
      { metric: 'Retention', value: '25%', improvement: 'increase' },
    ],
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Community Manager',
    company: 'GamingGuild',
    avatar: '/avatars/emily-watson.jpg',
    content: 'Managing a 5,000+ member Discord server was overwhelming until RetainFlow. The automated welcome sequences and engagement tracking help me keep our community active and growing.',
    rating: 5,
    platform: 'Discord',
    results: [
      { metric: 'Members', value: '5,000+', improvement: 'managed' },
      { metric: 'Activity', value: '3x', improvement: 'increase' },
      { metric: 'Growth', value: '45%', improvement: 'increase' },
    ],
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Course Creator',
    company: 'LearnWithDavid',
    avatar: '/avatars/david-kim.jpg',
    content: 'The Whop integration is seamless. I can see exactly which students are at risk of churning and send targeted retention offers. My course completion rate improved by 50%.',
    rating: 5,
    platform: 'Whop',
    results: [
      { metric: 'Completion', value: '50%', improvement: 'increase' },
      { metric: 'Satisfaction', value: '4.8/5', improvement: 'rating' },
      { metric: 'Referrals', value: '2x', improvement: 'increase' },
    ],
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Fitness Coach',
    company: 'FitWithLisa',
    avatar: '/avatars/lisa-thompson.jpg',
    content: 'RetainFlow helped me understand my community better than ever. The insights are actionable and the automation ensures no member falls through the cracks.',
    rating: 5,
    platform: 'Multiple',
    results: [
      { metric: 'Engagement', value: '4x', improvement: 'increase' },
      { metric: 'Retention', value: '30%', improvement: 'increase' },
      { metric: 'Satisfaction', value: '95%', improvement: 'rating' },
    ],
  },
  {
    id: 6,
    name: 'Alex Johnson',
    role: 'SaaS Founder',
    company: 'DevTools Pro',
    avatar: '/avatars/alex-johnson.jpg',
    content: 'The API integration allowed us to build custom retention flows for our SaaS product. The churn prediction accuracy is impressive and has saved us thousands in lost revenue.',
    rating: 5,
    platform: 'API',
    results: [
      { metric: 'Churn', value: '45%', improvement: 'reduction' },
      { metric: 'Revenue', value: '$50k', improvement: 'saved' },
      { metric: 'Accuracy', value: '92%', improvement: 'prediction' },
    ],
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by creators worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how creators are using RetainFlow to grow their communities and reduce churn.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full -translate-y-16 translate-x-16 opacity-20" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full translate-y-12 -translate-x-12 opacity-20" />

            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl md:text-2xl text-gray-800 text-center mb-8 leading-relaxed">
                &ldquo;{currentTestimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-primary-600 font-bold text-lg">{currentTestimonial.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-lg">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-gray-600">
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-primary-600 font-medium">
                        {currentTestimonial.platform}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentTestimonial.results.map((result, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {result.value}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {result.metric}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {result.improvement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">30%</div>
            <div className="text-gray-600">Average churn reduction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">2.5x</div>
            <div className="text-gray-600">Engagement increase</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10h</div>
            <div className="text-gray-600">Time saved per week</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Customer satisfaction</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to join thousands of successful creators?
          </h3>
          <p className="text-gray-600 mb-8">
            Start your free trial today and see the difference RetainFlow can make.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors btn-glow">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
