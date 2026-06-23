import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { usePortfolioRead, useTemplate } from "@/hooks/usePortfolioData";

type Project = { title: string; category: string; description: string; color: string; url: string; image: string };

// ── Grid Card (Modern / Neon) ─────────────────────────────────────────────────
const GridCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.a ref={ref} href={project.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }} whileHover={{ y: -8 }} className="group block">
      <div className={`aspect-[16/10] rounded-[var(--radius)] overflow-hidden relative bg-gradient-to-br ${project.color} bg-secondary transition-all duration-500`}
        style={{ boxShadow: "none" }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 60px -12px hsl(var(--primary)/0.35)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
        {project.image
          ? <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl font-display font-bold text-foreground/5">{String(index+1).padStart(2,"0")}</span></div>}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/20">
          <ExternalLink className="w-5 h-5 text-foreground group-hover:text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-primary/70 text-xs tracking-widest uppercase mb-1">{project.category}</p>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300" />
        </div>
        <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
      </div>
    </motion.a>
  );
};

// ── List Card (Minimal) ───────────────────────────────────────────────────────
const ListCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.a ref={ref} href={project.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex items-center gap-6 border-b border-border py-7 hover:border-primary transition-colors duration-300">
      <span className="font-display text-4xl font-bold text-muted-foreground/20 group-hover:text-primary/30 transition-colors w-12 shrink-0">
        {String(index+1).padStart(2,"0")}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs tracking-widest uppercase text-primary/60 mb-1">{project.category}</p>
        <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">{project.title}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{project.description}</p>
      </div>
      {project.image && (
        <div className="h-16 w-24 rounded overflow-hidden shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}
      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </motion.a>
  );
};

// ── Magazine Card (Bold) ──────────────────────────────────────────────────────
const MagazineCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isFeatured = index === 0;
  return (
    <motion.a ref={ref} href={project.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative overflow-hidden bg-secondary ${isFeatured ? "md:col-span-2 aspect-[2/1]" : "aspect-[4/3]"}`}
      style={{ borderRadius: "var(--radius)" }}>
      {project.image
        ? <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 mb-3 uppercase tracking-wider">{project.category}</span>
        <h3 className={`font-display font-black text-white ${isFeatured ? "text-3xl md:text-5xl" : "text-xl"} leading-tight`}>{project.title}</h3>
        {isFeatured && <p className="text-white/70 mt-2 text-sm max-w-md">{project.description}</p>}
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.a>
  );
};

// ── Masonry Card (Elegant / Creative) ────────────────────────────────────────
const MasonryCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const heights = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[3/4]"];
  return (
    <motion.a ref={ref} href={project.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative overflow-hidden ${heights[index % heights.length]}`}
      style={{ borderRadius: "var(--radius)" }}>
      {project.image
        ? <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        : <div className={`absolute inset-0 bg-gradient-to-br ${project.color} bg-secondary`} />}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-end p-5">
        <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
          <p className="text-xs tracking-widest uppercase text-primary mb-1">{project.category}</p>
          <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
          <p className="text-white/70 text-xs mt-1 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </motion.a>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { projects } = usePortfolioRead();
  const { template } = useTemplate();
  const layout = template.projectLayout;

  const gridClass =
    layout === "list"     ? "mx-auto max-w-3xl" :
    layout === "magazine" ? "mx-auto max-w-5xl grid gap-4 md:grid-cols-2" :
    layout === "masonry"  ? "mx-auto max-w-5xl columns-2 md:columns-3 gap-4 space-y-4" :
    "mx-auto max-w-5xl grid gap-10 md:grid-cols-2";

  return (
    <section id="projects" className="section-surface section-density-1 py-28 md:py-32">
      <div className="section-inner">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className={`mb-16 ${layout === "list" ? "text-left max-w-3xl mx-auto" : "text-center"}`}>
            <p className="mb-4 font-body text-sm uppercase tracking-widest text-primary">Selected Work</p>
            <h2 className="font-display text-4xl font-bold md:text-6xl">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <div className={gridClass}>
            {projects.map((project, i) =>
              layout === "list"     ? <ListCard     key={i} project={project} index={i} /> :
              layout === "magazine" ? <MagazineCard key={i} project={project} index={i} /> :
              layout === "masonry"  ? <MasonryCard  key={i} project={project} index={i} /> :
                                     <GridCard      key={i} project={project} index={i} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
