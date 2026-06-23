import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 15 + 5, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl md:text-8xl font-bold text-gradient mb-8"
        >
          {Math.min(Math.round(progress), 100)}%
        </motion.p>
        <div className="w-48 h-[2px] bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-hero)", width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm mt-4 tracking-widest uppercase"
        >
          Loading
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
