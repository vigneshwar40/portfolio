import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Loader from "@/components/portfolio/Loader";
import AdminPanel from "@/components/portfolio/AdminPanel";
import AdminPasscodeDialog from "@/components/portfolio/AdminPasscodeDialog";
import SectionErrorBoundary from "@/components/portfolio/SectionErrorBoundary";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);
  const {
    isAuthenticated,
    showPasscodeDialog,
    setShowPasscodeDialog,
    adminOpen,
    setAdminOpen,
    verifyPasscode,
    handleLogoClick,
    signOut,
  } = useAdminAuth();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={handleComplete} />}
      </AnimatePresence>

      {!loading && (
        <>
          <SectionErrorBoundary name="Navbar">
            <Navbar onLogoClick={handleLogoClick} />
          </SectionErrorBoundary>
          <main>
            <SectionErrorBoundary name="Hero">
              <HeroSection />
            </SectionErrorBoundary>
            <SectionErrorBoundary name="About">
              <AboutSection />
            </SectionErrorBoundary>
            <SectionErrorBoundary name="Projects">
              <ProjectsSection />
            </SectionErrorBoundary>
            <SectionErrorBoundary name="Skills">
              <SkillsSection />
            </SectionErrorBoundary>
            <SectionErrorBoundary name="Contact">
              <ContactSection />
            </SectionErrorBoundary>
          </main>

          <AdminPasscodeDialog
            open={showPasscodeDialog}
            onClose={() => setShowPasscodeDialog(false)}
            onVerify={verifyPasscode}
          />

          {isAuthenticated && (
            <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} onSignOut={signOut} />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
