'use client';

import PrimaryButton from './PrimaryButton';

export default function FooterNewsletter() {
  return (
    <form className="flex gap-2 py-6" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter subscription">
      <input
        type="email"
        placeholder="E-Mail"
        aria-label="Ihre E-Mail"
        className="flex-1 rounded-l-full border px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 text-gray-900"
      />
      <PrimaryButton type="submit" ariaLabel="Abonnieren" className="rounded-r-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2">
        Abonnieren
      </PrimaryButton>
    </form>
  );
}


