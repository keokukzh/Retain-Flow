'use client';

import { useEffect } from 'react';

export interface RetainFlowBlock {
  id: string;
  label: string;
  content: string;
  category: string;
  attributes?: any;
}

export const RetainFlowBlocks: RetainFlowBlock[] = [
  {
    id: 'retainflow-hero',
    label: 'RetainFlow Hero',
    category: 'RetainFlow',
    content: `
      <section class="retainflow-hero">
        <div class="hero-container">
          <div class="hero-logo">
            <div class="rf-logo">
              <span class="rf-text">RF</span>
            </div>
          </div>
          <h1 class="hero-title">AI-Powered Retention for Creators</h1>
          <p class="hero-subtitle">Stop churn before it starts. RetainFlow uses intelligent AI to predict cancellations and deliver personalized retention offers.</p>
          <div class="hero-cta">
            <button class="btn-primary">Start Your Free Trial</button>
            <button class="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>
    `,
    attributes: {
      class: 'retainflow-hero-block',
    },
  },
  {
    id: 'retainflow-pricing-card',
    label: 'RetainFlow Pricing Card',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-pricing-card">
        <div class="pricing-header">
          <h3 class="plan-name">Pro Plan</h3>
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">49</span>
            <span class="period">/mo</span>
          </div>
        </div>
        <ul class="plan-features">
          <li>500 Users</li>
          <li>Discord & Whop Integration</li>
          <li>AI Churn Prediction</li>
          <li>Email Automation</li>
          <li>Priority Support</li>
        </ul>
        <button class="pricing-cta">Get Started</button>
      </div>
    `,
    attributes: {
      class: 'retainflow-pricing-block',
    },
  },
  {
    id: 'retainflow-testimonial',
    label: 'RetainFlow Testimonial',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-testimonial">
        <div class="testimonial-content">
          <blockquote class="testimonial-text">
            "RetainFlow helped us reduce churn by 40% in just 3 months. The AI predictions are incredibly accurate."
          </blockquote>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img src="https://via.placeholder.com/60x60" alt="Author" />
            </div>
            <div class="author-info">
              <h4 class="author-name">Sarah Johnson</h4>
              <p class="author-title">Creator, Tech Community</p>
            </div>
          </div>
        </div>
      </div>
    `,
    attributes: {
      class: 'retainflow-testimonial-block',
    },
  },
  {
    id: 'retainflow-integration-card',
    label: 'RetainFlow Integration Card',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-integration-card">
        <div class="integration-icon">
          <div class="icon-discord">D</div>
        </div>
        <div class="integration-content">
          <h3 class="integration-title">Discord Integration</h3>
          <p class="integration-description">
            Automatically welcome new members, assign roles, and track engagement across your Discord server.
          </p>
          <div class="integration-features">
            <span class="feature-tag">Welcome Messages</span>
            <span class="feature-tag">Role Assignment</span>
            <span class="feature-tag">Activity Tracking</span>
          </div>
        </div>
      </div>
    `,
    attributes: {
      class: 'retainflow-integration-block',
    },
  },
  {
    id: 'retainflow-cta-button',
    label: 'RetainFlow CTA Button',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-cta-container">
        <button class="retainflow-cta-btn">
          <span class="btn-text">Start Your Free Trial</span>
          <span class="btn-icon">→</span>
        </button>
      </div>
    `,
    attributes: {
      class: 'retainflow-cta-block',
    },
  },
  {
    id: 'retainflow-stats',
    label: 'RetainFlow Stats',
    category: 'RetainFlow',
    content: `
      <div class="retainflow-stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">40%</div>
            <div class="stat-label">Churn Reduction</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2.5x</div>
            <div class="stat-label">Retention Rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">95%</div>
            <div class="stat-label">Accuracy</div>
          </div>
        </div>
      </div>
    `,
    attributes: {
      class: 'retainflow-stats-block',
    },
  },
];

export function useRetainFlowBlocks(editor: any) {
  useEffect(() => {
    if (!editor) return;

    // Add RetainFlow blocks to the block manager
    const blockManager = editor.BlockManager;

    RetainFlowBlocks.forEach((block) => {
      blockManager.add(block.id, {
        label: block.label,
        content: block.content,
        category: block.category,
        attributes: block.attributes,
      });
    });

    return () => {
      // Cleanup if needed
      RetainFlowBlocks.forEach((block) => {
        blockManager.remove(block.id);
      });
    };
  }, [editor]);
}
