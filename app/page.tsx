import Hero from '@/components/Hero';
import PricingTable from '@/components/PricingTable';
import IntegrationCards from '@/components/IntegrationCards';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-secondary-900 to-primary-900">
      <Header />
      <main>
        <Hero />
        <IntegrationCards />
        <PricingTable />
        <Testimonials />
        <About />
      </main>
      <Footer />
    </div>
  );
}
