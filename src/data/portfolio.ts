export interface ProjectItem {
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
    /** Base hex (e.g. "#7C3AED") used when variant is "custom". */
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
  /** Optional visual: uploadable image shown with the entry. */
  image?: string;
  /** Destination opened when the image is clicked. */
  imageLink?: string;
  imageAlt?: string;
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  details: string;
  /** Optional visual: uploadable image shown with the entry. */
  image?: string;
  /** Destination opened when the image is clicked. */
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
  /**
   * Layout template — tiles in a 12-col grid, rendered top-to-bottom in order:
   * wide = full row (21:9), half = half row (4:3), tall = half row portrait (3:4),
   * trio = third row square (1:1, groups of three fill a row).
   */
  span: "wide" | "half" | "tall" | "trio";
}

export const PERSONAL_INFO = {
  name: "Joshua Abdiel",
  callsign: "Josh",
  role: "Frontend Developer & Information System Undergraduate",
  institution: "Universitas Tarumanagara (UNTAR)",
  currentRole: "Frontend Engineering Intern at CarbonEthics",
  location: "Tangerang, Banten, Indonesia",
  timezone: "WIB (UTC+7)",
  availability: {
    status: "Internship Active • Open for Q4 2026 Roles",
    badgeType: "green" as const,
    visible: true,
  },
  headline: "Engineering deliberate web interfaces with architectural rigor & utilitarian precision.",
  bio: "Frontend engineer and Information Systems undergraduate at Universitas Tarumanagara. Currently building climate-tech interfaces at CarbonEthics, focusing on web performance, component architecture, and type-safe systems.",
  heroNote: "UNTAR Information Systems • Class of 2027",
  engagementLabel: "Current Engagement:",
  engagementValue: "Frontend Intern at CarbonEthics",
  focusLabel: "Focus Areas:",
  focusValue: "Next.js App Router, TypeScript, Systems Architecture",
  ctaLabel: "Inspect Selected Works",
  quickFacts: [
    { label: "Core Focus", value: "Frontend & Systems" },
    { label: "Affiliation", value: "UNTAR SI '27" },
    { label: "Active Lab", value: "CarbonEthics (FE)" },
    { label: "Standard", value: "Type-Safe & Fast" },
  ],
  email: "joshuaabdiel365@gmail.com",
  github: "https://github.com/SwithinHalee",
  linkedin: "https://www.linkedin.com/in/joshua-abdiel-773965282/",
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "carbonethics-platform",
    slug: "carbonethics-platform",
    title: "CarbonEthics Web Platform",
    category: "Flagship / Climate Tech & Carbon Intelligence",
    summary:
      "Enterprise sustainability web interface facilitating corporate and individual carbon offset calculations, mangrove restoration initiatives, and environmental monitoring.",
    description:
      "Engineered responsive, highly performant frontend components for CarbonEthics. Focused on dynamic carbon calculation workflows, accessible UI patterns, and efficient hydration performance across diverse client viewports.",
    image: "/images/projects/carbonethics-homepage.jpg",
    technicalHighlights: [
      "Dynamic offset calculator engine with real-time carbon metric estimation",
      "Modular design-token integration supporting consistent brand application",
      "Hydration and asset optimization targeting a fast Largest Contentful Paint budget",
    ],
    metrics: [
      { label: "Performance Goal", value: "Fast LCP Budget" },
      { label: "Architecture", value: "Next.js App Router" },
      { label: "Design Token", value: "Tailwind UI System" },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "REST API"],
    liveUrl: "https://web-staging.carbonethics.co/",
    featured: true,
    gridSpan: "col-span-12",
    badge: {
      text: "PRODUCTION CLIENT PLATFORM",
      variant: "green",
    },
    caseStudy: {
      clientOrContext: "CarbonEthics (Climate Tech Organization)",
      timeline: "Feb 2026 — Present",
      role: "Frontend Engineering Intern",
      challenge:
        "Carbon footprint calculations require complex input trees (flight distances, vehicle fuel metrics, enterprise consumption) that historically produced heavy client bundle overhead and slow interactive responses.",
      architectureSolution:
        "Structured modular client-island calculators powered by Next.js Server Components. Kept calculation engines stateless, pure, and strictly typed with TypeScript interfaces.",
      deliverables: [
        "Interactive Carbon Offset Estimator with instant recalculation",
        "Responsive mangrove tree plantation tracking module",
        "Accessible, high-contrast UI theme following WCAG guidance",
      ],
      technicalDecisions: [
        {
          title: "Next.js App Router Hybrid Architecture",
          rationale: "Pre-render static informational copy while isolating dynamic calculator inputs in optimized client boundaries.",
        },
        {
          title: "Strict Interface Typing for Emission Factors",
          rationale: "Reduced runtime estimation errors by establishing immutable mathematical conversion types.",
        },
      ],
    },
  },
  {
    id: "xpense-ledger",
    slug: "xpense-ledger",
    title: "Xpense Ledger",
    category: "Mobile Engineering / Local-first Finance",
    summary:
      "Flutter expense tracker built on MVVM with Provider, a versioned SQLite schema, real-time FX via Frankfurter, 24-hour rate caching, and premium PDF/CSV export.",
    description:
      "Local-first personal finance app for multi-account, multi-currency tracking. ViewModels own auth session and ledger logic, ProxyProvider keeps MainViewModel synced to the logged-in user, and a singleton SQLite service guards a single database connection with foreign keys enforced.",
    image: "/images/projects/xpense.mp4",
    technicalHighlights: [
      "MVVM with Provider and ProxyProvider DI syncing MainViewModel to the active user",
      "SQLite schema v5 (users, accounts, transactions) with UUID keys, cascade deletes, and PRAGMA foreign_keys = ON",
      "Frankfurter FX rates with 24-hour SharedPreferences TTL cache and auto-update toggle",
    ],
    metrics: [
      { label: "Database", value: "SQLite Schema v5" },
      { label: "FX Cache", value: "24h TTL" },
      { label: "Security", value: "SHA-256 + User Isolation" },
    ],
    tags: ["Flutter", "Dart", "Provider (MVVM)", "SQLite (sqflite)", "Frankfurter API", "fl_chart"],
    liveUrl: "https://youtube.com/shorts/I1ZCUK5RzLQ?feature=share",
    githubUrl: "https://github.com/SwithinHalee/Xpense",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-7",
    badge: {
      text: "OPEN SOURCE REPO",
      variant: "blue",
    },
    caseStudy: {
      clientOrContext: "Personal Engineering Project",
      timeline: "2025 — 2026",
      role: "Sole Mobile Engineer (Flutter)",
      challenge:
        "Most budgeting apps assume one user, one currency, and an always-online connection — plus complex setup, ads, and slow sync on top. Xpense had to work the opposite way: offline-first on a single shared device, with multiple users isolated by userId, each holding several accounts across ISO 4217 currencies. Balances live as REAL values tied to UUID account keys, transactions carry income/expense types with ISO8601 dates and category icon codepoints, and every delete must cascade cleanly through users to accounts to transactions. On top of that ledger core, the app must convert all balances into one base currency with presisi FX math, cache rates for 24 hours to survive rate limits and dead zones, hash passwords with SHA-256 before they ever touch SQLite, generate premium PDF and CSV exports on demand, and aggregate thousands of categorized transactions into interactive pie stats without freezing the UI thread.",
      architectureSolution:
        "MVVM with Provider: models (Account, Transaction, User) use Equatable plus toMap/fromMap, views stay reactive through Consumer, and AuthViewModel plus MainViewModel split session from ledger logic. ProxyProvider injects auth into MainViewModel so every query stays scoped to the logged-in user. SqliteService is a singleton holding one connection to xpense.db with PRAGMA foreign_keys = ON.",
      deliverables: [
        "Multi-account ledger with income/expense CRUD, ISO8601 dates, and category icon codepoints",
        "Dashboard total-balance engine converting every account into the base currency",
        "Frankfurter FX pipeline with SharedPreferences TTL cache and isAutoUpdateEnabled toggle",
        "Premium PDF and CSV export shared via share_plus from path_provider temp files",
        "Interactive fl_chart pie stats grouped by category across daily, weekly, monthly, and yearly periods",
      ],
      technicalDecisions: [
        {
          title: "Relational Schema v5 With Cascade Deletes",
          rationale: "users, accounts, and transactions link through UUID keys and ON DELETE CASCADE, so removing a user or account cleans dependents without orphan rows.",
        },
        {
          title: "24-Hour Manual TTL Rate Cache",
          rationale: "Cached rates keyed per currency with timestamp validation cut bandwidth; cache hit under 24 hours, API miss after, and manual toggle for offline use.",
        },
        {
          title: "SHA-256 Hashing Plus userId-Scoped Queries",
          rationale: "Passwords hash with crypto before storage and login comparison, while every account query filters WHERE userId = ? for cross-user isolation.",
        },
        {
          title: "Isolate Compute Plus RepaintBoundary Charts",
          rationale: "Stat aggregation over 500+ transactions moves to a background isolate, PieTouchData expands the tapped sector, and RepaintBoundary keeps chart repaints isolated.",
        },
      ],
    },
  },
  {
    id: "pokemon-explorer",
    slug: "pokemon-explorer",
    title: "PokeAPI Virtual Explorer",
    category: "Frontend System / Data Visualization",
    summary:
      "High-throughput encyclopedia application consuming the PokeAPI, featuring aggressive client-side caching, virtualized listing, and stat comparison radars.",
    description:
      "Explores scalable pagination and asynchronous cache-first data fetching. Features instant search indexing, dual-type filtering matrices, and detailed numerical baseline comparisons.",
    image: "/images/projects/pokemon-app.jpg",
    technicalHighlights: [
      "Cache-first query pipeline reducing redundant network trips",
      "Adaptive search with debounce and multi-type matrix intersection",
      "Responsive metric breakdown bars rendered with CSS grid",
    ],
    metrics: [
      { label: "API Caching", value: "Cache-first Repeats" },
      { label: "Search", value: "Debounced Instant-feel" },
    ],
    tags: ["React", "TypeScript", "TanStack Query", "PokeAPI", "Tailwind CSS"],
    liveUrl: "https://pokemon-app-sigma-blond.vercel.app/",
    githubUrl: "https://github.com/SwithinHalee/pokemon-app",
    downloadUrl: "https://github.com/SwithinHalee/pokemon-app/releases/download/v1.0.0/Pokedex.apk",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-5",
    badge: {
      text: "TECHNICAL EXPERIMENT",
      variant: "amber",
    },
    caseStudy: {
      clientOrContext: "Experimental Web Architecture",
      timeline: "2025",
      role: "Frontend Engineer",
      challenge:
        "The public PokeAPI has rate limits and separate endpoints for species, stats, and abilities. Naive implementation results in hundreds of cascade network requests.",
      architectureSolution:
        "Engineered an aggressive TanStack Query cache layer with memory persistence, debounced search filters, and pre-fetching of adjacent entries.",
      deliverables: [
        "Virtualized multi-generation monster index",
        "Multi-attribute filter matrix with instant intersection calculation",
        "Comparative baseline stat visualizer",
      ],
      technicalDecisions: [
        {
          title: "Stale-While-Revalidate Query Strategy",
          rationale: "Cached responses render without waiting on the network, only querying delta changes in background.",
        },
        {
          title: "Component Level Error Boundaries",
          rationale: "Limits the impact of remote image or missing sprite anomalies so they do not cascade to the whole explorer.",
        },
      ],
    },
  },
  {
    id: "gns3-data-sharing",
    slug: "gns3-data-sharing",
    title: "GNS3 Network Topology & Data Sharing Simulation",
    category: "Systems & Network Infrastructure / Packet Routing",
    summary:
      "Emulated enterprise network architecture validating segmented peer-to-peer data distribution, protocol routing, access control lists, and packet analysis.",
    description:
      "Designed and tested in Graphical Network Simulator-3 (GNS3). Emulates router configurations, VLAN segmentation, and multi-node packet exchange security protocols across distributed workstation clusters.",
    image: "/images/projects/gns3-project.jpg",
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
    caseStudy: {
      clientOrContext: "UNTAR Systems & Networking Lab",
      timeline: "2024 — 2025",
      role: "Network Systems Architect",
      challenge:
        "Simulating enterprise-grade peer-to-peer data sharing while strictly maintaining VLAN boundary security and preventing broadcast packet flooding.",
      architectureSolution:
        "Configured virtualized Cisco router instances in GNS3 with sub-interface routing, Access Control Lists (ACLs), and packet flow validation in Wireshark.",
      deliverables: [
        "Complete enterprise topology emulation file",
        "IP address scheme documentation & routing tables",
        "Packet capture logs with no leakage observed between segmented VLANs in lab captures",
      ],
      technicalDecisions: [
        {
          title: "Segmented VLAN Subnetting",
          rationale: "Isolated workstation traffic from sensitive server clusters.",
        },
        {
          title: "Wireshark Protocol Analysis",
          rationale: "Audited TCP handshake efficiency and dropped unauthorized ICMP packets at boundary switches.",
        },
      ],
    },
  },
];

export const WORKSPACE_SETUP: SetupItem[] = [
  {
    category: "Hardware & Physical Instruments",
    items: [
      { name: "Primary Machine", spec: "Custom Workstation / Portable Silicon" },
      { name: "Display", spec: "High-DPI Calibrated IPS Monitor (100% sRGB, manufacturer rated)" },
      { name: "Input", spec: "Custom Mechanical Keyboard (Lubed Linears) & Precision Ergonomic Mouse" },
      { name: "Audio", spec: "Open-back reference monitors for focused engineering sessions" },
    ],
  },
  {
    category: "Software Environment & Editor",
    items: [
      { name: "Code Editor", spec: "VS Code with Minimal Monokai / Clean Hairline Theme" },
      { name: "Font", spec: "Geist Mono & JetBrains Mono (Ligatures active)" },
      { name: "Shell & Terminal", spec: "PowerShell & Unix Terminal with Starship prompt" },
      { name: "AI Pair Engine", spec: "Google Antigravity CLI & Gemini 3.8 Advanced Suite" },
    ],
  },
  {
    category: "DevOps & Engineering Suite",
    items: [
      { name: "API Client", spec: "Postman & curl for HTTP protocol interrogation" },
      { name: "Design Handoff", spec: "Figma (Token inspections, grid geometry & SVG exports)" },
      { name: "Version Control", spec: "Git via CLI & GitHub Enterprise/Personal workflows" },
      { name: "Network Emulation", spec: "GNS3 & Wireshark for packet routing verification" },
    ],
  },
];

export const TECH_CATEGORIES: TechCategory[] = [
  {
    title: "Frontend Architecture",
    description: "Production web interfaces, modern component systems, and state synchronization.",
    skills: [
      { name: "TypeScript", detail: "End-to-end strict typing & contract safety", kbd: "TS", logos: ["typescript"] },
      { name: "React 19 & Next.js", detail: "App Router, SSR, Server Components & Hydration", kbd: "NEXT", logos: ["react", "nextdotjs"] },
      { name: "Tailwind CSS v4", detail: "Custom design systems & tokenized hairlines", kbd: "CSS", logos: ["tailwindcss"] },
      { name: "TanStack Query", detail: "Asynchronous state, caching & query invalidation", kbd: "RQ", logos: ["tanstack"] },
      { name: "Framer Motion", detail: "Subtle micro-interactions & hardware-accelerated reveals", kbd: "FM", logos: ["framer"] },
    ],
  },
  {
    title: "Systems & Backend Integration",
    description: "API communication, schema design, and server-side data models.",
    skills: [
      { name: "RESTful API Design", detail: "HTTP methods, status semantics & payload contracts", kbd: "REST" },
      { name: "Node.js & Runtime", detail: "JavaScript server environments & asynchronous event loop", kbd: "NODE", logos: ["nodedotjs"] },
      { name: "PostgreSQL & Relational DB", detail: "Table schema design, foreign keys & query hygiene", kbd: "SQL", logos: ["postgresql"] },
      { name: "Network Engineering", detail: "TCP/IP, routing protocols, subnets & GNS3 emulation", kbd: "NET" },
    ],
  },
  {
    title: "Tooling & Workflow Precision",
    description: "Daily engineering instrument cluster for development, debugging, and review.",
    skills: [
      { name: "VS Code", detail: "Strict linting, TypeScript compiler integration & keybindings", kbd: "IDE" },
      { name: "Postman", detail: "Endpoint interrogation, payload mocking & automated testing", kbd: "API", logos: ["postman"] },
      { name: "Git & GitHub", detail: "Branching strategies, semantic commits & PR reviews", kbd: "GIT", logos: ["git", "github"] },
      { name: "Figma", detail: "Design handoff, spacing audits & layout geometry parsing", kbd: "FIGMA", logos: ["figma"] },
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
      "Contributed to frontend development for CarbonEthics' client-facing platform. Implemented responsive interfaces for carbon footprint and tree planting initiatives, maintained design-token consistency, and supported cross-device accessibility.",
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

// Gallery plates are fully managed from the admin studio (/admin → Gallery)
// and persisted in the database (Upstash Redis). No bundled images here —
// add exposures via Upload instead of hardcoding paths.
export const GALLERY_PLATES: GalleryPlate[] = [];

export const COLOPHON_SPECS = {  designerDeveloper: "Joshua Abdiel",
  typography: ["Newsreader (Display Editorial Serif)", "Geist Sans (Clean Grotesk)", "Geist Mono (Technical Monospace)"],
  framework: "Next.js 16 (App Router) + React 19",
  styling: "Tailwind CSS v4 + Custom Micro-Border Tokens",
  icons: "Phosphor Icons (Uniform Stroke Weight)",
  protocol: "Leonxlnx/taste-skill Architecture (Minimalist UI & Full Output)",
  year: "2026",
};