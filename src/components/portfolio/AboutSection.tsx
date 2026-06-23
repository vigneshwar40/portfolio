import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User } from "lucide-react";
import { usePortfolioRead } from "@/hooks/usePortfolioData";

const defaultPhoto = "/placeholder.svg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { about, site, profilePhoto, aboutPhoto } = usePortfolioRead();
  const photo = aboutPhoto || profilePhoto || defaultPhoto;

  return (
    <section id="about" className="section-surface section-density-2 py-28 md:py-32">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16"
        >
          {/* Rectangular image with curved edges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mx-auto w-full max-w-xs md:mx-0"
          >
            <div className="relative">
              <div
                className="overflow-hidden border border-border/60 bg-secondary/30 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.6)]"
                style={{ borderRadius: "1.5rem", aspectRatio: "4/5" }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={site.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* Decorative offset frame */}
              <div
                className="pointer-events-none absolute -inset-2 border border-primary/15"
                style={{ borderRadius: "2rem" }}
              />
              {/* Corner accent */}
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
                style={{ borderRadius: "1.5rem" }}
              />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="text-center md:text-left">
            <p className="mb-4 font-body text-sm uppercase tracking-widest text-primary">About Me</p>
            <h2 className="mb-8 font-display text-4xl font-bold leading-tight md:text-5xl">
              {about.heading}{" "}
              <span className="text-gradient">{about.headingHighlight}</span>
            </h2>

            <div className="space-y-6">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
