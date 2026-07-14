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
    <div className="relative min-h-screen bg-ink text-ivory overflow-x-hidden">
      {/* RA watermark */}
      <div className="ra-watermark" aria-hidden="true">
        RA
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
