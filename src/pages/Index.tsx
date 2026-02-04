import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollExpandHero from "@/components/ScrollExpandHero";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-50" />
      
      <Navbar />
      <main>
        <HeroSection />
        <ScrollExpandHero />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
