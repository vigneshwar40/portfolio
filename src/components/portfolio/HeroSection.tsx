import { motion } from "framer-motion";
import { ArrowDown, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioRead, useTemplate } from "@/hooks/usePortfolioData";

const defaultPhoto = "/placeholder.svg";

const HeroSection = () => {
  const { site, hero, profilePhoto } = usePortfolioRead();
  const { template } = useTemplate();
  const photo = profilePhoto || defaultPhoto;

  // PROPER fix: allow wrapping, scale font based on longest line chars
  const maxLen = Math.max(...hero.lines.map(l => l.length));
  // More chars = smaller font. Tight clamp: never truncates.
  const baseFontSize =
    maxLen <= 6  ? "clamp(3rem, 9vw, 5.5rem)"  :
    maxLen <= 10 ? "clamp(2.5rem, 7vw, 4.5rem)" :
    maxLen <= 14 ? "clamp(2rem, 5.5vw, 3.5rem)" :
    maxLen <= 18 ? "clamp(1.7rem, 4.5vw, 3rem)"  :
    maxLen <= 22 ? "clamp(1.5rem, 3.8vw, 2.6rem)" :
                   "clamp(1.3rem, 3.2vw, 2.2rem)";

  if (template.heroLayout === "centered") return <HeroCentered site={site} hero={hero} photo={photo} fontSize={baseFontSize} />;
  if (template.heroLayout === "fullscreen") return <HeroFullscreen site={site} hero={hero} photo={photo} fontSize={baseFontSize} />;
  return <HeroSplit site={site} hero={hero} photo={photo} fontSize={baseFontSize} />;
};

// ── Split layout (default) ────────────────────────────────────────────────────
const HeroSplit = ({ site, hero, photo, fontSize }: any) => (
  <section className="section-surface section-density-1 relative flex min-h-screen items-center justify-center py-24">
    <div className="section-inner relative">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="order-2 min-w-0 text-center md:order-1 md:text-left">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="mb-4 font-body text-base uppercase tracking-widest text-primary">{site.title}</motion.p>
          <h1 className="mb-8 font-display font-extrabold" style={{ lineHeight: 1.05 }}>
            {hero.lines.map((line: string, i: number) => (
              <motion.span key={i} className={`block break-words ${i === 1 ? "text-gradient" : "text-foreground"}`}
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
                style={{ fontSize }}>{line}</motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">{site.tagline}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="mt-8 flex justify-center md:justify-start">
            <Button asChild size="lg" className="gap-2 font-semibold">
              <a href={site.resumeUrl} download><Download className="h-4 w-4" />Download Resume</a>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.9 }}
          className="order-1 flex justify-center md:order-2 md:justify-end">
          <div className="relative">
            <motion.div className="h-56 w-56 overflow-hidden rounded-full border-2 border-primary/30 glow sm:h-64 sm:w-64 md:h-72 md:w-72"
              whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              {photo ? <img src={photo} alt={site.fullName} className="h-full w-full object-cover" /> :
                <div className="flex h-full w-full items-center justify-center bg-secondary"><User className="h-20 w-20 text-muted-foreground" /></div>}
            </motion.div>
            <div className="absolute -inset-3 rounded-full border border-primary/10" />
          </div>
        </motion.div>
      </div>
      <ScrollArrow />
    </div>
  </section>
);

// ── Centered layout ────────────────────────────────────────────────────────────
const HeroCentered = ({ site, hero, photo, fontSize }: any) => (
  <section className="section-surface section-density-1 relative flex min-h-screen flex-col items-center justify-center py-24 text-center">
    <div className="section-inner relative flex flex-col items-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
        className="mb-8 h-28 w-28 overflow-hidden rounded-full border-2 border-primary/30 glow">
        {photo ? <img src={photo} alt={site.fullName} className="h-full w-full object-cover" /> :
          <div className="flex h-full w-full items-center justify-center bg-secondary"><User className="h-12 w-12 text-muted-foreground" /></div>}
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mb-3 font-body text-sm uppercase tracking-widest text-primary">{site.title}</motion.p>
      <h1 className="mb-6 font-display font-extrabold" style={{ lineHeight: 1.05 }}>
        {hero.lines.map((line: string, i: number) => (
          <motion.span key={i} className={`block break-words ${i === 1 ? "text-gradient" : "text-foreground"}`}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            style={{ fontSize }}>{line}</motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{site.tagline}</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex gap-4">
        <Button asChild size="lg" className="gap-2 font-semibold">
          <a href={site.resumeUrl} download><Download className="h-4 w-4" />Download Resume</a>
        </Button>
      </motion.div>
    </div>
    <ScrollArrow />
  </section>
);

// ── Fullscreen layout ─────────────────────────────────────────────────────────
const HeroFullscreen = ({ site, hero, photo, fontSize }: any) => (
  <section className="relative flex min-h-screen items-end overflow-hidden">
    {/* Full-bleed bg image */}
    <div className="absolute inset-0">
      {photo ? <img src={photo} alt={site.fullName} className="h-full w-full object-cover object-top" /> :
        <div className="h-full w-full bg-secondary" />}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
    </div>
    <div className="section-inner relative z-10 pb-24 pt-32">
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="mb-3 font-body text-sm uppercase tracking-widest text-primary">{site.title}</motion.p>
      <h1 className="mb-6 font-display font-extrabold max-w-3xl" style={{ lineHeight: 1 }}>
        {hero.lines.map((line: string, i: number) => (
          <motion.span key={i} className={`block break-words ${i === 1 ? "text-gradient" : "text-foreground"}`}
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            style={{ fontSize }}>{line}</motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mb-8 max-w-lg text-lg text-muted-foreground">{site.tagline}</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <Button asChild size="lg" className="gap-2 font-semibold">
          <a href={site.resumeUrl} download><Download className="h-4 w-4" />Download Resume</a>
        </Button>
      </motion.div>
    </div>
    <ScrollArrow />
  </section>
);

const ScrollArrow = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2">
    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <ArrowDown className="h-6 w-6 text-muted-foreground" />
    </motion.div>
  </motion.div>
);

export default HeroSection;
