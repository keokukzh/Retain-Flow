'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
  statusBadge?: ReactNode;
  cta?: ReactNode;
}

export default function FeatureIntegrationCard({ icon, title, description, features, statusBadge, cta }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      role="region"
      aria-label={title}
      className="bg-white rounded-xl p-6 shadow border border-gray-200 transition-all"
      whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 8px 30px rgba(59,130,246,0.15)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        {statusBadge}
      </div>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      {!!features?.length && (
        <ul className="space-y-2 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              {f}
            </li>
          ))}
        </ul>
      )}
      {cta}
    </motion.div>
  );
}


