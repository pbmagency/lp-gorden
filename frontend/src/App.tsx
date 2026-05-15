import UrgencyBanner from './components/sections/UrgencyBanner';
import Navbar from './components/sections/Navbar';
import HeroSection from './components/sections/HeroSection';
import AgitationSection from './components/sections/AgitationSection';
import ValueSection from './components/sections/ValueSection';
import MediaCoverageSection from './components/sections/MediaCoverageSection';
import SocialProofSection from './components/sections/SocialProofSection';
import PricingSection from './components/sections/PricingSection';
import FAQSection from './components/sections/FAQSection';
import Footer from './components/sections/Footer';

export default function App() {
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <UrgencyBanner />
      <Navbar />
      <main>
        <HeroSection />
        <AgitationSection />
        <ValueSection />
        <MediaCoverageSection />
        <SocialProofSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
