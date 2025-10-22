'use client';

import { motion, useReducedMotion } from 'framer-motion';
import PrimaryButton from './PrimaryButton';

interface PricingCardProps {
  title: string;
  description: string;
  priceLabel: string;
  periodLabel?: string;
  features: string[];
  limitations?: string[];
  ctaLabel: string;
  onCta: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export default function PricingCard({
  title,
  description,
  priceLabel,
  periodLabel,
  features,
  limitations = [],
  ctaLabel,
  onCta,
  selected,
  disabled,
}: PricingCardProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      tabIndex={0}
      aria-label={`Pricing-Package ${title}`}
      className={`rounded-2xl p-8 shadow-lg border ${selected ? 'border-primary-500 ring-2 ring-primary-500/20 bg-gradient-to-bl from-purple-50 to-blue-50' : 'border-gray-200 bg-white'}`}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="text-center mb-6">
        <span className="text-5xl font-bold text-gray-900">{priceLabel}</span>
        {periodLabel && <span className="text-gray-600 ml-2">/{periodLabel}</span>}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            <span className="text-gray-700">{f}</span>
          </li>
        ))}
        {limitations.map((l) => (
          <li key={l} className="flex items-start opacity-70">
            <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            <span className="text-gray-500">{l}</span>
          </li>
        ))}
      </ul>
      <PrimaryButton
        onClick={onCta}
        ariaLabel={ctaLabel}
        disabled={disabled}
        className={`${selected ? 'bg-primary-600 hover:bg-primary-700 text-white w-full' : 'bg-gray-900 hover:bg-gray-800 text-white w-full'}`}
      >
        {ctaLabel}
      </PrimaryButton>
    </motion.div>
  );
}


