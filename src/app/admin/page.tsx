"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowSquareOut,
  CaretDown,
  Check,
  Copy,
  Download,
  FloppyDisk,
  Globe,
  Plus,
  SignOut,
  Trash,
  Upload,
} from "@phosphor-icons/react";
import { usePortfolio } from "@/components/portfolio-provider";
import { TonePicker } from "@/components/color-field";
import { ImageUploadButton } from "@/components/image-upload";
import {
  cleanEmail,
  exportPortfolioTS,
  isValidEmail,
  newProjectId,
  slugifyTitle,
  type EducationItem,
  type ExperienceItem,
  type PrincipleItem,
  type ProjectItem,
  type SetupItem,
  type TechCategory,
} from "@/lib/portfolio-store";

type TabId =
  | "personal"
  | "projects"
  | "categories"
  | "principles"
  | "experience"
  | "education"
  | "workspace"
  | "gallery"
  | "colophon"
  | "data";

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: "personal", label: "Personal", hint: "01" },
  { id: "projects", label: "Projects", hint: "02" },
  { id: "categories", label: "Categories", hint: "03" },
  { id: "principles", label: "Principles", hint: "04" },
  { id: "experience", label: "Experience", hint: "05" },
  { id: "education", label: "Education", hint: "06" },
  { id: "workspace", label: "Workspace", hint: "07" },
  { id: "gallery", label: "Gallery", hint: "08" },
  { id: "colophon", label: "Colophon", hint: "09" },
  { id: "data", label: "Export", hint: "10" },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-[#616161]">
        <span>{label}</span>
        {hint && <span className="normal-case tracking-normal text-[#6B6B6B]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function textInputClass(mono = false): string {
  return `w-full rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] px-3 py-2 text-sm text-[#111111] placeholder:text-[#6B6B6B] outline-none transition-colors focus:border-[#111111] ${
    mono ? "font-mono text-[13px]" : "font-sans"
  }`;
}

function btnPrimaryClass(): string {
  return "inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3.5 py-2 font-mono text-xs text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98]";
}

function btnGhostClass(): string {
  return "inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-3.5 py-2 font-mono text-xs text-[#111111] transition-all hover:bg-[#F7F6F3] active:scale-[0.98]";
}

function btnDangerClass(): string {
  return "inline-flex items-center gap-1.5 rounded-[4px] border border-[#F3C2C4] bg-[#FDEBEC] px-3 py-2 font-mono text-xs text-[#9F2F2D] transition-all hover:bg-[#FAD9DB] active:scale-[0.98]";
}

/** Pintasan dari tab editor ke section live-nya di situs. */
function ViewSectionLink({ href }: { href: string }) {  return (
    <Link
      href={href}
      title={`Lihat ${href} di situs`}
      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-2.5 py-2 font-mono text-[11px] text-[#616161] transition-all hover:bg-[#F7F6F3] hover:text-[#111111] active:scale-[0.98]"
    >
      <span>{href}</span>
      <ArrowSquareOut size={12} weight="regular" />
    </Link>
  );
}

/** Preview live untuk logo slugs: yang valid tampil logonya, yang salah tampil merah. */
function LogoSlugPreview({ slugs }: { slugs: string[] }) {
  const [failed, setFailed] = useState<Record<string, true>>({});
  const list = slugs.map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (list.length === 0) {
    return <span className="font-mono text-[11px] text-[#6B6B6B]">Monogram</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {list.map((slug) =>
        failed[slug] ? (
          <span
            key={slug}
            className="rounded-[3px] border border-[#F3C2C4] bg-[#FDEBEC] px-1.5 py-0.5 font-mono text-[10px] text-[#9F2F2D]"
            title={`Slug "${slug}" tidak ditemukan`}
          >
            ? {slug}
          </span>
        ) : (
          <img
            key={slug}
            src={`https://cdn.simpleicons.org/${slug}`}
            alt={slug}
            title={slug}
            width={20}
            height={20}
            loading="lazy"
            className="h-5 w-5 rounded-[3px] border border-[#EAEAEA] bg-white p-[2px]"
            onError={() => setFailed((prev) => ({ ...prev, [slug]: true }))}
          />
        )
      )}
    </span>
  );
}

function StringListEditor({
  title,
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  title: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
        {title} · {items.length}
      </span>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <textarea
              value={item}
              rows={2}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
              className={`${textInputClass()} resize-y`}
            />
            <button
              type="button"
              aria-label={`Remove item ${idx + 1}`}
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#EAEAEA] text-[#616161] transition-colors hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
            >
              <Trash size={14} weight="regular" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])} className={btnGhostClass()}>
          <Plus size={13} weight="bold" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}

function emptyProject(): ProjectItem {
  const slug = `new-project-${Date.now().toString(36)}`;
  return {
    id: newProjectId(slug),
    slug,
    title: "Untitled Project",
    category: "New Category",
    summary: "One-sentence summary of what this project does and who it serves.",
    description: "Longer paragraph describing scope, constraints, and outcomes.",
    image: "/images/projects/pokemon-app.jpg",
    technicalHighlights: ["First technical highlight"],
    metrics: [{ label: "Status", value: "Draft" }],
    tags: ["Next.js", "TypeScript"],
    liveUrl: "",
    githubUrl: "",
    downloadUrl: "",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-7",
    badge: { text: "DRAFT ENTRY", variant: "amber" },
    caseStudy: {
      clientOrContext: "Personal Engineering Project",
      timeline: "2026",
      role: "Sole Software Engineer",
      challenge: "Describe the problem this project solves.",
      architectureSolution: "Describe the technical approach.",
      deliverables: ["First deliverable"],
      technicalDecisions: [{ title: "First decision", rationale: "Why this choice was made." }],
    },
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { data, update, setData, reset, hydrated, syncStatus, syncError, isGlobal, isAdmin, redisAvailable, refreshGlobal, pushGlobal } = usePortfolio();
  const [tab, setTab] = useState<TabId>("personal");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Scroll pengguna ke kartu yang baru dibuat + tandai sekilas. */
  const focusCard = (id: string) => {
    setFlashId(id);
    setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 2400);
    // Tunggu render berikutnya sebelum scroll agar elemen sudah ada di DOM.
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const projects = data.projects;
  const selectedProject: ProjectItem | null = useMemo(() => {
    if (projects.length === 0) return null;
    return projects.find((p) => p.id === selectedProjectId) ?? projects[0];
  }, [projects, selectedProjectId]);

  const selectedCategory: TechCategory | null = useMemo(() => {
    if (data.techCategories.length === 0) return null;
    const idx = Math.min(selectedCategoryIdx, data.techCategories.length - 1);
    return data.techCategories[idx];
  }, [data.techCategories, selectedCategoryIdx]);

  const patchProject = (id: string, fn: (p: ProjectItem) => ProjectItem) => {
    update((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? fn(p) : p)),
    }));
  };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setImportError("Clipboard blocked by the browser. Use Download instead.");
    }
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const ensureUniqueSlug = (base: string, exceptId?: string): string => {
    const taken = new Set(projects.filter((p) => p.id !== exceptId).map((p) => p.slug));
    if (!taken.has(base)) return base;
    let i = 2;
    while (taken.has(`${base}-${i}`)) i += 1;
    return `${base}-${i}`;
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (typeof parsed !== "object" || parsed === null || !("projects" in parsed)) {
        setImportError("File is not a portfolio export (missing projects key).");
        return;
      }
      setData(parsed as typeof data);
      setSelectedProjectId(null);
      setSelectedCategoryIdx(0);
    } catch {
      setImportError("Could not parse JSON. Make sure the file is a valid export.");
    }
  };

  const refreshTick = `${data.projects.length}:${data.techCategories.length}:${data.principles.length}:${data.experiences.length}:${data.education.length}:${data.gallery.length}:${data.workspaceSetup.length}`;
  const storageSize = useMemo(() => {
    if (!hydrated || typeof window === "undefined") return "—";
    try {
      const raw = window.localStorage.getItem("joshua-portfolio-v1") ?? "";
      return `${(raw.length / 1024).toFixed(1)} KB`;
    } catch {
      return "—";
    }
  }, [hydrated, refreshTick]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111]">
      <header className="sticky top-0 z-20 border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] transition-colors hover:bg-[#F7F6F3]"
              aria-label="Back to portfolio"
            >
              <ArrowLeft size={15} weight="bold" />
            </Link>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#616161]">
                Local content editor · {hydrated ? "ready" : "loading"}
              </p>
              <h1
                className="font-serif text-lg tracking-tight"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Portfolio Studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshGlobal()}
              title={isGlobal ? "Global store connected — sync now" : "Global store not connected — click to retry"}
              className={`hidden items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-[11px] sm:inline-flex ${
                isGlobal
                  ? "border-[#CBE3D0] bg-[#EDF3EC] text-[#346538]"
                  : "border-[#EAEAEA] bg-[#FFFFFF] text-[#616161]"
              }`}
            >
              <Globe size={13} weight="regular" />
              <span>
                {syncStatus === "loading"
                  ? "Loading global…"
                  : syncStatus === "saving"
                    ? "Syncing global…"
                    : isGlobal
                      ? "Global · synced"
                      : "Local only"}
              </span>
            </button>
            <span className="hidden items-center gap-1.5 rounded border border-[#EAEAEA] bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-[11px] text-[#346538] sm:inline-flex">
              <FloppyDisk size={13} weight="regular" />
              <span>Auto-saved · {storageSize}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                void fetch("/api/admin/logout", { method: "POST" }).finally(() => {
                  router.push("/admin/login");
                  router.refresh();
                });
              }}
              title="Sign out of admin studio"
              className={btnGhostClass()}
            >
              <SignOut size={13} weight="regular" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            <Link href="/" className={btnGhostClass()}>
              <ArrowSquareOut size={13} weight="regular" />
              <span className="hidden sm:inline">View site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 md:py-12">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-[#616161]">
            00 / How this works
          </p>
          <h2
            className="mb-3 font-serif text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            Edit text, categories, and projects in one place.
          </h2>
          <p className="text-sm leading-relaxed text-[#555555]">
            Every change saves instantly and syncs to the global store (Upstash Redis), so edits
            appear on every visitor&apos;s device. Images upload to Vercel Blob storage, with
            automatic fallback to the database for files under 700 KB when Blob is not configured. The Export
            tab remains as an optional backup to{" "}
            <code className="rounded border border-[#EAEAEA] bg-[#FFFFFF] px-1 font-mono text-xs">
              src/data/portfolio.ts
            </code>
            . {syncError ? (
              <span className="text-[#9F2F2D]">{syncError}</span>
            ) : isGlobal ? (
              <span className="text-[#346538]">Global sync is active.</span>
            ) : (
              <span className="text-[#956400]">
                Global store not connected — edits stay in this browser until Redis is configured.
              </span>
            )}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Content sections"
          className="mb-8 flex flex-wrap items-center gap-1.5 rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-1.5"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            const count =
              t.id === "projects"
                ? data.projects.length
                : t.id === "categories"
                  ? data.techCategories.length
                  : t.id === "principles"
                    ? data.principles.length
                    : t.id === "experience"
                      ? data.experiences.length
                      : t.id === "gallery"
                        ? data.gallery.length
                        : null;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-[4px] px-3 py-2 font-mono text-xs transition-colors ${
                  active ? "bg-[#111111] font-medium text-white" : "text-[#616161] hover:text-[#111111]"
                }`}
              >
                <span className={active ? "text-[#B5B5B5]" : "text-[#6B6B6B]"}>{t.hint}</span>
                <span>{t.label}</span>
                {count !== null && (
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] ${
                      active ? "border-[#333333] bg-[#1E1E1E] text-[#E5E5E5]" : "border-[#EAEAEA] bg-[#F7F6F3]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab === "personal" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 lg:col-span-7">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                    Identity & headline
                  </h3>
                  <p className="font-mono text-xs text-[#616161]">Shown in hero, navbar, and footer.</p>
                </div>
                <ViewSectionLink href="/#hero" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      value={data.personalInfo.name}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, name: e.target.value } }))}
                      className={textInputClass()}
                    />
                  </Field>
                  <Field label="Callsign">
                    <input
                      value={data.personalInfo.callsign}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, callsign: e.target.value } }))}
                      className={textInputClass()}
                    />
                  </Field>
                </div>
                <Field label="Role line">
                  <input
                    value={data.personalInfo.role}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, role: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Institution">
                    <input
                      value={data.personalInfo.institution}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, institution: e.target.value } }))}
                      className={textInputClass()}
                    />
                  </Field>
                  <Field label="Current role">
                    <input
                      value={data.personalInfo.currentRole}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, currentRole: e.target.value } }))}
                      className={textInputClass()}
                    />
                  </Field>
                </div>
                <Field label="Headline" hint="Hero display serif">
                  <textarea
                    value={data.personalInfo.headline}
                    rows={3}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, headline: e.target.value } }))}
                    className={`${textInputClass()} resize-y`}
                  />
                </Field>
                <Field label="Bio" hint="Hero sub-copy">
                  <textarea
                    value={data.personalInfo.bio}
                    rows={4}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, bio: e.target.value } }))}
                    className={`${textInputClass()} resize-y`}
                  />
                </Field>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
                <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Contact & location
                </h3>
                <p className="mb-5 font-mono text-xs text-[#616161]">Used by copy-email buttons and legal pages.</p>
                <div className="space-y-4">
                  <Field label="Email">
                    <input
                      value={data.personalInfo.email}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, email: cleanEmail(e.target.value) } }))}
                      className={textInputClass(true)}
                    />
                    <span
                      className={`mt-1.5 block font-mono text-[11px] ${
                        isValidEmail(cleanEmail(data.personalInfo.email)) ? "text-[#346538]" : "text-[#9F2F2D]"
                      }`}
                    >
                      {isValidEmail(cleanEmail(data.personalInfo.email))
                        ? "Valid — mailto will work"
                        : "Invalid format — mailto will fail, please fix"}
                    </span>
                  </Field>
                  <Field label="GitHub URL">
                    <input
                      value={data.personalInfo.github}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, github: e.target.value } }))}
                      className={textInputClass(true)}
                    />
                  </Field>
                  <Field label="LinkedIn URL">
                    <input
                      value={data.personalInfo.linkedin}
                      onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, linkedin: e.target.value } }))}
                      className={textInputClass(true)}
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Location">
                      <input
                        value={data.personalInfo.location}
                        onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, location: e.target.value } }))}
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Timezone">
                      <input
                        value={data.personalInfo.timezone}
                        onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, timezone: e.target.value } }))}
                        className={textInputClass(true)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 lg:col-span-12">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                    Hero spotlight & quick facts
                  </h3>
                  <p className="font-mono text-xs text-[#616161]">CTA label, engagement, focus, and the bottom metrics bar.</p>
                </div>
                <ViewSectionLink href="/#hero" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="CTA label" hint="Primary button">
                  <input
                    value={data.personalInfo.ctaLabel}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, ctaLabel: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
                <Field label="Engagement label">
                  <input
                    value={data.personalInfo.engagementLabel}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, engagementLabel: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
                <Field label="Engagement value">
                  <input
                    value={data.personalInfo.engagementValue}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, engagementValue: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
                <Field label="Focus label">
                  <input
                    value={data.personalInfo.focusLabel}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, focusLabel: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
                <Field label="Focus value">
                  <input
                    value={data.personalInfo.focusValue}
                    onChange={(e) => update((p) => ({ ...p, personalInfo: { ...p.personalInfo, focusValue: e.target.value } }))}
                    className={textInputClass()}
                  />
                </Field>
              </div>
              <div className="mt-5">
                <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                  Quick facts · {data.personalInfo.quickFacts.length}
                </span>
                <div className="space-y-2">
                  {data.personalInfo.quickFacts.map((fact, fIdx) => (
                    <div key={`${fact.label}-${fIdx}`} className="flex items-center gap-2">
                      <input
                        value={fact.label}
                        placeholder="Label"
                        aria-label={`Quick fact ${fIdx + 1} label`}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            personalInfo: {
                              ...p.personalInfo,
                              quickFacts: p.personalInfo.quickFacts.map((f, k) =>
                                k === fIdx ? { ...f, label: e.target.value } : f
                              ),
                            },
                          }))
                        }
                        className={textInputClass(true)}
                      />
                      <input
                        value={fact.value}
                        placeholder="Value"
                        aria-label={`Quick fact ${fIdx + 1} value`}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            personalInfo: {
                              ...p.personalInfo,
                              quickFacts: p.personalInfo.quickFacts.map((f, k) =>
                                k === fIdx ? { ...f, value: e.target.value } : f
                              ),
                            },
                          }))
                        }
                        className={textInputClass()}
                      />
                      <button
                        type="button"
                        aria-label={`Remove quick fact ${fIdx + 1}`}
                        onClick={() =>
                          update((p) => ({
                            ...p,
                            personalInfo: {
                              ...p.personalInfo,
                              quickFacts: p.personalInfo.quickFacts.filter((_, k) => k !== fIdx),
                            },
                          }))
                        }
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#EAEAEA] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        personalInfo: {
                          ...p.personalInfo,
                          quickFacts: [...p.personalInfo.quickFacts, { label: "New Fact", value: "Value" }],
                        },
                      }))
                    }
                    className={btnGhostClass()}
                  >
                    <Plus size={13} weight="bold" />
                    <span>Add fact</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "projects" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#616161]">
                    All projects · {projects.length}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ViewSectionLink href="/#projects" />
                    <button
                      type="button"
                      onClick={() => {
                        const fresh = emptyProject();
                        const slug = ensureUniqueSlug(fresh.slug);
                        const withSlug = { ...fresh, slug, id: newProjectId(slug) };
                        update((p) => ({ ...p, projects: [...p.projects, withSlug] }));
                        setSelectedProjectId(withSlug.id);
                        focusCard("project-editor");
                      }}
                      className={btnPrimaryClass()}
                    >
                      <Plus size={13} weight="bold" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {projects.map((p, idx) => {
                    const active = selectedProject?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProjectId(p.id)}
                        className={`w-full rounded-[6px] border p-3 text-left transition-colors ${
                          active ? "border-[#111111] bg-[#111111] text-white" : "border-[#EAEAEA] bg-[#FBFBFA] hover:bg-[#F0F0EE]"
                        }`}
                      >
                        <span className={`block font-mono text-[10px] uppercase tracking-wider ${active ? "text-[#B5B5B5]" : "text-[#616161]"}`}>
                          {String(idx + 1).padStart(2, "0")} · {p.slug}
                        </span>
                        <span className={`block truncate font-serif text-base ${active ? "text-white" : "text-[#111111]"}`}>
                          {p.title}
                        </span>
                        <span className={`block truncate font-mono text-[11px] ${active ? "text-[#CCCCCC]" : "text-[#616161]"}`}>
                          {p.category}
                        </span>
                      </button>
                    );
                  })}
                  {projects.length === 0 && (
                    <p className="rounded-[6px] border border-dashed border-[#EAEAEA] p-4 font-mono text-xs text-[#616161]">
                      No projects yet. Add the first one.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {!selectedProject ? (
                <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-8 font-mono text-sm text-[#616161]">
                  Select or add a project to edit.
                </div>
              ) : (
                <div id="project-editor" className="space-y-6 scroll-mt-24">
                  <div
                    className={`rounded-[8px] border bg-[#FFFFFF] p-6 transition-all duration-300 ${
                      flashId === "project-editor"
                        ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                        : "border-[#EAEAEA]"
                    }`}
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="mb-1.5 flex items-center gap-2">
                          <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                            {selectedProject.title || "Untitled"}
                          </h3>
                          {flashId === "project-editor" && (
                            <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                              <span>New</span>
                            </span>
                          )}
                        </span>
                        <p className="font-mono text-xs text-[#616161]">/{selectedProject.slug} · {selectedProject.id}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const copy: ProjectItem = JSON.parse(JSON.stringify(selectedProject));
                            const base = `${selectedProject.slug}-copy`;
                            const slug = ensureUniqueSlug(base, selectedProject.id);
                            copy.id = newProjectId(slug);
                            copy.slug = slug;
                            copy.title = `${selectedProject.title} (Copy)`;
                            update((p) => ({ ...p, projects: [...p.projects, copy] }));
                            setSelectedProjectId(copy.id);
                            focusCard("project-editor");
                          }}
                          className={btnGhostClass()}
                        >
                          <Copy size={13} weight="regular" />
                          <span>Duplicate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Delete "${selectedProject.title}"? This cannot be undone.`)) return;
                            update((p) => ({ ...p, projects: p.projects.filter((x) => x.id !== selectedProject.id) }));
                            setSelectedProjectId(null);
                          }}
                          className={btnDangerClass()}
                        >
                          <Trash size={13} weight="regular" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Title">
                        <input
                          value={selectedProject.title}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, title: e.target.value }))}
                          className={textInputClass()}
                        />
                      </Field>
                      <Field label="Slug" hint="URL: /work/slug">
                        <input
                          value={selectedProject.slug}
                          onChange={(e) => {
                            const raw = slugifyTitle(e.target.value);
                            patchProject(selectedProject.id, (p) => ({ ...p, slug: ensureUniqueSlug(raw, p.id) }));
                          }}
                          className={textInputClass(true)}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Category">
                        <input
                          value={selectedProject.category}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, category: e.target.value }))}
                          className={textInputClass()}
                        />
                      </Field>
                      <Field label="Cover image path">
                        <input
                          value={selectedProject.image}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, image: e.target.value }))}
                          className={textInputClass(true)}
                          placeholder="/images/projects/pokemon-app.jpg"
                        />
                        <span className="mt-2 flex flex-wrap items-center gap-2">
                          <ImageUploadButton
                            onUploaded={(url) => patchProject(selectedProject.id, (p) => ({ ...p, image: url }))}
                          />
                          <span className="font-mono text-[11px] text-[#6B6B6B]">
                            JPG/PNG/WebP ≤ 8 MB → Blob / database
                          </span>
                        </span>
                      </Field>
                    </div>
                    <div className="mt-4 space-y-4">
                      <Field label="Summary" hint="Card + meta description">
                        <textarea
                          value={selectedProject.summary}
                          rows={2}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, summary: e.target.value }))}
                          className={`${textInputClass()} resize-y`}
                        />
                      </Field>
                      <Field label="Description" hint="Detail row + case header">
                        <textarea
                          value={selectedProject.description}
                          rows={3}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, description: e.target.value }))}
                          className={`${textInputClass()} resize-y`}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="Layout span">
                        <select
                          value={selectedProject.gridSpan}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              gridSpan: e.target.value as ProjectItem["gridSpan"],
                            }))
                          }
                          className={textInputClass(true)}
                        >
                          <option value="col-span-12">Full width</option>
                          <option value="col-span-12 lg:col-span-7">Wide (7/12)</option>
                          <option value="col-span-12 lg:col-span-5">Narrow (5/12)</option>
                        </select>
                      </Field>
                      <Field label="Badge text" hint="Empty = no badge">
                        <input
                          value={selectedProject.badge?.text ?? ""}
                          onChange={(e) => {
                            const text = e.target.value;
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              badge: text.trim() ? { text, variant: p.badge?.variant ?? "green" } : undefined,
                            }));
                          }}
                          className={textInputClass(true)}
                        />
                      </Field>
                      <Field label="Badge color">
                        <TonePicker
                          tone={selectedProject.badge?.variant ?? "green"}
                          customColor={selectedProject.badge?.customColor ?? "#3E7C4F"}
                          previewText={selectedProject.badge?.text || selectedProject.title || "Badge"}
                          onTone={(t) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              badge: p.badge
                                ? { ...p.badge, variant: t }
                                : { text: "NEW ENTRY", variant: t },
                            }))
                          }
                          onCustomColor={(hex) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              badge: p.badge
                                ? { ...p.badge, customColor: hex }
                                : { text: "NEW ENTRY", variant: "custom" as const, customColor: hex },
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="Live URL">
                        <input
                          value={selectedProject.liveUrl ?? ""}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, liveUrl: e.target.value }))}
                          className={textInputClass(true)}
                          placeholder="https://…"
                        />
                      </Field>
                      <Field label="GitHub URL">
                        <input
                          value={selectedProject.githubUrl ?? ""}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, githubUrl: e.target.value }))}
                          className={textInputClass(true)}
                          placeholder="https://github.com/…"
                        />
                      </Field>
                      <Field label="Download URL" hint="APK / file">
                        <input
                          value={selectedProject.downloadUrl ?? ""}
                          onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, downloadUrl: e.target.value }))}
                          className={textInputClass(true)}
                          placeholder="https://…/app.apk"
                        />
                      </Field>
                    </div>
                    <label className="mt-4 flex cursor-pointer items-center gap-2.5 font-mono text-xs text-[#111111]">
                      <input
                        type="checkbox"
                        checked={selectedProject.featured}
                        onChange={(e) => patchProject(selectedProject.id, (p) => ({ ...p, featured: e.target.checked }))}
                        className="h-4 w-4 accent-[#111111]"
                      />
                      <span>Featured on homepage</span>
                    </label>
                    <div className="mt-4">
                      <Field label="Tags" hint="Comma separated">
                        <input
                          value={selectedProject.tags.join(", ")}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            }))
                          }
                          className={textInputClass(true)}
                          placeholder="Next.js, TypeScript, Tailwind CSS"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
                    <h4 className="mb-1 font-serif text-lg tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                      Highlights & metrics
                    </h4>
                    <p className="mb-5 font-mono text-xs text-[#616161]">Blueprint drawer and stat boxes on cards.</p>
                    <StringListEditor
                      title="Technical highlights"
                      items={selectedProject.technicalHighlights}
                      onChange={(next) => patchProject(selectedProject.id, (p) => ({ ...p, technicalHighlights: next }))}
                      addLabel="Add highlight"
                      placeholder="What was engineered…"
                    />
                    <div className="mt-5">
                      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                        Metrics · {selectedProject.metrics?.length ?? 0}
                      </span>
                      <div className="space-y-2">
                        {(selectedProject.metrics ?? []).map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              value={m.label}
                              placeholder="Label"
                              onChange={(e) => {
                                const next = [...(selectedProject.metrics ?? [])];
                                next[idx] = { ...next[idx], label: e.target.value };
                                patchProject(selectedProject.id, (p) => ({ ...p, metrics: next }));
                              }}
                              className={textInputClass(true)}
                            />
                            <input
                              value={m.value}
                              placeholder="Value"
                              onChange={(e) => {
                                const next = [...(selectedProject.metrics ?? [])];
                                next[idx] = { ...next[idx], value: e.target.value };
                                patchProject(selectedProject.id, (p) => ({ ...p, metrics: next }));
                              }}
                              className={textInputClass(true)}
                            />
                            <button
                              type="button"
                              aria-label={`Remove metric ${idx + 1}`}
                              onClick={() =>
                                patchProject(selectedProject.id, (p) => ({
                                  ...p,
                                  metrics: (p.metrics ?? []).filter((_, i) => i !== idx),
                                }))
                              }
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#EAEAEA] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                            >
                              <Trash size={14} weight="regular" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              metrics: [...(p.metrics ?? []), { label: "New metric", value: "Value" }],
                            }))
                          }
                          className={btnGhostClass()}
                        >
                          <Plus size={13} weight="bold" />
                          <span>Add metric</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
                    <h4 className="mb-1 font-serif text-lg tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                      Case study
                    </h4>
                    <p className="mb-5 font-mono text-xs text-[#616161]">Full narrative on /work/[slug].</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="Client / context">
                        <input
                          value={selectedProject.caseStudy.clientOrContext}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              caseStudy: { ...p.caseStudy, clientOrContext: e.target.value },
                            }))
                          }
                          className={textInputClass()}
                        />
                      </Field>
                      <Field label="Timeline">
                        <input
                          value={selectedProject.caseStudy.timeline}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({ ...p, caseStudy: { ...p.caseStudy, timeline: e.target.value } }))
                          }
                          className={textInputClass(true)}
                        />
                      </Field>
                      <Field label="Role">
                        <input
                          value={selectedProject.caseStudy.role}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({ ...p, caseStudy: { ...p.caseStudy, role: e.target.value } }))
                          }
                          className={textInputClass()}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 space-y-4">
                      <Field label="Challenge">
                        <textarea
                          value={selectedProject.caseStudy.challenge}
                          rows={3}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({ ...p, caseStudy: { ...p.caseStudy, challenge: e.target.value } }))
                          }
                          className={`${textInputClass()} resize-y`}
                        />
                      </Field>
                      <Field label="Architecture solution">
                        <textarea
                          value={selectedProject.caseStudy.architectureSolution}
                          rows={3}
                          onChange={(e) =>
                            patchProject(selectedProject.id, (p) => ({
                              ...p,
                              caseStudy: { ...p.caseStudy, architectureSolution: e.target.value },
                            }))
                          }
                          className={`${textInputClass()} resize-y`}
                        />
                      </Field>
                      <StringListEditor
                        title="Deliverables"
                        items={selectedProject.caseStudy.deliverables}
                        onChange={(next) =>
                          patchProject(selectedProject.id, (p) => ({ ...p, caseStudy: { ...p.caseStudy, deliverables: next } }))
                        }
                        addLabel="Add deliverable"
                      />
                      <div>
                        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                          Technical decisions · {selectedProject.caseStudy.technicalDecisions.length}
                        </span>
                        <div className="space-y-3">
                          {selectedProject.caseStudy.technicalDecisions.map((d, idx) => (
                            <div key={idx} className="rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="font-mono text-[11px] text-[#616161]">Decision {idx + 1}</span>
                                <button
                                  type="button"
                                  aria-label={`Remove decision ${idx + 1}`}
                                  onClick={() =>
                                    patchProject(selectedProject.id, (p) => ({
                                      ...p,
                                      caseStudy: {
                                        ...p.caseStudy,
                                        technicalDecisions: p.caseStudy.technicalDecisions.filter((_, i) => i !== idx),
                                      },
                                    }))
                                  }
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                                >
                                  <Trash size={13} weight="regular" />
                                </button>
                              </div>
                              <input
                                value={d.title}
                                placeholder="Decision title"
                                onChange={(e) => {
                                  const next = [...selectedProject.caseStudy.technicalDecisions];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  patchProject(selectedProject.id, (p) => ({
                                    ...p,
                                    caseStudy: { ...p.caseStudy, technicalDecisions: next },
                                  }));
                                }}
                                className={`${textInputClass()} mb-2`}
                              />
                              <textarea
                                value={d.rationale}
                                rows={2}
                                placeholder="Rationale…"
                                onChange={(e) => {
                                  const next = [...selectedProject.caseStudy.technicalDecisions];
                                  next[idx] = { ...next[idx], rationale: e.target.value };
                                  patchProject(selectedProject.id, (p) => ({
                                    ...p,
                                    caseStudy: { ...p.caseStudy, technicalDecisions: next },
                                  }));
                                }}
                                className={`${textInputClass()} resize-y`}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              patchProject(selectedProject.id, (p) => ({
                                ...p,
                                caseStudy: {
                                  ...p.caseStudy,
                                  technicalDecisions: [
                                    ...p.caseStudy.technicalDecisions,
                                    { title: "New decision", rationale: "Why this choice was made." },
                                  ],
                                },
                              }))
                            }
                            className={btnGhostClass()}
                          >
                            <Plus size={13} weight="bold" />
                            <span>Add decision</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "categories" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#616161]">
                    Categories · {data.techCategories.length}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ViewSectionLink href="/#dossier" />
                    <button
                      type="button"
                      onClick={() => {
                        update((p) => ({
                          ...p,
                          techCategories: [
                            ...p.techCategories,
                            { title: "New Category", description: "What this group covers.", skills: [] },
                          ],
                        }));
                        setSelectedCategoryIdx(data.techCategories.length);
                        focusCard("category-editor");
                      }}
                      className={btnPrimaryClass()}
                    >
                      <Plus size={13} weight="bold" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {data.techCategories.map((c, idx) => (
                    <button
                      key={`${c.title}-${idx}`}
                      type="button"
                      onClick={() => setSelectedCategoryIdx(idx)}
                      className={`w-full rounded-[6px] border p-3 text-left transition-colors ${
                        idx === Math.min(selectedCategoryIdx, data.techCategories.length - 1)
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#EAEAEA] bg-[#FBFBFA] hover:bg-[#F0F0EE]"
                      }`}
                    >
                      <span className="block truncate font-medium">{c.title}</span>
                      <span className="block font-mono text-[11px] opacity-70">{c.skills.length} skills</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              {!selectedCategory ? (
                <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-8 font-mono text-sm text-[#616161]">
                  Add a category to begin.
                </div>
              ) : (
                <div
                  id="category-editor"
                  className={`rounded-[8px] border bg-[#FFFFFF] p-6 scroll-mt-24 transition-all duration-300 ${
                    flashId === "category-editor"
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                        Category {Math.min(selectedCategoryIdx, data.techCategories.length - 1) + 1}
                      </h3>
                      {flashId === "category-editor" && (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                          <span>New</span>
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Delete category "${selectedCategory.title}"?`)) return;
                        update((p) => ({
                          ...p,
                          techCategories: p.techCategories.filter((_, i) => i !== selectedCategoryIdx),
                        }));
                        setSelectedCategoryIdx(0);
                      }}
                      className={btnDangerClass()}
                    >
                      <Trash size={13} weight="regular" />
                      <span>Delete</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <Field label="Title">
                      <input
                        value={selectedCategory.title}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            techCategories: p.techCategories.map((c, i) =>
                              i === selectedCategoryIdx ? { ...c, title: e.target.value } : c
                            ),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Description">
                      <textarea
                        value={selectedCategory.description}
                        rows={2}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            techCategories: p.techCategories.map((c, i) =>
                              i === selectedCategoryIdx ? { ...c, description: e.target.value } : c
                            ),
                          }))
                        }
                        className={`${textInputClass()} resize-y`}
                      />
                    </Field>
                    <div>
                      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                        Skills · {selectedCategory.skills.length}
                      </span>
                      <div className="space-y-3">
                        {selectedCategory.skills.map((s, sIdx) => (
                          <div key={sIdx} className="rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-mono text-[11px] text-[#616161]">Skill {sIdx + 1}</span>
                              <button
                                type="button"
                                aria-label={`Remove skill ${sIdx + 1}`}
                                onClick={() =>
                                  update((p) => ({
                                    ...p,
                                    techCategories: p.techCategories.map((c, i) =>
                                      i === selectedCategoryIdx
                                        ? { ...c, skills: c.skills.filter((_, k) => k !== sIdx) }
                                        : c
                                    ),
                                  }))
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                              >
                                <Trash size={13} weight="regular" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <input
                                value={s.name}
                                placeholder="Name"
                                onChange={(e) =>
                                  update((p) => ({
                                    ...p,
                                    techCategories: p.techCategories.map((c, i) =>
                                      i === selectedCategoryIdx
                                        ? {
                                            ...c,
                                            skills: c.skills.map((sk, k) => (k === sIdx ? { ...sk, name: e.target.value } : sk)),
                                          }
                                        : c
                                    ),
                                  }))
                                }
                                className={textInputClass()}
                              />
                              <input
                                value={s.kbd ?? ""}
                                placeholder="KBD"
                                onChange={(e) =>
                                  update((p) => ({
                                    ...p,
                                    techCategories: p.techCategories.map((c, i) =>
                                      i === selectedCategoryIdx
                                        ? {
                                            ...c,
                                            skills: c.skills.map((sk, k) => (k === sIdx ? { ...sk, kbd: e.target.value } : sk)),
                                          }
                                        : c
                                    ),
                                  }))
                                }
                                className={textInputClass(true)}
                              />
                              <input
                                value={s.detail}
                                placeholder="Detail"
                                onChange={(e) =>
                                  update((p) => ({
                                    ...p,
                                    techCategories: p.techCategories.map((c, i) =>
                                      i === selectedCategoryIdx
                                        ? {
                                            ...c,
                                            skills: c.skills.map((sk, k) => (k === sIdx ? { ...sk, detail: e.target.value } : sk)),
                                          }
                                        : c
                                    ),
                                  }))
                                }
                                className={textInputClass()}
                              />
                            </div>
                            <input
                              value={(s.logos ?? []).join(", ")}
                              placeholder="Logo slugs, comma separated — e.g. typescript, react (empty = monogram)"
                              aria-label={`Skill ${sIdx + 1} logo slugs`}
                              onChange={(e) =>
                                update((p) => ({
                                  ...p,
                                  techCategories: p.techCategories.map((c, i) =>
                                    i === selectedCategoryIdx
                                      ? {
                                          ...c,
                                          skills: c.skills.map((sk, k) =>
                                            k === sIdx
                                              ? {
                                                  ...sk,
                                                  logos: e.target.value
                                                    .split(",")
                                                    .map((t) => t.trim().toLowerCase())
                                                    .filter(Boolean),
                                                }
                                              : sk
                                          ),
                                        }
                                      : c
                                  ),
                                }))
                              }
                              className={`${textInputClass(true)} mt-2`}
                            />
                            <span className="mt-2 flex flex-wrap items-center gap-2">
                              <LogoSlugPreview slugs={s.logos ?? []} />
                              <span className="font-mono text-[10px] text-[#6B6B6B]">
                                Cek slug di simpleicons.org (cari brand → slug ada di URL), atau
                                buka cdn.simpleicons.org/nama — kalau gambar muncul berarti benar.
                              </span>
                            </span>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            update((p) => ({
                              ...p,
                              techCategories: p.techCategories.map((c, i) =>
                                i === selectedCategoryIdx
                                  ? { ...c, skills: [...c.skills, { name: "New skill", detail: "What it covers.", kbd: "" }] }
                                  : c
                              ),
                            }))
                          }
                          className={btnGhostClass()}
                        >
                          <Plus size={13} weight="bold" />
                          <span>Add skill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "principles" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Engineering principles
                </h3>
                <p className="font-mono text-xs text-[#616161]">ARCH section rows, numbered 01–99.</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewSectionLink href="/#principles" />
              <button
                type="button"
                onClick={() => {
                  const id = `principle-${data.principles.length}`;
                  update((p) => {
                    const nextNum = String(p.principles.length + 1).padStart(2, "0");
                    const item: PrincipleItem = { number: nextNum, title: "New tenet", statement: "What is non-negotiable and why." };
                    return { ...p, principles: [...p.principles, item] };
                  });
                  focusCard(id);
                }}
                className={btnPrimaryClass()}
              >
                <Plus size={13} weight="bold" />
                <span>Add principle</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {data.principles.map((pr, idx) => (
                <div
                  key={`${pr.number}-${idx}`}
                  id={`principle-${idx}`}
                  className={`scroll-mt-24 rounded-[6px] border bg-[#FBFBFA] p-4 transition-all duration-300 ${
                    flashId === `principle-${idx}`
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                      <span>Row {idx + 1}</span>
                      {flashId === `principle-${idx}` && (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                          <span>New</span>
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update((p) => ({ ...p, principles: p.principles.filter((_, i) => i !== idx) }))
                      }
                      className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-[#EAEAEA] bg-white px-2 font-mono text-[11px] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                    >
                      <Trash size={12} weight="regular" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-1">
                      <Field label="No.">
                        <input
                          value={pr.number}
                          onChange={(e) =>
                            update((p) => ({
                              ...p,
                              principles: p.principles.map((x, i) => (i === idx ? { ...x, number: e.target.value } : x)),
                            }))
                          }
                          className={textInputClass(true)}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-4">
                      <Field label="Title">
                        <input
                          value={pr.title}
                          onChange={(e) =>
                            update((p) => ({
                              ...p,
                              principles: p.principles.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)),
                            }))
                          }
                          className={textInputClass()}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-7">
                      <Field label="Statement">
                        <textarea
                          value={pr.statement}
                          rows={2}
                          onChange={(e) =>
                            update((p) => ({
                              ...p,
                              principles: p.principles.map((x, i) => (i === idx ? { ...x, statement: e.target.value } : x)),
                            }))
                          }
                          className={`${textInputClass()} resize-y`}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "experience" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Industry engagements
                </h3>
                <p className="font-mono text-xs text-[#616161]">CHRONO timeline rows.</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewSectionLink href="/#experience" />
              <button
                type="button"
                onClick={() => {
                  const id = `experience-${data.experiences.length}`;
                  update((p) => {
                    const item: ExperienceItem = {
                      period: "2026 — Present",
                      role: "New Role",
                      company: "Company",
                      location: "Jakarta / Remote",
                      type: "Full-time",
                      impact: "What was delivered and what changed.",
                      technologies: ["Next.js"],
                    };
                    return { ...p, experiences: [...p.experiences, item] };
                  });
                  focusCard(id);
                }}
                className={btnPrimaryClass()}
              >
                <Plus size={13} weight="bold" />
                <span>Add experience</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {data.experiences.map((exp, idx) => (
                <div
                  key={`${exp.company}-${idx}`}
                  id={`experience-${idx}`}
                  className={`scroll-mt-24 rounded-[6px] border bg-[#FBFBFA] p-4 transition-all duration-300 ${
                    flashId === `experience-${idx}`
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                      <span>Entry {idx + 1}</span>
                      {flashId === `experience-${idx}` && (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                          <span>New</span>
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => update((p) => ({ ...p, experiences: p.experiences.filter((_, i) => i !== idx) }))}
                      className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-[#EAEAEA] bg-white px-2 font-mono text-[11px] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                    >
                      <Trash size={12} weight="regular" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Role">
                      <input
                        value={exp.role}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, role: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Company">
                      <input
                        value={exp.company}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, company: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Period">
                      <input
                        value={exp.period}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, period: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass(true)}
                      />
                    </Field>
                    <Field label="Location">
                      <input
                        value={exp.location}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, location: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Type">
                      <input
                        value={exp.type}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, type: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Technologies" hint="Comma separated">
                      <input
                        value={exp.technologies.join(", ")}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) =>
                              i === idx
                                ? { ...x, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }
                                : x
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Impact">
                      <textarea
                        value={exp.impact}
                        rows={3}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) => (i === idx ? { ...x, impact: e.target.value } : x)),
                          }))
                        }
                        className={`${textInputClass()} resize-y`}
                      />
                    </Field>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Image path" hint="Empty = no image">
                      <input
                        value={exp.image ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) =>
                              i === idx ? { ...x, image: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                        placeholder="/images/experience/…"
                      />
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <ImageUploadButton
                          onUploaded={(url) =>
                            update((p) => ({
                              ...p,
                              experiences: p.experiences.map((x, i) =>
                                i === idx ? { ...x, image: url } : x
                              ),
                            }))
                          }
                        />
                        <span className="font-mono text-[11px] text-[#6B6B6B]">
                          JPG/PNG/WebP ≤ 8 MB
                        </span>
                      </span>
                    </Field>
                    <Field label="Image link" hint="Opened on click">
                      <input
                        value={exp.imageLink ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) =>
                              i === idx ? { ...x, imageLink: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                        placeholder="https://…"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Image alt text" hint="Accessibility">
                      <input
                        value={exp.imageAlt ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            experiences: p.experiences.map((x, i) =>
                              i === idx ? { ...x, imageAlt: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass()}
                        placeholder={`${exp.company} visual`}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "education" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Academic foundation
                </h3>
                <p className="font-mono text-xs text-[#616161]">Education timeline under CHRONO.</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewSectionLink href="/#experience" />
              <button
                type="button"
                onClick={() => {
                  const id = `education-${data.education.length}`;
                  update((p) => {
                    const item: EducationItem = {
                      period: "2023 — Present",
                      degree: "New Degree",
                      institution: "Institution",
                      details: "Focus areas and notes.",
                    };
                    return { ...p, education: [...p.education, item] };
                  });
                  focusCard(id);
                }}
                className={btnPrimaryClass()}
              >
                <Plus size={13} weight="bold" />
                <span>Add education</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div
                  key={`${edu.institution}-${idx}`}
                  id={`education-${idx}`}
                  className={`scroll-mt-24 rounded-[6px] border bg-[#FBFBFA] p-4 transition-all duration-300 ${
                    flashId === `education-${idx}`
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                      <span>Entry {idx + 1}</span>
                      {flashId === `education-${idx}` && (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                          <span>New</span>
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => update((p) => ({ ...p, education: p.education.filter((_, i) => i !== idx) }))}
                      className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-[#EAEAEA] bg-white px-2 font-mono text-[11px] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                    >
                      <Trash size={12} weight="regular" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Institution">
                      <input
                        value={edu.institution}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) => (i === idx ? { ...x, institution: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Period">
                      <input
                        value={edu.period}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) => (i === idx ? { ...x, period: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass(true)}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Degree">
                      <input
                        value={edu.degree}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) => (i === idx ? { ...x, degree: e.target.value } : x)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Details">
                      <textarea
                        value={edu.details}
                        rows={2}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) => (i === idx ? { ...x, details: e.target.value } : x)),
                          }))
                        }
                        className={`${textInputClass()} resize-y`}
                      />
                    </Field>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Image path" hint="Empty = no image">
                      <input
                        value={edu.image ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) =>
                              i === idx ? { ...x, image: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                        placeholder="/images/experience/…"
                      />
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <ImageUploadButton
                          onUploaded={(url) =>
                            update((p) => ({
                              ...p,
                              education: p.education.map((x, i) =>
                                i === idx ? { ...x, image: url } : x
                              ),
                            }))
                          }
                        />
                        <span className="font-mono text-[11px] text-[#6B6B6B]">
                          JPG/PNG/WebP ≤ 8 MB
                        </span>
                      </span>
                    </Field>
                    <Field label="Image link" hint="Opened on click">
                      <input
                        value={edu.imageLink ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) =>
                              i === idx ? { ...x, imageLink: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                        placeholder="https://…"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Image alt text" hint="Accessibility">
                      <input
                        value={edu.imageAlt ?? ""}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            education: p.education.map((x, i) =>
                              i === idx ? { ...x, imageAlt: e.target.value } : x
                            ),
                          }))
                        }
                        className={textInputClass()}
                        placeholder={`${edu.institution} visual`}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "workspace" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Workspace inventory
                </h3>
                <p className="font-mono text-xs text-[#616161]">Studio setup groups and specs.</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewSectionLink href="/#workspace" />
              <button
                type="button"
                onClick={() => {
                  const id = `workspace-${data.workspaceSetup.length}`;
                  update((p) => {
                    const item: SetupItem = { category: "New Group", items: [{ name: "Item", spec: "Spec" }] };
                    return { ...p, workspaceSetup: [...p.workspaceSetup, item] };
                  });
                  focusCard(id);
                }}
                className={btnPrimaryClass()}
              >
                <Plus size={13} weight="bold" />
                <span>Add group</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {data.workspaceSetup.map((group, gIdx) => (
                <div
                  key={`${group.category}-${gIdx}`}
                  id={`workspace-${gIdx}`}
                  className={`scroll-mt-24 rounded-[6px] border bg-[#FBFBFA] p-4 transition-all duration-300 ${
                    flashId === `workspace-${gIdx}`
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    {flashId === `workspace-${gIdx}` && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                        <span>New</span>
                      </span>
                    )}
                    <input
                      value={group.category}
                      onChange={(e) =>
                        update((p) => ({
                          ...p,
                          workspaceSetup: p.workspaceSetup.map((g, i) => (i === gIdx ? { ...g, category: e.target.value } : g)),
                        }))
                      }
                      className={`${textInputClass(true)} font-medium`}
                      aria-label={`Workspace group ${gIdx + 1} name`}
                    />
                    <button
                      type="button"
                      aria-label={`Remove group ${gIdx + 1}`}
                      onClick={() => update((p) => ({ ...p, workspaceSetup: p.workspaceSetup.filter((_, i) => i !== gIdx) }))}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                    >
                      <Trash size={14} weight="regular" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex flex-col gap-2 sm:flex-row">
                        <input
                          value={item.name}
                          placeholder="Item name"
                          onChange={(e) =>
                            update((p) => ({
                              ...p,
                              workspaceSetup: p.workspaceSetup.map((g, i) =>
                                i === gIdx
                                  ? { ...g, items: g.items.map((it, k) => (k === iIdx ? { ...it, name: e.target.value } : it)) }
                                  : g
                              ),
                            }))
                          }
                          className={textInputClass()}
                          aria-label={`Item ${iIdx + 1} name`}
                        />
                        <input
                          value={item.spec}
                          placeholder="Spec"
                          onChange={(e) =>
                            update((p) => ({
                              ...p,
                              workspaceSetup: p.workspaceSetup.map((g, i) =>
                                i === gIdx
                                  ? { ...g, items: g.items.map((it, k) => (k === iIdx ? { ...it, spec: e.target.value } : it)) }
                                  : g
                              ),
                            }))
                          }
                          className={textInputClass(true)}
                          aria-label={`Item ${iIdx + 1} spec`}
                        />
                        <button
                          type="button"
                          aria-label={`Remove item ${iIdx + 1}`}
                          onClick={() =>
                            update((p) => ({
                              ...p,
                              workspaceSetup: p.workspaceSetup.map((g, i) =>
                                i === gIdx ? { ...g, items: g.items.filter((_, k) => k !== iIdx) } : g
                              ),
                            }))
                          }
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                        >
                          <Trash size={14} weight="regular" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        update((p) => ({
                          ...p,
                          workspaceSetup: p.workspaceSetup.map((g, i) =>
                            i === gIdx ? { ...g, items: [...g.items, { name: "New item", spec: "Spec detail" }] } : g
                          ),
                        }))
                      }
                      className={btnGhostClass()}
                    >
                      <Plus size={13} weight="bold" />
                      <span>Add item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "gallery" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Visual record — field plates
                </h3>
                <p className="font-mono text-xs text-[#616161]">
                  Gallery under About, rendered top-to-bottom in this order. Wide = full row,
                  Half = half row, Tall = half-row portrait, Trio = third-row square.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ViewSectionLink href="/#about" />
              <button
                type="button"
                onClick={() => {
                  const id = `gallery-${data.gallery.length}`;
                  update((p) => ({
                    ...p,
                      gallery: [
                        ...p.gallery,
                        {
                          src: "",
                          alt: "Describe the exposure",
                          title: "New plate title",
                          detail: "CONTEXT · MEDIUM",
                          span: "half" as const,
                        },
                      ],
                  }));
                  focusCard(id);
                }}
                className={btnPrimaryClass()}
              >
                <Plus size={13} weight="bold" />
                <span>Add plate</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {data.gallery.map((plate, idx) => (
                <div
                  key={`${plate.src}-${idx}`}
                  id={`gallery-${idx}`}
                  className={`scroll-mt-24 rounded-[6px] border bg-[#FBFBFA] p-4 transition-all duration-300 ${
                    flashId === `gallery-${idx}`
                      ? "border-[#111111] shadow-[0_0_0_3px_rgba(17,17,17,0.12)]"
                      : "border-[#EAEAEA]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#616161]">
                      <span>
                        Plate {String(idx + 1).padStart(2, "0")} ·{" "}
                        {plate.span === "wide"
                          ? "Wide row"
                          : plate.span === "tall"
                            ? "Tall portrait"
                            : plate.span === "trio"
                              ? "Trio square"
                              : "Half row"}
                      </span>
                      {flashId === `gallery-${idx}` && (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#111111] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse bg-white" />
                          <span>New</span>
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Move plate ${idx + 1} up`}
                        disabled={idx === 0}
                        onClick={() =>
                          update((p) => {
                            const next = [...p.gallery];
                            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                            return { ...p, gallery: next };
                          })
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white font-mono text-xs text-[#616161] transition-colors hover:bg-[#F0F0EE] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={`Move plate ${idx + 1} down`}
                        disabled={idx === data.gallery.length - 1}
                        onClick={() =>
                          update((p) => {
                            const next = [...p.gallery];
                            [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                            return { ...p, gallery: next };
                          })
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white font-mono text-xs text-[#616161] transition-colors hover:bg-[#F0F0EE] disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => update((p) => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }))}
                        className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-[#EAEAEA] bg-white px-2 font-mono text-[11px] text-[#616161] hover:bg-[#FDEBEC] hover:text-[#9F2F2D]"
                      >
                        <Trash size={12} weight="regular" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Image path" hint="/… or https://…">
                      <input
                        value={plate.src}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            gallery: p.gallery.map((g, i) => (i === idx ? { ...g, src: e.target.value } : g)),
                          }))
                        }
                        className={textInputClass(true)}
                        placeholder="/api/image?id=… or https://…"
                      />
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <ImageUploadButton
                          onUploaded={(url) =>
                            update((p) => ({
                              ...p,
                              gallery: p.gallery.map((g, i) => (i === idx ? { ...g, src: url } : g)),
                            }))
                          }
                        />
                        <span className="font-mono text-[11px] text-[#6B6B6B]">
                          JPG/PNG/WebP ≤ 8 MB → Blob / database
                        </span>
                      </span>
                      {!plate.src.trim() && (
                        <span className="mt-1.5 block font-mono text-[11px] text-[#956400]">
                          No image yet — upload or paste a URL. Empty plates stay hidden on the site.
                        </span>
                      )}
                    </Field>
                    <Field label="Layout template">
                      <select
                        value={plate.span}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            gallery: p.gallery.map((g, i) =>
                              i === idx ? { ...g, span: e.target.value as "wide" | "half" | "tall" | "trio" } : g
                            ),
                          }))
                        }
                        className={textInputClass(true)}
                      >
                        <option value="wide">Wide — full row · 21:9</option>
                        <option value="half">Half — shared row · 4:3</option>
                        <option value="tall">Tall — shared portrait · 3:4</option>
                        <option value="trio">Trio — third row square · 1:1</option>
                      </select>
                    </Field>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Caption title">
                      <input
                        value={plate.title}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            gallery: p.gallery.map((g, i) => (i === idx ? { ...g, title: e.target.value } : g)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                    <Field label="Caption detail" hint="Right-side ledger">
                      <input
                        value={plate.detail}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            gallery: p.gallery.map((g, i) => (i === idx ? { ...g, detail: e.target.value } : g)),
                          }))
                        }
                        className={textInputClass(true)}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Alt text" hint="Accessibility">
                      <input
                        value={plate.alt}
                        onChange={(e) =>
                          update((p) => ({
                            ...p,
                            gallery: p.gallery.map((g, i) => (i === idx ? { ...g, alt: e.target.value } : g)),
                          }))
                        }
                        className={textInputClass()}
                      />
                    </Field>
                  </div>
                </div>
              ))}
              {data.gallery.length === 0 && (
                <p className="rounded-[6px] border border-dashed border-[#EAEAEA] p-4 font-mono text-xs text-[#616161]">
                  No plates yet. Add the first exposure — it appears under About as PLATE 01.
                </p>
              )}
            </div>
          </section>
        )}

        {tab === "colophon" && (
          <section className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Colophon & build credits
                </h3>
                <p className="font-mono text-xs text-[#616161]">Footer transparency block.</p>
              </div>
              <ViewSectionLink href="/#colophon" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Designer / developer">
                <input
                  value={data.colophon.designerDeveloper}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, designerDeveloper: e.target.value } }))}
                  className={textInputClass()}
                />
              </Field>
              <Field label="Year">
                <input
                  value={data.colophon.year}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, year: e.target.value } }))}
                  className={textInputClass(true)}
                />
              </Field>
              <Field label="Framework">
                <input
                  value={data.colophon.framework}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, framework: e.target.value } }))}
                  className={textInputClass()}
                />
              </Field>
              <Field label="Styling">
                <input
                  value={data.colophon.styling}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, styling: e.target.value } }))}
                  className={textInputClass()}
                />
              </Field>
              <Field label="Icons">
                <input
                  value={data.colophon.icons}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, icons: e.target.value } }))}
                  className={textInputClass()}
                />
              </Field>
              <Field label="Protocol">
                <input
                  value={data.colophon.protocol}
                  onChange={(e) => update((p) => ({ ...p, colophon: { ...p.colophon, protocol: e.target.value } }))}
                  className={textInputClass()}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Typography" hint="One entry per line">
                <textarea
                  value={data.colophon.typography.join("\n")}
                  rows={3}
                  onChange={(e) =>
                    update((p) => ({
                      ...p,
                      colophon: { ...p.colophon, typography: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) },
                    }))
                  }
                  className={`${textInputClass()} resize-y font-mono text-[13px]`}
                />
              </Field>
            </div>
          </section>
        )}

        {tab === "data" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 lg:col-span-7">
              <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                Ship changes permanently
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-[#555555]">
                Browser edits alone do not deploy. Copy the generated file into{" "}
                <code className="rounded border border-[#EAEAEA] bg-[#FBFBFA] px-1 font-mono text-xs">src/data/portfolio.ts</code>,
                commit, and redeploy. JSON backup is useful for moving between devices.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyText("ts", exportPortfolioTS(data))}
                  className={btnPrimaryClass()}
                >
                  {copied === "ts" ? <Check size={13} weight="bold" /> : <Copy size={13} weight="regular" />}
                  <span>{copied === "ts" ? "Copied portfolio.ts" : "Copy portfolio.ts"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile("portfolio.ts", exportPortfolioTS(data), "text/plain")}
                  className={btnGhostClass()}
                >
                  <Download size={13} weight="regular" />
                  <span>Download portfolio.ts</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile("portfolio-backup.json", JSON.stringify(data, null, 2), "application/json")}
                  className={btnGhostClass()}
                >
                  <Download size={13} weight="regular" />
                  <span>Backup JSON</span>
                </button>
              </div>
              <details className="mt-5 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA]">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-mono text-xs text-[#111111]">
                  <span>Preview generated portfolio.ts</span>
                  <CaretDown size={13} weight="bold" />
                </summary>
                <pre className="max-h-96 overflow-auto border-t border-[#EAEAEA] bg-[#FFFFFF] p-4 font-mono text-[11px] leading-relaxed text-[#333333]">
                  {exportPortfolioTS(data).slice(0, 6000)}
                  {"\n… (truncated preview, copy gives the full file)"}
                </pre>
              </details>
            </div>
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6">
                <h3 className="mb-1 font-serif text-xl tracking-tight" style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}>
                  Restore & import
                </h3>
                <p className="mb-5 font-mono text-xs text-[#616161]">Local storage · {storageSize} · key joshua-portfolio-v1</p>
                {importError && (
                  <p className="mb-3 rounded-[4px] border border-[#F3C2C4] bg-[#FDEBEC] px-3 py-2 font-mono text-xs text-[#9F2F2D]">
                    {importError}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} className={btnGhostClass()}>
                    <Upload size={13} weight="regular" />
                    <span>Import JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm("Reset all edits back to the shipped defaults?")) return;
                      reset();
                      setSelectedProjectId(null);
                      setSelectedCategoryIdx(0);
                    }}
                    className={btnDangerClass()}
                  >
                    <ArrowCounterClockwise size={13} weight="regular" />
                    <span>Reset to defaults</span>
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleImportFile(f);
                    e.target.value = "";
                  }}
                />
                <div className="mt-5 border-t border-[#EAEAEA] pt-4 font-mono text-[11px] leading-relaxed text-[#616161]">
                  <p>Projects: {data.projects.length}</p>
                  <p>Categories: {data.techCategories.length} · Skills: {data.techCategories.reduce((n, c) => n + c.skills.length, 0)}</p>
                  <p>Principles: {data.principles.length} · Experience: {data.experiences.length}</p>
                  <p>Gallery plates: {data.gallery.length}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
