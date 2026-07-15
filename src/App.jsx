import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen text-cream overflow-x-hidden">
      {/* Fixed moody atmosphere background */}
      <div className="bg-atmosphere" aria-hidden="true" />

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <PortfolioSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
