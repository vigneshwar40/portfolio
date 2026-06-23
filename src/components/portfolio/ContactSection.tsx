import emailjs from "@emailjs/browser";
import { motion, useInView } from "framer-motion";
import { useRef, useState, type ElementType, type FormEvent } from "react";
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, X } from "lucide-react";
import { usePortfolioRead } from "@/hooks/usePortfolioData";

const iconMap: Record<string, ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Email: Mail,
};

export const buildMailtoHref = (
  email: string,
  subject = "Let\'s work together",
  body = "Hi, I came across your portfolio and would love to connect."
) => {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${email}?${params.toString()}`;
};

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { socials, site } = usePortfolioRead();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSayHello = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSubmitStatus("idle");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Email service is not configured.");
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
          to_email: site.email,
        },
        publicKey
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setIsFormOpen(false);
        setSubmitStatus("idle");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-surface section-density-2 py-28 md:py-32">
      <div className="section-inner">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-primary font-body text-sm tracking-widest uppercase mb-4">Get In Touch</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Let's work{" "}
            <span className="text-gradient">together</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-12">
            Have a project in mind? Let's create something extraordinary.
          </p>

          <motion.a
            href="#contact-form"
            onClick={handleSayHello}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg glow"
          >
            Say Hello
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>

          <div className="flex justify-center gap-4 mt-16">
            {socials.map((social, i) => {
              const Icon = iconMap[social.platform] || Mail;
              return (
                <motion.a
                  key={`${social.platform}-${i}`}
                  href={social.href}
                  target={social.platform !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  className="w-12 h-12 rounded-full border border-border bg-secondary/50 flex items-center justify-center transition-all duration-300"
                  onMouseEnter={(e) => {
                    (e.currentTarget.querySelector("svg") as SVGElement)?.setAttribute("style", `color: ${social.color}`);
                    e.currentTarget.style.borderColor = social.color + "80";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget.querySelector("svg") as SVGElement)?.setAttribute("style", "");
                    e.currentTarget.style.borderColor = "";
                  }}
                  aria-label={social.platform}
                >
                  <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-300" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setIsFormOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close contact form"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-2 text-2xl font-semibold">Send a message</h3>
            <p className="mb-6 text-sm text-muted-foreground">Tell me a bit about your project and I’ll reach out soon.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none ring-0 transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none ring-0 transition focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none ring-0 transition focus:border-primary"
                />
              </div>
              {submitStatus === "success" && (
                <p className="text-sm text-emerald-500">Message sent successfully.</p>
              )}
              {submitStatus === "error" && (
                <p className="text-sm text-red-500">Something went wrong. Please try again later.</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <div className="section-inner mt-32">
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} All rights reserved.</p>
          <p className="text-muted-foreground text-sm">Designed & Built with passion</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
