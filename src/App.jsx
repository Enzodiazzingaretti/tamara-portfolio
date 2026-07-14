import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SpecialtiesSection from "./components/SpecialtiesSection";
import PortfolioSection from "./components/PortfolioSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen text-plum overflow-x-hidden">
      {/* Fixed dusty-pink mesh background */}
      <div className="bg-mesh" aria-hidden="true" />

      {/* Rabbit Studio watermark */}
      <div className="rs-watermark" aria-hidden="true">
        R
      </div>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SpecialtiesSection />
        <PortfolioSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
