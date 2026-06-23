import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { applyTheme, applyTemplate, BUILT_IN_THEMES, BUILT_IN_TEMPLATES } from "@/hooks/usePortfolioData";

const App = () => {
  useEffect(() => {
    // Restore theme
    try {
      const saved = localStorage.getItem("portfolio_theme");
      const custom = JSON.parse(localStorage.getItem("portfolio_custom_themes")||"[]");
      const all = [...BUILT_IN_THEMES, ...custom];
      const t = saved ? JSON.parse(saved) : null;
      applyTheme(t ? (all.find(x=>x.id===t.id)||t) : BUILT_IN_THEMES[0]);
    } catch { applyTheme(BUILT_IN_THEMES[0]); }

    // Restore template
    try {
      const saved = localStorage.getItem("portfolio_template");
      const custom = JSON.parse(localStorage.getItem("portfolio_custom_templates")||"[]");
      const all = [...BUILT_IN_TEMPLATES, ...custom];
      const t = saved ? JSON.parse(saved) : null;
      applyTemplate(t ? (all.find(x=>x.id===t.id)||t) : BUILT_IN_TEMPLATES[0]);
    } catch { applyTemplate(BUILT_IN_TEMPLATES[0]); }
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
