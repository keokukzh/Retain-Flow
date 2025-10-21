export const RetainFlowStyles = `
  /* RetainFlow Hero Styles */
  .retainflow-hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 80px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .hero-logo {
    margin-bottom: 30px;
  }

  .rf-logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #3b82f6, #06b6d4);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    animation: pulse 2s infinite;
  }

  .rf-text {
    font-size: 24px;
    font-weight: bold;
    color: white;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 40px;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-secondary {
    padding: 15px 30px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: #06b6d4;
    color: white;
  }

  .btn-primary:hover {
    background: #0891b2;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: white;
    color: #1e3a8a;
  }

  /* RetainFlow Pricing Card Styles */
  .retainflow-pricing-card {
    background: white;
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    max-width: 350px;
  }

  .retainflow-pricing-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  }

  .pricing-header {
    margin-bottom: 30px;
  }

  .plan-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
  }

  .plan-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 5px;
  }

  .currency {
    font-size: 1.5rem;
    color: #6b7280;
  }

  .amount {
    font-size: 3rem;
    font-weight: 800;
    color: #1f2937;
  }

  .period {
    font-size: 1rem;
    color: #6b7280;
  }

  .plan-features {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
  }

  .plan-features li {
    padding: 10px 0;
    color: #4b5563;
    border-bottom: 1px solid #f3f4f6;
  }

  .plan-features li:last-child {
    border-bottom: none;
  }

  .pricing-cta {
    width: 100%;
    padding: 15px;
    background: linear-gradient(45deg, #3b82f6, #06b6d4);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .pricing-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }

  /* RetainFlow Testimonial Styles */
  .retainflow-testimonial {
    background: #f8fafc;
    padding: 40px;
    border-radius: 20px;
    border-left: 5px solid #3b82f6;
  }

  .testimonial-text {
    font-size: 1.25rem;
    line-height: 1.6;
    color: #1f2937;
    margin: 0 0 30px 0;
    font-style: italic;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .author-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 5px 0;
  }

  .author-title {
    color: #6b7280;
    margin: 0;
  }

  /* RetainFlow Integration Card Styles */
  .retainflow-integration-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  .integration-icon {
    flex-shrink: 0;
  }

  .icon-discord {
    width: 60px;
    height: 60px;
    background: #5865f2;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
  }

  .integration-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 10px 0;
  }

  .integration-description {
    color: #6b7280;
    line-height: 1.5;
    margin: 0 0 15px 0;
  }

  .integration-features {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .feature-tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* RetainFlow CTA Button Styles */
  .retainflow-cta-container {
    text-align: center;
    padding: 20px;
  }

  .retainflow-cta-btn {
    background: linear-gradient(45deg, #3b82f6, #06b6d4);
    color: white;
    border: none;
    padding: 18px 36px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  }

  .retainflow-cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
  }

  .btn-icon {
    transition: transform 0.3s ease;
  }

  .retainflow-cta-btn:hover .btn-icon {
    transform: translateX(5px);
  }

  /* RetainFlow Stats Styles */
  .retainflow-stats {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 60px 20px;
    border-radius: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    max-width: 800px;
    margin: 0 auto;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #06b6d4, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-cta {
      flex-direction: column;
      align-items: center;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    .retainflow-integration-card {
      flex-direction: column;
      text-align: center;
    }
  }
`;
