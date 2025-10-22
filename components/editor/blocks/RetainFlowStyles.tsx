export const RetainFlowStyles = [
  {
    selectors: ['.retainflow-hero'],
    style: {
      'background': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      'min-height': '100vh',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'overflow': 'hidden',
      'padding': '5rem 0',
      'position': 'relative',
    },
  },
  {
    selectors: ['.retainflow-hero .gradient-text'],
    style: {
      'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    },
  },
  {
    selectors: ['.retainflow-hero .btn-glow'],
    style: {
      'box-shadow': '0 0 20px rgba(102, 126, 234, 0.5)',
      'transition': 'all 0.3s ease',
    },
  },
  {
    selectors: ['.retainflow-hero .btn-glow:hover'],
    style: {
      'box-shadow': '0 0 30px rgba(102, 126, 234, 0.8)',
      'transform': 'scale(1.05)',
    },
  },
  {
    selectors: ['.retainflow-pricing-card'],
    style: {
      'background': '#ffffff',
      'border-radius': '0.75rem',
      'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.1)',
      'padding': '2rem',
      'border': '1px solid #e5e7eb',
      'transition': 'all 0.3s ease',
    },
  },
  {
    selectors: ['.retainflow-pricing-card:hover'],
    style: {
      'transform': 'translateY(-5px)',
      'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  {
    selectors: ['.retainflow-testimonial'],
    style: {
      'background': '#ffffff',
      'border-radius': '0.75rem',
      'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.1)',
      'padding': '2rem',
      'text-align': 'center',
    },
  },
  {
    selectors: ['.retainflow-integration-card'],
    style: {
      'background': '#ffffff',
      'border-radius': '0.75rem',
      'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.1)',
      'padding': '1.5rem',
      'border': '1px solid #e5e7eb',
      'transition': 'all 0.3s ease',
    },
  },
  {
    selectors: ['.retainflow-integration-card:hover'],
    style: {
      'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  {
    selectors: ['.retainflow-cta-button .btn-glow'],
    style: {
      'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'border': 'none',
      'color': '#ffffff',
      'font-weight': '600',
      'padding': '0.75rem 2rem',
      'border-radius': '0.75rem',
      'box-shadow': '0 0 20px rgba(102, 126, 234, 0.5)',
      'transition': 'all 0.3s ease',
      'cursor': 'pointer',
    },
  },
  {
    selectors: ['.retainflow-cta-button .btn-glow:hover'],
    style: {
      'box-shadow': '0 0 30px rgba(102, 126, 234, 0.8)',
      'transform': 'scale(1.05)',
    },
  },
  {
    selectors: ['.animate-pulse-slow'],
    style: {
      'animation': 'pulseSlow 3s ease-in-out infinite',
    },
  },
  {
    selectors: ['@keyframes pulseSlow'],
    style: {
      '0%, 100%': {
        'opacity': '1',
        'transform': 'scale(1)',
      },
      '50%': {
        'opacity': '0.8',
        'transform': 'scale(1.05)',
      },
    },
  },
];
