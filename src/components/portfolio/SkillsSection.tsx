import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { usePortfolioRead } from "@/hooks/usePortfolioData";
import SkillsLogoSphere from "./SkillsLogoSphere";

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { skills } = usePortfolioRead();
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="section-surface section-density-2 py-28 md:py-32">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-14 text-center">
            <p className="mb-4 font-body text-sm uppercase tracking-widest text-primary">Expertise</p>
            <h2 className="font-display text-4xl font-bold md:text-6xl">
              Skills & <span className="text-gradient">Tools</span>
            </h2>
          </div>

          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No skills added yet. Add some from the admin panel.
            </p>
          ) : (
            <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="space-y-1"
              >
                {skills.map((skill, index) => (
                  <motion.button
                    key={skill}
                    type="button"
                    onMouseEnter={() => setHighlightedSkill(skill)}
                    onMouseLeave={() => setHighlightedSkill(null)}
                    onFocus={() => setHighlightedSkill(skill)}
                    onBlur={() => setHighlightedSkill(null)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.25 + index * 0.05, duration: 0.5 }}
                    className={`flex w-full items-center gap-3 py-2 text-left transition-colors duration-300 ${
                      highlightedSkill === skill ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="font-display text-sm text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{skill}</span>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="flex items-center justify-center"
              >
                <SkillsLogoSphere highlightedSkill={highlightedSkill} />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
