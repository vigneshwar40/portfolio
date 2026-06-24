import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  siteConfig as defaultSite, heroConfig as defaultHero, aboutConfig as defaultAbout,
  projectsConfig as defaultProjects, skillsConfig as defaultSkills,
  socialsConfig as defaultSocials, navLinks as defaultNavLinks,
} from "@/config/portfolio";

const STORAGE_KEY = "portfolio_data";
const THEME_KEY = "portfolio_theme";
const TEMPLATE_KEY = "portfolio_template";

// ─── Theme ────────────────────────────────────────────────────────────────────
export interface ThemeColors { primary: string; accent: string; background: string; card: string; foreground: string; }
export interface PortfolioTheme { id: string; name: string; mode: "dark" | "light"; colors: ThemeColors; }

export const BUILT_IN_THEMES: PortfolioTheme[] = [
  { id:"dark-gold",    name:"Dark Gold",    mode:"dark",  colors:{ primary:"45 100% 58%",  accent:"340 82% 58%", background:"0 0% 4%",    card:"0 0% 8%",     foreground:"60 10% 92%"  }},
  { id:"dark-cyan",    name:"Dark Cyan",    mode:"dark",  colors:{ primary:"185 100% 50%", accent:"270 80% 60%", background:"220 20% 4%",  card:"220 18% 8%",  foreground:"200 10% 92%" }},
  { id:"dark-rose",    name:"Dark Rose",    mode:"dark",  colors:{ primary:"340 82% 62%",  accent:"45 100% 58%", background:"340 10% 4%",  card:"340 8% 8%",   foreground:"30 10% 92%"  }},
  { id:"dark-emerald", name:"Dark Emerald", mode:"dark",  colors:{ primary:"155 60% 50%",  accent:"185 80% 50%", background:"155 15% 4%",  card:"155 12% 8%",  foreground:"120 10% 92%" }},
  { id:"dark-purple",  name:"Dark Purple",  mode:"dark",  colors:{ primary:"270 80% 65%",  accent:"210 90% 60%", background:"260 20% 4%",  card:"260 15% 8%",  foreground:"260 10% 92%" }},
  { id:"light-clean",  name:"Light Clean",  mode:"light", colors:{ primary:"45 100% 40%",  accent:"340 82% 50%", background:"0 0% 98%",    card:"0 0% 94%",    foreground:"0 0% 8%"     }},
  { id:"light-ocean",  name:"Light Ocean",  mode:"light", colors:{ primary:"210 90% 45%",  accent:"185 80% 40%", background:"210 30% 98%", card:"210 20% 94%", foreground:"220 20% 10%" }},
  { id:"light-forest", name:"Light Forest", mode:"light", colors:{ primary:"155 60% 35%",  accent:"45 90% 45%",  background:"120 10% 97%", card:"120 8% 93%",  foreground:"130 20% 8%"  }},
];

// ─── Template ─────────────────────────────────────────────────────────────────
export interface PortfolioTemplate {
  id: string; name: string; description: string; preview: string;
  heroLayout: "split" | "centered" | "fullscreen";
  projectLayout: "grid" | "list" | "masonry" | "magazine";
  navVariant: "glass" | "minimal" | "bold-bar" | "side";
  accentStyle: "gradient" | "solid" | "outline" | "neon";
  borderRadius: "none" | "sm" | "lg" | "xl";
  fontDisplay: "syne" | "inter" | "playfair" | "mono";
}

export const BUILT_IN_TEMPLATES: PortfolioTemplate[] = [
  { id:"modern",    name:"Modern Studio",    description:"Bold split hero, glass nav, gradient cards on dark grid",  preview:"🎬", heroLayout:"split",      projectLayout:"grid",     navVariant:"glass",     accentStyle:"gradient", borderRadius:"xl",   fontDisplay:"syne"     },
  { id:"minimal",   name:"Minimal Clean",    description:"Centered hero, slim top nav, list-style case studies",     preview:"◻️", heroLayout:"centered",   projectLayout:"list",     navVariant:"minimal",   accentStyle:"outline",  borderRadius:"sm",   fontDisplay:"inter"    },
  { id:"bold",      name:"Bold Impact",      description:"Fullscreen photo hero, bold bar nav, magazine layout",     preview:"⚡", heroLayout:"fullscreen",  projectLayout:"magazine", navVariant:"bold-bar",  accentStyle:"solid",    borderRadius:"none", fontDisplay:"syne"     },
  { id:"elegant",   name:"Elegant Portfolio",description:"Centered serif hero, minimal nav, masonry gallery",       preview:"✦",  heroLayout:"centered",   projectLayout:"masonry",  navVariant:"minimal",   accentStyle:"outline",  borderRadius:"lg",   fontDisplay:"playfair" },
  { id:"neon",      name:"Neon Industrial",  description:"Split hero with neon glow, bold bar nav, grid layout",    preview:"🌐", heroLayout:"split",      projectLayout:"grid",     navVariant:"bold-bar",  accentStyle:"neon",     borderRadius:"sm",   fontDisplay:"mono"     },
  { id:"creative",  name:"Creative Lab",     description:"Fullscreen hero, floating nav, masonry project grid",     preview:"🎨", heroLayout:"fullscreen",  projectLayout:"masonry",  navVariant:"glass",     accentStyle:"gradient", borderRadius:"xl",   fontDisplay:"syne"     },
];

export function applyTemplate(t: PortfolioTemplate) {
  const root = document.documentElement;
  root.setAttribute("data-template", t.id);
  root.setAttribute("data-hero-layout", t.heroLayout);
  root.setAttribute("data-project-layout", t.projectLayout);
  root.setAttribute("data-nav-variant", t.navVariant);
  root.setAttribute("data-accent", t.accentStyle);
  const rMap = { none:"0px", sm:"0.375rem", lg:"1rem", xl:"1.5rem" };
  root.style.setProperty("--radius", rMap[t.borderRadius]);
  const fMap = { syne:"'Syne',sans-serif", inter:"'Inter',sans-serif", playfair:"'Playfair Display',serif", mono:"'JetBrains Mono',monospace" };
  root.style.setProperty("--font-display", fMap[t.fontDisplay]);
  window.dispatchEvent(new CustomEvent("portfolio-template-updated", { detail: t }));
}

export function applyTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  const isLight = theme.mode === "light";
  root.setAttribute("data-theme-mode", theme.mode);
  const { background:bg, card, foreground:fg, primary, accent } = theme.colors;
  root.style.setProperty("--background", bg);  root.style.setProperty("--foreground", fg);
  root.style.setProperty("--card", card);       root.style.setProperty("--card-foreground", fg);
  root.style.setProperty("--popover", card);    root.style.setProperty("--popover-foreground", fg);
  root.style.setProperty("--primary", primary); root.style.setProperty("--primary-foreground", isLight?"0 0% 98%":"0 0% 4%");
  root.style.setProperty("--secondary", isLight?"0 0% 90%":"0 0% 12%");
  root.style.setProperty("--secondary-foreground", fg);
  root.style.setProperty("--muted", isLight?"0 0% 88%":"0 0% 14%");
  root.style.setProperty("--muted-foreground", isLight?"0 0% 40%":"0 0% 55%");
  root.style.setProperty("--accent", accent);   root.style.setProperty("--accent-foreground", fg);
  root.style.setProperty("--border", isLight?"0 0% 80%":"0 0% 16%");
  root.style.setProperty("--input",  isLight?"0 0% 80%":"0 0% 16%");
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--gradient-hero", `linear-gradient(135deg,hsl(${primary}) 0%,hsl(${accent}) 50%,hsl(270 80% 60%) 100%)`);
  root.style.setProperty("--shadow-glow",  `0 0 60px -12px hsl(${primary}/0.25)`);
  root.style.setProperty("--shadow-accent",`0 0 40px -8px hsl(${accent}/0.3)`);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setThemeState] = useState<PortfolioTheme>(() => {
    try { const r=localStorage.getItem(THEME_KEY); return r?JSON.parse(r):BUILT_IN_THEMES[0]; } catch { return BUILT_IN_THEMES[0]; }
  });
  useEffect(()=>{ applyTheme(theme); },[theme]);
  useEffect(()=>{
    const h=()=>{ try{const r=localStorage.getItem(THEME_KEY);if(r)setThemeState(JSON.parse(r));}catch{} };
    window.addEventListener("portfolio-theme-updated",h); return()=>window.removeEventListener("portfolio-theme-updated",h);
  },[]);
  const setTheme=useCallback((t:PortfolioTheme)=>{ localStorage.setItem(THEME_KEY,JSON.stringify(t));setThemeState(t);applyTheme(t);window.dispatchEvent(new Event("portfolio-theme-updated")); },[]);
  return {theme,setTheme};
}

export function useTemplate() {
  const [template, setTemplateState] = useState<PortfolioTemplate>(()=>{
    try {
      const r=localStorage.getItem(TEMPLATE_KEY); const ct=localStorage.getItem("portfolio_custom_templates");
      const all=[...BUILT_IN_TEMPLATES,...(ct?JSON.parse(ct):[])];
      if(r){const p=JSON.parse(r);const found=all.find(t=>t.id===p.id);return found?{...found,...p}:p;}
    } catch {}
    return BUILT_IN_TEMPLATES[0];
  });
  useEffect(()=>{ applyTemplate(template); },[template]);
  useEffect(()=>{
    const h=(e:Event)=>{ const d=(e as CustomEvent).detail;if(d)setTemplateState(d); };
    window.addEventListener("portfolio-template-updated",h); return()=>window.removeEventListener("portfolio-template-updated",h);
  },[]);
  const setTemplate=useCallback((t:PortfolioTemplate)=>{ localStorage.setItem(TEMPLATE_KEY,JSON.stringify(t));setTemplateState(t);applyTemplate(t); },[]);
  return {template,setTemplate};
}

// ─── Portfolio data ───────────────────────────────────────────────────────────
export interface PortfolioData {
  site:typeof defaultSite; hero:typeof defaultHero; about:typeof defaultAbout;
  projects:typeof defaultProjects; skills:typeof defaultSkills;
  socials:typeof defaultSocials; navLinks:typeof defaultNavLinks;
  profilePhoto:string; aboutPhoto:string;
}
function getDefaults():PortfolioData {
  return { site:{...defaultSite}, hero:{lines:[...defaultHero.lines]},
    about:{heading:defaultAbout.heading,headingHighlight:defaultAbout.headingHighlight,paragraphs:[...defaultAbout.paragraphs]},
    projects:defaultProjects.map(p=>({...p})), skills:[...defaultSkills],
    socials:defaultSocials.map(s=>({...s})), navLinks:defaultNavLinks.map(n=>({...n})),
    profilePhoto:"", aboutPhoto:"" };
}
function loadData():PortfolioData {
  try{ const r=localStorage.getItem(STORAGE_KEY);if(r)return{...getDefaults(),...JSON.parse(r)}; }catch{}
  return getDefaults();
}
export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(getDefaults());

  useEffect(() => {
    async function fetchData() {
      const { data: row } = await supabase
        .from("portfolio_data")
        .select("content")
        .eq("id", 1)
        .single();

      if (row?.content) {
        setData({
          ...getDefaults(),
          ...(row.content as PortfolioData),
        });
      }
    }

    fetchData();
  }, []);

  const save = useCallback(async (d: PortfolioData) => {
    setData(d);

    await supabase
      .from("portfolio_data")
      .update({
        content: d,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    window.dispatchEvent(new Event("portfolio-updated"));
  }, []);

  const reset = useCallback(async () => {
    const defaults = getDefaults();

    setData(defaults);

    await supabase
      .from("portfolio_data")
      .update({
        content: defaults,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    window.dispatchEvent(new Event("portfolio-updated"));
  }, []);

  return { data, save, reset };
}
export function usePortfolioRead() {
  const [data, setData] = useState<PortfolioData>(getDefaults());

  useEffect(() => {
    async function fetchData() {
      const { data: row, error } = await supabase
        .from("portfolio_data")
        .select("content")
        .eq("id", 1)
        .single();

      if (!error && row?.content) {
        setData({
          ...getDefaults(),
          ...(row.content as PortfolioData),
        });
      }
    }

    fetchData();
  }, []);

  return data;
}