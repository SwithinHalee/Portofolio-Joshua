export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  technicalHighlights: string[];
  metrics?: { label: string; value: string }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  gridSpan: "col-span-12" | "col-span-12 lg:col-span-7" | "col-span-12 lg:col-span-5";
  badge?: {
    text: string;
    variant: "green" | "blue" | "amber" | "red";
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
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  details: string;
}

export interface TechCategory {
  title: string;
  description: string;
  skills: { name: string; detail: string; kbd?: string }[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  statement: string;
}

export const PERSONAL_INFO = {
  name: "Joshua Abdiel",
  callsign: "Josh",
  role: "Frontend Engineer & Information Systems Student",
  institution: "Universitas Tarumanagara",
  currentRole: "Frontend Engineering Intern at CarbonEthics",
  location: "Tangerang, Banten, Indonesia",
  timezone: "WIB (UTC+7)",
  availability: {
    status: "Internship Active • Open for Q4 2026 Roles",
    badgeType: "green" as const,
  },
  headline: "Engineering deliberate web interfaces with architectural rigor & utilitarian precision.",
  bio: "Frontend engineer and Information Systems undergraduate at Universitas Tarumanagara. Currently building climate-tech interfaces at CarbonEthics, focusing on web performance, component architecture, and type-safe systems.",
  email: "joshuaabdiel365@gmail.com",
  github: "https://github.com/SwithinHalee",
  linkedin: "https://www.linkedin.com/in/joshua-abdiel-773965282/",
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "carbonethics-platform",
    title: "CarbonEthics Web Platform",
    category: "Flagship / Climate Tech & Carbon Intelligence",
    summary:
      "Enterprise sustainability web interface facilitating corporate and individual carbon offset calculations, mangrove restoration initiatives, and environmental monitoring.",
    description:
      "Engineered responsive, highly performant frontend components for CarbonEthics. Focused on dynamic carbon calculation workflows, accessible UI patterns, and efficient hydration performance across diverse client viewports.",
    technicalHighlights: [
      "Dynamic offset calculator engine with real-time carbon metric estimation",
      "Modular design-token integration ensuring 100% brand consistency",
      "Hydration and asset optimization targeting sub-second Largest Contentful Paint",
    ],
    metrics: [
      { label: "Performance", value: "Sub-second LCP" },
      { label: "Architecture", value: "Next.js App Router" },
      { label: "Design Token", value: "Tailwind UI System" },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "REST API"],
    liveUrl: "https://www.carbonethics.org",
    featured: true,
    gridSpan: "col-span-12",
    badge: {
      text: "PRODUCTION CLIENT PLATFORM",
      variant: "green",
    },
  },
  {
    id: "xpense-ledger",
    title: "Xpense Ledger",
    category: "Financial Engineering / Personal Accounting",
    summary:
      "Minimalist financial tracker and expense allocation engine providing clean tabular ledger views, recurring transaction math, and budgetary insights.",
    description:
      "Engineered to replace bloated financial trackers with a fast, zero-friction accounting interface. Built with strict client-side validation, categorical cash flow aggregation, and local persistence.",
    technicalHighlights: [
      "Tabular ledger with instant client-side filtering and sorting",
      "Mathematical aggregation pipeline calculating burn rate and category ratios",
      "Strict data sanitization and modular state encapsulation",
    ],
    metrics: [
      { label: "Load Time", value: "< 250ms" },
      { label: "State", value: "Zero Re-render Waste" },
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "Client State", "Chart.js"],
    githubUrl: "https://github.com/SwithinHalee/Xpense",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-7",
    badge: {
      text: "OPEN SOURCE REPO",
      variant: "blue",
    },
  },
  {
    id: "pokemon-explorer",
    title: "PokeAPI Virtual Explorer",
    category: "Frontend System / Data Visualization",
    summary:
      "High-throughput encyclopedia application consuming the PokeAPI, featuring aggressive client-side caching, virtualized listing, and stat comparison radars.",
    description:
      "Explores scalable pagination and asynchronous cache-first data fetching. Features instant search indexing, dual-type filtering matrices, and detailed numerical baseline comparisons.",
    technicalHighlights: [
      "Cache-first query pipeline preventing redundant network trips",
      "Adaptive search with debounce and multi-type matrix intersection",
      "Responsive metric breakdown bars rendered with CSS grid",
    ],
    metrics: [
      { label: "API Cache Hit", value: "98% Repeat Rate" },
      { label: "Search Index", value: "Instant Sub-10ms" },
    ],
    tags: ["React", "TypeScript", "TanStack Query", "PokeAPI", "Tailwind CSS"],
    githubUrl: "https://github.com/SwithinHalee/pokemon-app",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-5",
    badge: {
      text: "TECHNICAL EXPERIMENT",
      variant: "amber",
    },
  },
  {
    id: "gns3-data-sharing",
    title: "GNS3 Network Topology & Data Sharing Simulation",
    category: "Systems & Network Infrastructure / Packet Routing",
    summary:
      "Emulated enterprise network architecture validating segmented peer-to-peer data distribution, protocol routing, access control lists, and packet analysis.",
    description:
      "Designed and tested in Graphical Network Simulator-3 (GNS3). Emulates router configurations, VLAN segmentation, and multi-node packet exchange security protocols across distributed workstation clusters.",
    technicalHighlights: [
      "Multi-subnet IP addressing scheme and dynamic route distribution",
      "Packet verification using Wireshark to validate protocol handshakes",
      "Network isolation testing ensuring secure node-to-node file distribution",
    ],
    metrics: [
      { label: "Simulation Engine", value: "GNS3 Topology" },
      { label: "Verification", value: "Wireshark PCAP" },
    ],
    tags: ["GNS3", "Computer Networks", "Packet Routing", "VLANs", "Wireshark"],
    githubUrl: "https://github.com/SwithinHalee/Data-Sharing-GNS3",
    featured: true,
    gridSpan: "col-span-12",
    badge: {
      text: "SYSTEM ARCHITECTURE",
      variant: "blue",
    },
  },
];

export const TECH_CATEGORIES: TechCategory[] = [
  {
    title: "Frontend Architecture",
    description: "Production web interfaces, modern component systems, and state synchronization.",
    skills: [
      { name: "TypeScript", detail: "End-to-end strict typing & contract safety", kbd: "TS" },
      { name: "React 19 & Next.js", detail: "App Router, SSR, Server Components & Hydration", kbd: "NEXT" },
      { name: "Tailwind CSS v4", detail: "Custom design systems & tokenized hairlines", kbd: "CSS" },
      { name: "TanStack Query", detail: "Asynchronous state, caching & query invalidation", kbd: "RQ" },
      { name: "Framer Motion", detail: "Subtle micro-interactions & hardware-accelerated reveals", kbd: "FM" },
    ],
  },
  {
    title: "Systems & Backend Integration",
    description: "API communication, schema design, and server-side data models.",
    skills: [
      { name: "RESTful API Design", detail: "HTTP methods, status semantics & payload contracts", kbd: "REST" },
      { name: "Node.js & Runtime", detail: "JavaScript server environments & asynchronous event loop", kbd: "NODE" },
      { name: "PostgreSQL & Relational DB", detail: "Table schema design, foreign keys & query hygiene", kbd: "SQL" },
      { name: "Network Engineering", detail: "TCP/IP, routing protocols, subnets & GNS3 emulation", kbd: "NET" },
    ],
  },
  {
    title: "Tooling & Workflow Precision",
    description: "Daily engineering instrument cluster for development, debugging, and review.",
    skills: [
      { name: "VS Code", detail: "Strict linting, TypeScript compiler integration & keybindings", kbd: "IDE" },
      { name: "Postman", detail: "Endpoint interrogation, payload mocking & automated testing", kbd: "API" },
      { name: "Git & GitHub", detail: "Branching strategies, semantic commits & PR reviews", kbd: "GIT" },
      { name: "Figma", detail: "Design handoff, spacing audits & layout geometry parsing", kbd: "FIGMA" },
    ],
  },
];

export const ENGINEERING_PRINCIPLES: PrincipleItem[] = [
  {
    number: "01",
    title: "Type Safety as a Binding Contract",
    statement:
      "Strict TypeScript interfaces prevent runtime defects at compile-time. We never pass untyped 'any' across component borders or network requests.",
  },
  {
    number: "02",
    title: "Performance as a Core UX Feature",
    statement:
      "Fast interfaces respect the user's attention. We optimize asset payloads, prevent extraneous re-renders, and preserve sub-second initial content painting.",
  },
  {
    number: "03",
    title: "1px Border Precision & Macro-Whitespace",
    statement:
      "Restrained aesthetics outlast trends. We construct layouts with deliberate vertical breathing room, warm monochromatic contrast, and zero visual clutter.",
  },
  {
    number: "04",
    title: "Utilitarian Clarity Over Superficial Cleverness",
    statement:
      "Maintainable, readable code beats obscure one-liners. Interfaces must be intuitive and systems must be predictable to future maintainers.",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "Feb 2026 — Oct 2026",
    role: "Frontend Engineering Intern",
    company: "CarbonEthics",
    location: "Jakarta / Hybrid",
    type: "Internship",
    impact:
      "Contributed to frontend development for CarbonEthics' client-facing platform. Implemented responsive interfaces for carbon footprint and tree planting initiatives, maintained design-token consistency, and ensured smooth cross-device accessibility.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "REST API", "Figma"],
  },
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    period: "2023 — Present",
    degree: "Bachelor of Science in Information Systems (Sistem Informasi)",
    institution: "Universitas Tarumanagara (UNTAR)",
    details:
      "Focusing on enterprise information architecture, software development methodologies, database systems, and full-stack web applications.",
  },
  {
    period: "Primary, Junior & Senior High",
    degree: "Formal Education Track",
    institution: "Santo Fransiskus Asisi",
    details:
      "Comprehensive mathematics and scientific foundation fostering analytical reasoning and systematic problem solving.",
  },
];

export const COLOPHON_SPECS = {
  designerDeveloper: "Joshua Abdiel",
  typography: ["Newsreader (Display Editorial Serif)", "Geist Sans (Clean Grotesk)", "Geist Mono (Technical Monospace)"],
  framework: "Next.js 16 (App Router) + React 19",
  styling: "Tailwind CSS v4 + Custom Micro-Border Tokens",
  icons: "Phosphor Icons (Uniform Stroke Weight)",
  protocol: "Leonxlnx/taste-skill Architecture (Minimalist UI & Full Output)",
  year: "2026",
};