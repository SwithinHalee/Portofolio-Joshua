import {
  COLOPHON_SPECS,
  EDUCATION_HISTORY,
  ENGINEERING_PRINCIPLES,
  EXPERIENCES,
  PERSONAL_INFO,
  PROJECTS,
  TECH_CATEGORIES,
  WORKSPACE_SETUP,
  type EducationItem,
  type ExperienceItem,
  type GalleryPlate,
  type PrincipleItem,
  type ProjectItem,
  type SetupItem,
  type TechCategory,
} from "@/data/portfolio";

export type { ProjectItem, ExperienceItem, EducationItem, TechCategory, PrincipleItem, SetupItem, GalleryPlate };

export interface PersonalInfoData {
  name: string;
  callsign: string;
  role: string;
  institution: string;
  currentRole: string;
  location: string;
  timezone: string;
  availability: { status: string; badgeType: "green" | "blue" | "amber" | "red" | "custom"; customColor?: string; visible?: boolean };
  headline: string;
  bio: string;
  heroNote: string;
  engagementLabel: string;
  engagementValue: string;
  focusLabel: string;
  focusValue: string;
  ctaLabel: string;
  quickFacts: { label: string; value: string }[];
  email: string;
  github: string;
  linkedin: string;
}

export interface ColophonData {
  designerDeveloper: string;
  typography: string[];
  framework: string;
  styling: string;
  icons: string;
  protocol: string;
  year: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfoData;
  projects: ProjectItem[];
  workspaceSetup: SetupItem[];
  techCategories: TechCategory[];
  principles: PrincipleItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  gallery: GalleryPlate[];
  colophon: ColophonData;
}

export const PORTFOLIO_STORAGE_KEY = "joshua-portfolio-v1";

export const DEFAULT_PORTFOLIO: PortfolioData = {
  personalInfo: JSON.parse(JSON.stringify(PERSONAL_INFO)) as PersonalInfoData,
  projects: JSON.parse(JSON.stringify(PROJECTS)) as ProjectItem[],
  workspaceSetup: JSON.parse(JSON.stringify(WORKSPACE_SETUP)) as SetupItem[],
  techCategories: JSON.parse(JSON.stringify(TECH_CATEGORIES)) as TechCategory[],
  principles: JSON.parse(JSON.stringify(ENGINEERING_PRINCIPLES)) as PrincipleItem[],
  experiences: JSON.parse(JSON.stringify(EXPERIENCES)) as ExperienceItem[],
  education: JSON.parse(JSON.stringify(EDUCATION_HISTORY)) as EducationItem[],
  gallery: [] as GalleryPlate[],
  colophon: JSON.parse(JSON.stringify(COLOPHON_SPECS)) as ColophonData,
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * Bundled gallery images removed from the codebase (gallery is now 100%
 * database-driven via the admin studio). Plates still referencing them —
 * e.g. from an older localStorage copy or an early Redis seed — are dropped
 * on load so no hardcoded picture can resurface.
 */
const RETIRED_BUNDLED_GALLERY_SRC = new Set([
  "/images/hero/hero-1.webp",
  "/images/about/joshua.jpg",
  "/images/workspace/workspace.jpg",
]);

/** Old bundled paths rewritten to current files so stored copies can't pin dead images. */
const MIGRATED_PROJECT_IMAGES: Record<string, string> = {
  "/images/projects/carbonethics.jpg": "/images/projects/carbonethics-homepage.jpg",
  "/images/projects/pokemon.jpg": "/images/projects/pokemon-app.jpg",
  "/images/projects/gns3.jpg": "/images/projects/gns3-project.jpg",
  "/images/projects/xpense.jpg": "/images/projects/xpense.mp4",
};

export function sanitizePortfolio(raw: unknown): PortfolioData | null {
  if (!isObject(raw)) return null;
  try {
    const data = raw as Partial<PortfolioData>;
    if (!isObject(data.personalInfo)) return null;
    if (!Array.isArray(data.projects)) return null;
    if (!Array.isArray(data.techCategories)) return null;
    // Shallow-validate, then deep-merge over defaults so missing keys can't crash the site.
    // Normalize project images: empty/invalid src crashes next/image ("Failed to construct 'URL'").
    const projects = (data.projects as ProjectItem[]).map((p) => {
      const img = typeof p.image === "string" ? p.image.trim() : "";
      const migrated = MIGRATED_PROJECT_IMAGES[img] ?? img;
      const valid = migrated.startsWith("/") || migrated.startsWith("https://") || migrated.startsWith("http://");
      const next: ProjectItem = !valid
        ? { ...p, image: "/images/projects/pokemon-app.jpg" }
        : migrated !== img
          ? { ...p, image: migrated }
          : p;
      // Staging move: old production URL persisted in stored copies.
      if (
        (next.id === "carbonethics-platform" || next.slug === "carbonethics-platform") &&
        typeof next.liveUrl === "string" &&
        next.liveUrl.includes("carbonethics.org")
      ) {
        return { ...next, liveUrl: "https://web-staging.carbonethics.co/" };
      }
      // Demo + APK links added later: stored copies predate them.
      if (next.id === "pokemon-explorer" || next.slug === "pokemon-explorer") {
        let patched = next;
        if (!patched.liveUrl) {
          patched = { ...patched, liveUrl: "https://pokemon-app-sigma-blond.vercel.app/" };
        }
        if (!patched.downloadUrl) {
          patched = { ...patched, downloadUrl: "https://github.com/SwithinHalee/pokemon-app/releases/download/v1.0.0/Pokedex.apk" };
        }
        return patched;
      }
      return next;
    });
    return {
      personalInfo: {
        ...DEFAULT_PORTFOLIO.personalInfo,
        ...(data.personalInfo as object),
        // Contact fields are deep-cleaned on load (see cleanEmail) because
        // invisible characters silently break mailto: links.
        email: typeof (data.personalInfo as Partial<PersonalInfoData>).email === "string"
          ? cleanEmail(((data.personalInfo as Partial<PersonalInfoData>).email as string))
          : DEFAULT_PORTFOLIO.personalInfo.email,
        github: typeof (data.personalInfo as Partial<PersonalInfoData>).github === "string"
          ? ((data.personalInfo as Partial<PersonalInfoData>).github as string).trim()
          : DEFAULT_PORTFOLIO.personalInfo.github,
        linkedin: typeof (data.personalInfo as Partial<PersonalInfoData>).linkedin === "string"
          ? ((data.personalInfo as Partial<PersonalInfoData>).linkedin as string).trim()
          : DEFAULT_PORTFOLIO.personalInfo.linkedin,
      },
      projects,
      workspaceSetup: Array.isArray(data.workspaceSetup) ? (data.workspaceSetup as SetupItem[]) : DEFAULT_PORTFOLIO.workspaceSetup,
      techCategories: data.techCategories as TechCategory[],
      principles: Array.isArray(data.principles) ? (data.principles as PrincipleItem[]) : DEFAULT_PORTFOLIO.principles,
      experiences: Array.isArray(data.experiences) ? (data.experiences as ExperienceItem[]) : DEFAULT_PORTFOLIO.experiences,
      education: Array.isArray(data.education) ? (data.education as EducationItem[]) : DEFAULT_PORTFOLIO.education,
      gallery: Array.isArray(data.gallery)
        ? (data.gallery as GalleryPlate[])
            .filter((g) => !RETIRED_BUNDLED_GALLERY_SRC.has(typeof g.src === "string" ? g.src.trim() : ""))
            .map((g) => ({
              ...g,
              span: g.span === "wide" || g.span === "half" || g.span === "tall" || g.span === "trio" ? g.span : "half" as const,
            }))
        : DEFAULT_PORTFOLIO.gallery,
      colophon: { ...DEFAULT_PORTFOLIO.colophon, ...((data.colophon as object) ?? {}) },
    };
  } catch {
    return null;
  }
}

/**
 * Aggressive email cleaner: strips ALL whitespace plus invisible format
 * characters (zero-width spaces, soft hyphens, BOM) that copy-paste sneaks
 * in and that String.trim() does NOT remove. Any of them silently kills
 * mailto: links while the address still looks correct on screen.
 */
export function cleanEmail(raw: string): string {
  return raw.replace(/[\s\u200B-\u200D\uFEFF\u00AD\u2060\u180E]/g, "");
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function loadPortfolioData(): PortfolioData {  if (typeof window === "undefined") return DEFAULT_PORTFOLIO;
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO;
    const parsed: unknown = JSON.parse(raw);
    return sanitizePortfolio(parsed) ?? DEFAULT_PORTFOLIO;
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded or private mode — edits stay in memory for the session.
  }
}

export function resetPortfolioData(): PortfolioData {  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return DEFAULT_PORTFOLIO;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `project-${Date.now()}`;
}

export function newProjectId(slug: string): string {
  return `${slug}-${Math.random().toString(36).slice(2, 7)}`;
}

function tsString(value: string): string {
  return JSON.stringify(value);
}

function tsStringArray(values: string[], indent: string): string {
  if (values.length === 0) return "[]";
  return `[\n${values.map((v) => `${indent}  ${tsString(v)},`).join("\n")}\n${indent}]`;
}

function generateProjectTs(p: ProjectItem, indent: string): string {
  const i2 = `${indent}  `;
  const i3 = `${indent}    `;
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${i2}id: ${tsString(p.id)},`);
  lines.push(`${i2}slug: ${tsString(p.slug)},`);
  lines.push(`${i2}title: ${tsString(p.title)},`);
  lines.push(`${i2}category: ${tsString(p.category)},`);
  lines.push(`${i2}summary: ${tsString(p.summary)},`);
  lines.push(`${i2}description: ${tsString(p.description)},`);
  lines.push(`${i2}image: ${tsString(p.image)},`);
  lines.push(`${i2}technicalHighlights: ${tsStringArray(p.technicalHighlights, i2)},`);
  if (p.metrics && p.metrics.length > 0) {
    lines.push(`${i2}metrics: [`);
    for (const m of p.metrics) {
      lines.push(`${i3}{ label: ${tsString(m.label)}, value: ${tsString(m.value)} },`);
    }
    lines.push(`${i2}],`);
  }
  lines.push(`${i2}tags: ${tsStringArray(p.tags, i2)},`);
  if (p.liveUrl) lines.push(`${i2}liveUrl: ${tsString(p.liveUrl)},`);
  if (p.githubUrl) lines.push(`${i2}githubUrl: ${tsString(p.githubUrl)},`);
  if (p.downloadUrl) lines.push(`${i2}downloadUrl: ${tsString(p.downloadUrl)},`);
  lines.push(`${i2}featured: ${p.featured ? "true" : "false"},`);
  lines.push(`${i2}gridSpan: ${tsString(p.gridSpan)},`);
  if (p.badge) {
    lines.push(`${i2}badge: {`);
    lines.push(`${i3}text: ${tsString(p.badge.text)},`);
    lines.push(`${i3}variant: ${tsString(p.badge.variant)},`);
    if (p.badge.customColor) lines.push(`${i3}customColor: ${tsString(p.badge.customColor)},`);
    lines.push(`${i2}},`);
  }
  lines.push(`${i2}caseStudy: {`);
  lines.push(`${i3}clientOrContext: ${tsString(p.caseStudy.clientOrContext)},`);
  lines.push(`${i3}timeline: ${tsString(p.caseStudy.timeline)},`);
  lines.push(`${i3}role: ${tsString(p.caseStudy.role)},`);
  lines.push(`${i3}challenge: ${tsString(p.caseStudy.challenge)},`);
  lines.push(`${i3}architectureSolution: ${tsString(p.caseStudy.architectureSolution)},`);
  lines.push(`${i3}deliverables: ${tsStringArray(p.caseStudy.deliverables, i3)},`);
  lines.push(`${i3}technicalDecisions: [`);
  for (const d of p.caseStudy.technicalDecisions) {
    lines.push(`${i3}  { title: ${tsString(d.title)}, rationale: ${tsString(d.rationale)} },`);
  }
  lines.push(`${i3}],`);
  lines.push(`${i2}},`);
  lines.push(`${indent}},`);
  return lines.join("\n");
}

/** Serialize the editable state back to a drop-in `src/data/portfolio.ts`. */
export function exportPortfolioTS(data: PortfolioData): string {
  const pi = data.personalInfo;
  const projectsTs = data.projects.map((p) => generateProjectTs(p, "  ")).join("\n");
  const workspaceTs = data.workspaceSetup
    .map(
      (g) =>
        `  {\n    category: ${tsString(g.category)},\n    items: [\n${g.items
          .map((it) => `      { name: ${tsString(it.name)}, spec: ${tsString(it.spec)} },`)
          .join("\n")}\n    ],\n  },`
    )
    .join("\n");
  const techTs = data.techCategories
    .map(
      (c) =>
        `  {\n    title: ${tsString(c.title)},\n    description: ${tsString(c.description)},\n    skills: [\n${c.skills
          .map(
            (s) =>
              `      { name: ${tsString(s.name)}, detail: ${tsString(s.detail)}${s.kbd ? `, kbd: ${tsString(s.kbd)}` : ""}${s.logos && s.logos.length > 0 ? `, logos: ${tsStringArray(s.logos, "      ")}` : ""} },`
          )
          .join("\n")}\n    ],\n  },`
    )
    .join("\n");
  const principlesTs = data.principles
    .map(
      (p) => `  {\n    number: ${tsString(p.number)},\n    title: ${tsString(p.title)},\n    statement: ${tsString(p.statement)},\n  },`
    )
    .join("\n");
  const expTs = data.experiences
    .map(
      (e) =>
        `  {\n    period: ${tsString(e.period)},\n    role: ${tsString(e.role)},\n    company: ${tsString(e.company)},\n    location: ${tsString(e.location)},\n    type: ${tsString(e.type)},\n    impact: ${tsString(e.impact)},\n    technologies: ${tsStringArray(e.technologies, "    ")},${e.image ? `\n    image: ${tsString(e.image)},` : ""}${e.imageLink ? `\n    imageLink: ${tsString(e.imageLink)},` : ""}${e.imageAlt ? `\n    imageAlt: ${tsString(e.imageAlt)},` : ""}\n  },`
    )
    .join("\n");
  const eduTs = data.education
    .map(
      (e) =>
        `  {\n    period: ${tsString(e.period)},\n    degree: ${tsString(e.degree)},\n    institution: ${tsString(e.institution)},\n    details: ${tsString(e.details)},${e.image ? `\n    image: ${tsString(e.image)},` : ""}${e.imageLink ? `\n    imageLink: ${tsString(e.imageLink)},` : ""}${e.imageAlt ? `\n    imageAlt: ${tsString(e.imageAlt)},` : ""}\n  },`
    )
    .join("\n");
  const galleryTs = data.gallery
    .map(
      (g) =>
        `  {\n    src: ${tsString(g.src)},\n    alt: ${tsString(g.alt)},\n    title: ${tsString(g.title)},\n    detail: ${tsString(g.detail)},\n    span: ${tsString(g.span)},\n  },`
    )
    .join("\n");

  return `export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  technicalHighlights: string[];
  metrics?: { label: string; value: string }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  featured: boolean;
  gridSpan: "col-span-12" | "col-span-12 lg:col-span-7" | "col-span-12 lg:col-span-5";
  badge?: {
    text: string;
    variant: "green" | "blue" | "amber" | "red" | "custom";
    customColor?: string;
  };
  caseStudy: {
    clientOrContext: string;
    timeline: string;
    role: string;
    challenge: string;
    architectureSolution: string;
    deliverables: string[];
    technicalDecisions: { title: string; rationale: string }[];
  };
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  impact: string;
  technologies: string[];
  image?: string;
  imageLink?: string;
  imageAlt?: string;
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  details: string;
  image?: string;
  imageLink?: string;
  imageAlt?: string;
}

export interface TechCategory {
  title: string;
  description: string;
  skills: { name: string; detail: string; kbd?: string; logos?: string[] }[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  statement: string;
}

export interface SetupItem {
  category: string;
  items: { name: string; spec: string }[];
}

export interface GalleryPlate {
  src: string;
  alt: string;
  title: string;
  detail: string;
  span: "wide" | "half" | "tall" | "trio";
}

export const PERSONAL_INFO = {
  name: ${tsString(pi.name)},
  callsign: ${tsString(pi.callsign)},
  role: ${tsString(pi.role)},
  institution: ${tsString(pi.institution)},
  currentRole: ${tsString(pi.currentRole)},
  location: ${tsString(pi.location)},
  timezone: ${tsString(pi.timezone)},
  availability: {
    status: ${tsString(pi.availability.status)},
    badgeType: ${tsString(pi.availability.badgeType)} as const,${pi.availability.customColor ? `\n    customColor: ${tsString(pi.availability.customColor)},` : ""}
    visible: ${pi.availability.visible === false ? "false" : "true"},
  },
  headline: ${tsString(pi.headline)},
  bio: ${tsString(pi.bio)},
  heroNote: ${tsString(pi.heroNote)},
  engagementLabel: ${tsString(pi.engagementLabel)},
  engagementValue: ${tsString(pi.engagementValue)},
  focusLabel: ${tsString(pi.focusLabel)},
  focusValue: ${tsString(pi.focusValue)},
  ctaLabel: ${tsString(pi.ctaLabel)},
  quickFacts: [
${pi.quickFacts.map((f) => `    { label: ${tsString(f.label)}, value: ${tsString(f.value)} },`).join("\n")}
  ],
  email: ${tsString(pi.email)},
  github: ${tsString(pi.github)},
  linkedin: ${tsString(pi.linkedin)},
};

export const PROJECTS: ProjectItem[] = [
${projectsTs}
];

export const WORKSPACE_SETUP: SetupItem[] = [
${workspaceTs}
];

export const TECH_CATEGORIES: TechCategory[] = [
${techTs}
];

export const ENGINEERING_PRINCIPLES: PrincipleItem[] = [
${principlesTs}
];

export const EXPERIENCES: ExperienceItem[] = [
${expTs}
];

export const EDUCATION_HISTORY: EducationItem[] = [
${eduTs}
];

export const GALLERY_PLATES: GalleryPlate[] = [
${galleryTs}
];

export const COLOPHON_SPECS = {
  designerDeveloper: ${tsString(data.colophon.designerDeveloper)},
  typography: ${tsStringArray(data.colophon.typography, "  ")},
  framework: ${tsString(data.colophon.framework)},
  styling: ${tsString(data.colophon.styling)},
  icons: ${tsString(data.colophon.icons)},
  protocol: ${tsString(data.colophon.protocol)},
  year: ${tsString(data.colophon.year)},
};
`;
}
