import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RotateCcw, Upload, Plus, Trash2, LogOut, Palette, Sun, Moon, Download, Layout, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioData, useTheme, useTemplate, BUILT_IN_THEMES, BUILT_IN_TEMPLATES, PortfolioTheme, PortfolioTemplate, applyTheme, applyTemplate } from "@/hooks/usePortfolioData";
import { toast } from "sonner";

type Tab = "general" | "projects" | "skills" | "socials" | "templates" | "theme";

interface AdminPanelProps { open: boolean; onOpenChange: (o: boolean) => void; onSignOut: () => void; }

const AdminPanel = ({ open, onOpenChange, onSignOut }: AdminPanelProps) => {
  const [tab, setTab] = useState<Tab>("general");
  const { data, save, reset } = usePortfolioData();
  const { theme, setTheme } = useTheme();
  const { template, setTemplate } = useTemplate();
  const [form, setForm] = useState(data);
  const [customThemes, setCustomThemes] = useState<PortfolioTheme[]>(() => { try { return JSON.parse(localStorage.getItem("portfolio_custom_themes")||"[]"); } catch { return []; } });
  const [customTemplates, setCustomTemplates] = useState<PortfolioTemplate[]>(() => { try { return JSON.parse(localStorage.getItem("portfolio_custom_templates")||"[]"); } catch { return []; } });
  const themeFileRef = useRef<HTMLInputElement>(null);
  const tmplFileRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setForm(data); }, [open, data]);

  const handleSave = () => {
  save({
    ...form,
    theme,
    template,
  });

  toast.success("Portfolio updated!");
  onOpenChange(false);
};
  const handleReset = () => { reset(); setForm(data); toast.info("Reset to defaults"); onOpenChange(false); };

  const handlePhoto = (key: "profilePhoto"|"aboutPhoto") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setForm({ ...form, [key]: ev.target?.result as string });
    r.readAsDataURL(f); e.target.value = "";
  };

  // Theme import/export
  const importTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const p = JSON.parse(ev.target?.result as string);
        if (!p.id||!p.name||!p.mode||!p.colors) { toast.error("Invalid theme file"); return; }
        const t: PortfolioTheme = { id:p.id, name:p.name, mode:p.mode==="light"?"light":"dark", colors:{ primary:p.colors.primary||"45 100% 58%", accent:p.colors.accent||"340 82% 58%", background:p.colors.background||"0 0% 4%", card:p.colors.card||"0 0% 8%", foreground:p.colors.foreground||"60 10% 92%" } };
        const u = [...customThemes.filter(x=>x.id!==t.id), t];
        setCustomThemes(u); localStorage.setItem("portfolio_custom_themes", JSON.stringify(u));
        toast.success(`Theme "${t.name}" imported!`);
      } catch { toast.error("Failed to parse theme"); }
    };
    r.readAsText(f); e.target.value="";
  };
  const exportTheme = (t: PortfolioTheme) => dl(t, `theme-${t.id}.json`);
  const deleteTheme = (id: string) => {
    const u = customThemes.filter(t=>t.id!==id);
    setCustomThemes(u); localStorage.setItem("portfolio_custom_themes", JSON.stringify(u));
    if (theme.id===id) setTheme(BUILT_IN_THEMES[0]);
    toast.info("Theme removed");
  };

  // Template import/export
  const importTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const p = JSON.parse(ev.target?.result as string);
        if (!p.id||!p.name) { toast.error("Invalid template file"); return; }
        const base = BUILT_IN_TEMPLATES[0];
        const t: PortfolioTemplate = { ...base, ...p };
        const u = [...customTemplates.filter(x=>x.id!==t.id), t];
        setCustomTemplates(u); localStorage.setItem("portfolio_custom_templates", JSON.stringify(u));
        toast.success(`Template "${t.name}" imported!`);
      } catch { toast.error("Failed to parse template"); }
    };
    r.readAsText(f); e.target.value="";
  };
  const exportTemplate = (t: PortfolioTemplate) => dl(t, `template-${t.id}.json`);
  const deleteTemplate = (id: string) => {
    const u = customTemplates.filter(t=>t.id!==id);
    setCustomTemplates(u); localStorage.setItem("portfolio_custom_templates", JSON.stringify(u));
    if (template.id===id) setTemplate(BUILT_IN_TEMPLATES[0]);
    toast.info("Template removed");
  };

  const dl = (obj: object, name: string) => { const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:"application/json"})),download:name});a.click(); };

  const allThemes    = [...BUILT_IN_THEMES, ...customThemes];
  const allTemplates = [...BUILT_IN_TEMPLATES, ...customTemplates];
  const tabs: {id:Tab;label:string}[] = [
    {id:"general",label:"General"},{id:"projects",label:"Projects"},{id:"skills",label:"Skills"},
    {id:"socials",label:"Socials"},{id:"templates",label:"Templates"},{id:"theme",label:"Theme"},
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm" onClick={()=>onOpenChange(false)} />
          <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:25,stiffness:200}}
            className="fixed bottom-0 right-0 top-0 z-[80] w-full max-w-lg overflow-y-auto border-l border-border bg-card">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Edit Portfolio</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Creator-only panel</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={onSignOut} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Sign out"><LogOut className="h-5 w-5"/></button>
                  <button type="button" onClick={()=>onOpenChange(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5"/></button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                {tabs.map(t=>(
                  <button key={t.id} type="button" onClick={()=>setTab(t.id)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab===t.id?"bg-primary text-primary-foreground":"bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── GENERAL ── */}
              {tab==="general" && (
                <div className="space-y-4">
                  <PhotoUpload label="Hero Photo (circle)" shape="circle" src={form.profilePhoto} onUpload={handlePhoto("profilePhoto")} onRemove={()=>setForm({...form,profilePhoto:""})} />
                  <PhotoUpload label="About Me Photo (card)" shape="rect" src={form.aboutPhoto} hint="Leave empty to reuse hero photo." onUpload={handlePhoto("aboutPhoto")} onRemove={()=>setForm({...form,aboutPhoto:""})} />
                  <div className="border-t border-border pt-4 space-y-3">
                    <Field label="Display Name" value={form.site.name} onChange={v=>setForm({...form,site:{...form.site,name:v}})} />
                    <Field label="Full Name"     value={form.site.fullName} onChange={v=>setForm({...form,site:{...form.site,fullName:v}})} />
                    <Field label="Title"         value={form.site.title} onChange={v=>setForm({...form,site:{...form.site,title:v}})} />
                    <Field label="Email"         value={form.site.email} onChange={v=>setForm({...form,site:{...form.site,email:v}})} />
                    <Field label="Tagline"       value={form.site.tagline} multiline onChange={v=>setForm({...form,site:{...form.site,tagline:v}})} />
                    <Field label="Resume URL"    value={form.site.resumeUrl} onChange={v=>setForm({...form,site:{...form.site,resumeUrl:v}})} />
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="mb-2 text-sm font-medium text-foreground">Hero Lines</p>
                    {form.hero.lines.map((line,i)=>(
                      <Field key={i} label={`Line ${i+1}`} value={line} onChange={v=>{ const l=[...form.hero.lines];l[i]=v;setForm({...form,hero:{...form.hero,lines:l}}); }} />
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="mb-2 text-sm font-medium text-foreground">About Section</p>
                    <Field label="Heading"        value={form.about.heading} onChange={v=>setForm({...form,about:{...form.about,heading:v}})} />
                    <Field label="Highlight Word" value={form.about.headingHighlight} onChange={v=>setForm({...form,about:{...form.about,headingHighlight:v}})} />
                    {form.about.paragraphs.map((p,i)=>(
                      <Field key={i} label={`Paragraph ${i+1}`} value={p} multiline onChange={v=>{ const ps=[...form.about.paragraphs];ps[i]=v;setForm({...form,about:{...form.about,paragraphs:ps}}); }} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── PROJECTS ── */}
              {tab==="projects" && (
                <div className="space-y-6">
                  {form.projects.map((p,i)=>(
                    <div key={i} className="relative space-y-3 rounded-lg bg-secondary/50 p-4">
                      <button type="button" onClick={()=>setForm({...form,projects:form.projects.filter((_,j)=>j!==i)})} className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button>
                      <Field label="Title"       value={p.title}       onChange={v=>{const a=[...form.projects];a[i]={...a[i],title:v};setForm({...form,projects:a});}} />
                      <Field label="Category"    value={p.category}    onChange={v=>{const a=[...form.projects];a[i]={...a[i],category:v};setForm({...form,projects:a});}} />
                      <Field label="Description" value={p.description} multiline onChange={v=>{const a=[...form.projects];a[i]={...a[i],description:v};setForm({...form,projects:a});}} />
                      <Field label="URL"         value={p.url}         onChange={v=>{const a=[...form.projects];a[i]={...a[i],url:v};setForm({...form,projects:a});}} />
                    </div>
                  ))}
                  <Button variant="outline" onClick={()=>setForm({...form,projects:[...form.projects,{title:"New Project",category:"Category",description:"Description",color:"from-primary/20 to-accent/10",url:"",image:""}]})} className="w-full gap-2">
                    <Plus className="h-4 w-4"/> Add Project
                  </Button>
                </div>
              )}

              {/* ── SKILLS ── */}
              {tab==="skills" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((s,i)=>(
                      <div key={i} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                        {s}
                        {form.skills.length>1&&<button type="button" onClick={()=>setForm({...form,skills:form.skills.filter((_,j)=>j!==i)})} className="ml-1 text-muted-foreground hover:text-destructive"><X className="h-3 w-3"/></button>}
                      </div>
                    ))}
                  </div>
                  <input placeholder="Add skill (press Enter)..." className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                    onKeyDown={e=>{ if(e.key==="Enter"&&e.currentTarget.value.trim()){setForm({...form,skills:[...form.skills,e.currentTarget.value.trim()]});e.currentTarget.value="";} }} />
                </div>
              )}

              {/* ── SOCIALS ── */}
              {tab==="socials" && (
                <div className="space-y-4">
                  {form.socials.map((s,i)=>(
                    <div key={i} className="relative space-y-3 rounded-lg bg-secondary/50 p-4">
                      <button type="button" onClick={()=>setForm({...form,socials:form.socials.filter((_,j)=>j!==i)})} className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4"/></button>
                      <Field label="Platform" value={s.platform} onChange={v=>{const a=[...form.socials];a[i]={...a[i],platform:v};setForm({...form,socials:a});}} />
                      <Field label="URL"      value={s.href}     onChange={v=>{const a=[...form.socials];a[i]={...a[i],href:v};setForm({...form,socials:a});}} />
                      <Field label="Color"    value={s.color}    onChange={v=>{const a=[...form.socials];a[i]={...a[i],color:v};setForm({...form,socials:a});}} />
                    </div>
                  ))}
                  <Button variant="outline" onClick={()=>setForm({...form,socials:[...form.socials,{platform:"New",href:"",color:"#ffffff"}]})} className="w-full gap-2">
                    <Plus className="h-4 w-4"/> Add Social
                  </Button>
                </div>
              )}

              {/* ── TEMPLATES ── */}
              {tab==="templates" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2"><Layout className="h-4 w-4"/>Site Templates</p>
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary/80">
                      <Upload className="h-3.5 w-3.5"/> Import
                      <input ref={tmplFileRef} type="file" accept=".json" className="hidden" onChange={importTemplate}/>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">Templates change hero layout, nav style, project cards, fonts and more. Your content stays the same.</p>
                  <div className="space-y-3">
                    {allTemplates.map(t=>(
                      <TemplateCard key={t.id} tmpl={t} active={template.id===t.id}
                        onSelect={()=>{ setTemplate(t); toast.success(`"${t.name}" applied!`); }}
                        onExport={()=>exportTemplate(t)}
                        onDelete={customTemplates.find(c=>c.id===t.id)?()=>deleteTemplate(t.id):undefined} />
                    ))}
                  </div>
                  <details className="rounded-lg border border-border/60 bg-secondary/20 p-4">
                    <summary className="cursor-pointer text-sm font-medium text-foreground">Custom Template Schema</summary>
                    <pre className="mt-3 overflow-x-auto rounded bg-background p-3 text-xs text-muted-foreground">{`{
  "id": "my-template",
  "name": "My Template",
  "description": "What it looks like",
  "preview": "🚀",
  "heroLayout": "split",       // split | centered | fullscreen
  "projectLayout": "grid",     // grid | list | magazine | masonry
  "navVariant": "glass",       // glass | minimal | bold-bar
  "accentStyle": "gradient",   // gradient | solid | outline | neon
  "borderRadius": "xl",        // none | sm | lg | xl
  "fontDisplay": "syne"        // syne | inter | playfair | mono
}`}</pre>
                  </details>
                </div>
              )}

              {/* ── THEME ── */}
              {tab==="theme" && (
                <div className="space-y-6">
                  {/* Quick toggle */}
                  <div className="flex gap-2">
                    <button type="button" onClick={()=>setTheme(BUILT_IN_THEMES.find(t=>t.id==="dark-gold")!)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium border transition-colors ${theme.mode==="dark"?"border-primary bg-primary/10 text-primary":"border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      <Moon className="h-4 w-4"/> Dark
                    </button>
                    <button type="button" onClick={()=>setTheme(BUILT_IN_THEMES.find(t=>t.id==="light-clean")!)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium border transition-colors ${theme.mode==="light"?"border-primary bg-primary/10 text-primary":"border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      <Sun className="h-4 w-4"/> Light
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2"><Palette className="h-4 w-4"/>Color Palettes</p>
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary/80">
                      <Upload className="h-3.5 w-3.5"/> Import
                      <input ref={themeFileRef} type="file" accept=".json" className="hidden" onChange={importTheme}/>
                    </label>
                  </div>

                  <div>
                    <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Moon className="h-3 w-3"/>Dark</p>
                    <div className="grid grid-cols-2 gap-3">
                      {allThemes.filter(t=>t.mode==="dark").map(t=>(
                        <ThemeCard key={t.id} theme={t} active={theme.id===t.id} onSelect={()=>setTheme(t)} onExport={()=>exportTheme(t)} onDelete={customThemes.find(c=>c.id===t.id)?()=>deleteTheme(t.id):undefined}/>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Sun className="h-3 w-3"/>Light</p>
                    <div className="grid grid-cols-2 gap-3">
                      {allThemes.filter(t=>t.mode==="light").map(t=>(
                        <ThemeCard key={t.id} theme={t} active={theme.id===t.id} onSelect={()=>setTheme(t)} onExport={()=>exportTheme(t)} onDelete={customThemes.find(c=>c.id===t.id)?()=>deleteTheme(t.id):undefined}/>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3 border-t border-border pt-6">
                <Button onClick={handleSave} className="flex-1 gap-2"><Save className="h-4 w-4"/>Save Changes</Button>
                <Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────
const PhotoUpload = ({label,shape,src,hint,onUpload,onRemove}:{label:string;shape:"circle"|"rect";src:string;hint?:string;onUpload:(e:React.ChangeEvent<HTMLInputElement>)=>void;onRemove:()=>void;}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
    {hint&&<p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
    <div className="flex flex-wrap items-center gap-3">
      {src&&<img src={src} alt={label} className={`h-14 w-14 border border-border object-cover ${shape==="circle"?"rounded-full":"rounded-xl"}`}/>}
      <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground hover:bg-secondary/80">
        <Upload className="h-4 w-4"/>Upload<input type="file" accept="image/*" className="hidden" onChange={onUpload}/>
      </label>
      {src&&<button type="button" onClick={onRemove} className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/20"><Trash2 className="h-4 w-4"/>Remove</button>}
    </div>
  </div>
);

const TemplateCard = ({tmpl,active,onSelect,onExport,onDelete}:{tmpl:PortfolioTemplate;active:boolean;onSelect:()=>void;onExport:()=>void;onDelete?:()=>void;}) => (
  <div onClick={onSelect} className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/60 ${active?"border-primary bg-primary/5":"border-border/40 bg-secondary/20"}`}>
    <div className="flex items-start gap-3">
      <span className="text-2xl leading-none">{tmpl.preview}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground">{tmpl.name}</p>
          {active&&<span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary font-medium"><Check className="h-2.5 w-2.5"/>Active</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{tmpl.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {[tmpl.heroLayout, tmpl.projectLayout, tmpl.navVariant, tmpl.fontDisplay].map(tag=>(
            <span key={tag} className="rounded bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/60">{tag}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-3 flex gap-2" onClick={e=>e.stopPropagation()}>
      <button type="button" onClick={onExport} className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-secondary hover:bg-secondary/60 text-muted-foreground"><Download className="h-3 w-3"/>Export</button>
      {onDelete&&<button type="button" onClick={onDelete} className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive"><Trash2 className="h-3 w-3"/>Delete</button>}
    </div>
  </div>
);

const ThemeCard = ({theme,active,onSelect,onExport,onDelete}:{theme:PortfolioTheme;active:boolean;onSelect:()=>void;onExport:()=>void;onDelete?:()=>void;}) => (
  <div onClick={onSelect} className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${active?"border-primary":"border-border/40 hover:border-border"}`} style={{background:`hsl(${theme.colors.background})`}}>
    <div className="flex gap-1.5 mb-2">
      {[theme.colors.primary,theme.colors.accent,theme.colors.card].map((c,i)=><div key={i} className="h-3 w-3 rounded-full" style={{background:`hsl(${c})`}}/>)}
    </div>
    <p className="text-xs font-medium truncate" style={{color:`hsl(${theme.colors.foreground})`}}>{theme.name}</p>
    {active&&<div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"/>}
    <div className="mt-2 flex gap-1" onClick={e=>e.stopPropagation()}>
      <button type="button" onClick={onExport} className="rounded px-1.5 py-0.5 text-[10px] bg-black/20 hover:bg-black/40 flex items-center gap-1" style={{color:`hsl(${theme.colors.foreground})`}}><Download className="h-2.5 w-2.5"/></button>
      {onDelete&&<button type="button" onClick={onDelete} className="rounded px-1.5 py-0.5 text-[10px] bg-destructive/20 hover:bg-destructive/40 text-destructive"><Trash2 className="h-2.5 w-2.5"/></button>}
    </div>
  </div>
);

const Field = ({label,value,onChange,multiline}:{label:string;value:string;onChange:(v:string)=>void;multiline?:boolean;}) => (
  <div className="mb-3">
    <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
    {multiline
      ?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"/>
      :<input value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"/>}
  </div>
);

export default AdminPanel;
