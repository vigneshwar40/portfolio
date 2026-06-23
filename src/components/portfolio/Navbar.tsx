import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePortfolioRead, useTemplate } from "@/hooks/usePortfolioData";

interface NavbarProps { onLogoClick?: () => void; }

const Navbar = ({ onLogoClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { site, navLinks } = usePortfolioRead();
  const { template } = useTemplate();
  const v = template.navVariant;

  const navClass =
    v === "bold-bar"  ? "fixed left-0 right-0 top-0 z-50 bg-primary" :
    v === "minimal"   ? "fixed left-0 right-0 top-0 z-50 bg-transparent" :
    /* glass default */  "fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl";

  const logoClass =
    v === "bold-bar"  ? "font-display text-xl font-black text-primary-foreground tracking-tight" :
    v === "minimal"   ? "font-display text-xl font-light text-foreground tracking-widest uppercase" :
    "font-display text-xl font-bold text-gradient";

  const linkClass =
    v === "bold-bar"  ? "text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors" :
    v === "minimal"   ? "text-sm font-light tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" :
    "group relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-300";

  return (
    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={navClass}>
      <div className="section-inner flex h-16 items-center justify-between !py-0">
        <button type="button" onClick={onLogoClick} className={logoClass}>
          {v === "bold-bar" ? site.name.toUpperCase() : `${site.name}.`}
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
              {v === "glass" && <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />}
            </a>
          ))}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className={v === "bold-bar" ? "text-primary-foreground md:hidden" : "text-foreground md:hidden"} aria-label="Toggle menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className={`border-b border-border md:hidden ${v === "bold-bar" ? "bg-primary" : "bg-background/95 backdrop-blur-xl"}`}>
          <div className="section-inner flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${v === "bold-bar" ? "text-primary-foreground" : "text-foreground"}`}>{link.label}</a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
