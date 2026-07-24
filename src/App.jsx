import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { useContent } from "./ContentContext";

export default function App() {
  const { sections } = useContent();
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-cream overflow-x-hidden">
        {/* Fixed moody atmosphere background */}
        <div className="bg-atmosphere" aria-hidden="true" />

        {/* Film grain texture */}
        <div className="grain" aria-hidden="true" />

        <Navbar />

        <main className="relative z-10">
          <HeroSection />
          {sections.portfolio && <PortfolioSection />}
          {sections.services && <ServicesSection />}
          {sections.process && <ProcessSection />}
          {sections.about && <AboutSection />}
          {sections.contact && <ContactSection />}
        </main>

        <Footer />

        <WhatsAppFloat />
      </div>
    </MotionConfig>
  );
}
