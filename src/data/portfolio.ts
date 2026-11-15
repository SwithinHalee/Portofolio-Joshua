export interface ProjectVideoItem {
  title: string;
  videoId: string;
  thumbnail: string;
  views: string;
  duration: string;
  published: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  /** Optional static preview/poster image used when `image` points to a video demo. */
  previewImage?: string;
  /** Optional showcase of real published video thumbnails and view stats. */
  videoGallery?: ProjectVideoItem[];
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

export interface ExperienceGalleryItem {
  src: string;
  alt: string;
  caption?: string;
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
  /** Optional spanning gallery frames rendered beneath this experience entry. */
  gallery?: ExperienceGalleryItem[];
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
  /** Optional spanning gallery frames rendered beneath this education entry. */
  gallery?: ExperienceGalleryItem[];
}

export interface TechCategory {
  title: string;
  description: string;
  skills: { name: string; detail: string; kbd?: string; logos?: string[]; url?: string }[];
}

export interface PrincipleItem {
  number: string;
  title: string;
  statement: string;
  /** Optional item-specific context shown when this row is expanded. */
  note?: string;
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
   * Layout template: tiles in a 12-col grid, rendered top-to-bottom in order:
   * wide = full row (21:9), half = half row (4:3), tall = half row portrait (3:4),
   * trio = third row square (1:1, groups of three fill a row).
   */
  span: "wide" | "half" | "tall" | "trio";
}

export const PERSONAL_INFO = {
  name: "Joshua Abdiel",
  callsign: "Josh",
  role: "Frontend Developer & Information System Undergraduate",
  institution: "Tarumanagara University (UNTAR)",
  currentRole: "Frontend Developer Intern at CarbonEthics",
  location: "Tangerang, Banten, Indonesia",
  timezone: "WIB (UTC+7)",
  availability: {
    status: "Internship Active • Open for Q4 2026 Roles",
    badgeType: "green" as const,
    visible: true,
  },
  headline: "Engineering deliberate web interfaces with architectural rigor & utilitarian precision.",
  bio: "Frontend engineer and Information Systems undergraduate at Tarumanagara University. Currently building climate-tech interfaces at CarbonEthics, focusing on web performance, component architecture, and type-safe systems.",
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
  instagram: "https://www.instagram.com/abd.joshua?dlrf=MmlsaGp4NmJydHlp",
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
    liveUrl: "https://www.carbonethics.co/",
    featured: true,
    gridSpan: "col-span-12",
    badge: {
      text: "PRODUCTION CLIENT PLATFORM",
      variant: "green",
    },
    caseStudy: {
      clientOrContext: "CarbonEthics (Climate Tech Organization)",
      timeline: "Feb 2026 - Feb 2027",
      role: "Frontend Developer Intern",
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
    id: "statshark-exporter",
    slug: "statshark-exporter",
    title: "StatShark War Thunder Exporter",
    category: "Desktop Utility / Direct API Automation",
    summary:
      "High-speed Python desktop utility for War Thunder players that resolves UIDs and extracts vehicle performance records from StatShark in ~1–2s into structured CSV, TXT, and JSON files.",
    description:
      "Engineered a standalone Windows desktop exporter (Tkinter + PyInstaller) backed by Chrome DevTools Protocol token capture and TLS-impersonated API requests. Instead of slow DOM scraping, it captures Turnstile verification tokens in a silent off-screen browser, caches tokens with a 20-minute TTL, and parses complete player profiles and per-vehicle statistics directly from StatShark's backend endpoints.",
    image: "/images/projects/statshark-export.mp4",
    previewImage: "/images/projects/statshark-exporter.jpg",
    technicalHighlights: [
      "Silent CDP (Chrome/Edge WebSocket) token capture with 20-minute TTL caching & 401/406 auto-refresh",
      "Direct StatShark REST fetching via curl_cffi TLS impersonation (~1–2s full profile turnaround)",
      "Multi-format batch exporter outputting Realistic & Arcade CSV sheets (17 metrics), Summary TXT, and Raw JSON",
    ],
    metrics: [
      { label: "Fetch Latency", value: "~1–2s Direct API" },
      { label: "Auth Cache", value: "20m Token TTL" },
      { label: "Exports", value: "CSV · TXT · JSON" },
    ],
    tags: ["Python", "Tkinter", "curl_cffi", "WebSockets / CDP", "PyInstaller", "CSV / JSON"],
    githubUrl: "https://github.com/SwithinHalee/statshark-exporter",
    featured: true,
    gridSpan: "col-span-12 lg:col-span-7",
    badge: {
      text: "OPEN SOURCE REPO",
      variant: "blue",
    },
    caseStudy: {
      clientOrContext: "Open Source Desktop Tooling",
      timeline: "Oct 2026",
      role: "Creator & Sole Engineer",
      challenge:
        "Inspecting per-vehicle War Thunder statistics on StatShark for squadron audits or spreadsheet analysis requires tedious manual lookups, while automated scrapers face strict Cloudflare Turnstile gates and slow headless page rendering.",
      architectureSolution:
        "Decoupled security token acquisition from data retrieval. On token expiry, a headless off-screen browser instance attaches over Chrome DevTools Protocol WebSockets, intercepts the X-Turnstile-Token header, and persists it locally for 20 minutes. Subsequent lookups run on background worker threads calling GetIdByName and makestatrequestbyid directly via curl_cffi.",
      deliverables: [
        "17-column Realistic Battles (RB) and Arcade Battles (AB) CSV exports with calculated K/D ratios",
        "Human-readable Summary TXT digest covering player metadata, ban status, and combat totals",
        "Complete Raw JSON API payload archival plus persistent %LOCALAPPDATA% save-directory preferences",
        "Standalone zero-dependency Windows executable (StatShark_Fast_Exporter_GUI.exe) packaged via PyInstaller",
      ],
      technicalDecisions: [
        {
          title: "CDP Header Interception With 20-Minute Local Cache",
          rationale: "Captures short-lived Turnstile tokens silently without browser popups and reuses them safely within StatShark's 25-minute server TTL.",
        },
        {
          title: "Direct API Over DOM Automation",
          rationale: "Replaced multi-second page rendering with TLS-impersonated curl_cffi calls, cutting per-player export latency down to roughly 1–2 seconds.",
        },
        {
          title: "Daemon Worker Threads With Tk Event Marshaling",
          rationale: "Runs network calls and file I/O on daemon threads while scheduling progress bar and console log updates cleanly back via self.after.",
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
    gridSpan: "col-span-12 lg:col-span-5",
    badge: {
      text: "OPEN SOURCE REPO",
      variant: "blue",
    },
    caseStudy: {
      clientOrContext: "Personal Engineering Project",
      timeline: "2025 - 2026",
      role: "Sole Mobile Engineer (Flutter)",
      challenge:
        "Most budgeting apps assume one user, one currency, and an always-online connection, with complex setup, ads, and slow sync on top. Xpense had to work the opposite way: offline-first on a single shared device, with multiple users isolated by userId, each holding several accounts across ISO 4217 currencies. Balances live as REAL values tied to UUID account keys, transactions carry income/expense types with ISO8601 dates and category icon codepoints, and every delete must cascade cleanly through users to accounts to transactions. On top of that ledger core, the app must convert all balances into one base currency with presisi FX math, cache rates for 24 hours to survive rate limits and dead zones, hash passwords with SHA-256 before they ever touch SQLite, generate premium PDF and CSV exports on demand, and aggregate thousands of categorized transactions into interactive pie stats without freezing the UI thread.",
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
    gridSpan: "col-span-12 lg:col-span-7",
    badge: {
      text: "SYSTEM ARCHITECTURE",
      variant: "blue",
    },
    caseStudy: {
      clientOrContext: "UNTAR Systems & Networking Lab",
      timeline: "2024 - 2025",
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
  {
    id: "swithinhalee-youtube",
    slug: "swithinhalee-youtube",
    title: "@SwithinHalee YouTube Lab",
    category: "Content Creation / Defense & Armored Media",
    summary:
      "Long-form YouTube channel (@SwithinHalee) exploring tanks, IFVs, APCs, and Indonesian defense procurement: 13 uploaded video essays accumulating 121.6K total views and 806 subscribers organically.",
    description:
      "An independent YouTube content creation project (@SwithinHalee) producing deep-dive Indonesian-language video essays on armored vehicles (Tank, IFV, APC, Alutsista). Across 13 uploads published between June and December 2025, the channel generated 121,672 views (~9.3K average views per upload, ~11m 38s average runtime), testing thumbnail composition, narrative hooks, and topic positioning.",
    image: "/images/projects/yt-lrwslvYETpI.jpg",
    videoGallery: [
      {
        title: "Tank Boat | Antasena, Inovasi ada, implementasi entah ke mana?",
        videoId: "lrwslvYETpI",
        thumbnail: "/images/projects/yt-lrwslvYETpI.jpg",
        views: "40,562 views",
        duration: "08:44",
        published: "Jul 2025",
        url: "https://www.youtube.com/watch?v=lrwslvYETpI",
      },
      {
        title: "Kenapa Alutsista Indonesia Campur Aduk dari Banyak Negara?",
        videoId: "MNypwzln0NM",
        thumbnail: "/images/projects/yt-MNypwzln0NM.jpg",
        views: "17,943 views",
        duration: "09:22",
        published: "Sep 2025",
        url: "https://www.youtube.com/watch?v=MNypwzln0NM",
      },
      {
        title: "VN12A / ZTZ201 | Tank Baru Dari Negeri Tirai Bambu",
        videoId: "put_3vFD6MM",
        thumbnail: "/images/projects/yt-put_3vFD6MM.jpg",
        views: "17,317 views",
        duration: "06:35",
        published: "Aug 2025",
        url: "https://www.youtube.com/watch?v=put_3vFD6MM",
      },
      {
        title: "Proyek 'Object': Puncak Eksperimen Tank Soviet & Rusia",
        videoId: "LdcAcJBudmA",
        thumbnail: "/images/projects/yt-LdcAcJBudmA.jpg",
        views: "10,532 views",
        duration: "22:03",
        published: "Dec 2025",
        url: "https://www.youtube.com/watch?v=LdcAcJBudmA",
      },
    ],
    technicalHighlights: [
      "Local Indonesian defense essays (Antasena, Alutsista, Harimau, Scorpion, Leopard 2A4) drive ~72% of total channel views",
      "Critical question titles and bold real-photo thumbnail composites significantly outperform routine defense news headlines",
      "Long-form depth (6.5 to 22 min runtimes, 11m 38s mean) sustains organic discovery across 121.6K cumulative views",
    ],
    metrics: [
      { label: "Total Views", value: "121.6K (13 Videos)" },
      { label: "Subscribers", value: "806 Organic" },
      { label: "Top Video", value: "40.5K (Antasena)" },
    ],
    tags: ["Content Creation", "Video Editing", "YouTube", "Channel Analytics", "Research"],
    liveUrl: "https://www.youtube.com/@SwithinHalee",
    featured: false,
    gridSpan: "col-span-12",
    badge: {
      text: "CREATIVE EXPERIMENT",
      variant: "amber",
    },
    caseStudy: {
      clientOrContext: "Personal Media & Analytics Experiment",
      timeline: "Jun 2025 - Ongoing",
      role: "Creator, Scriptwriter & Editor",
      challenge:
        "Standing out in a technical defense and armored vehicle niche where generic spec recaps fail to earn clicks, while discovering which topics, thumbnail layouts, and video lengths retain viewers organically from zero subscribers.",
      architectureSolution:
        "Published 13 structured video essays between June and December 2025 (~121,672 total views, 806 subscribers) using real archival and defense photography composites paired with crisp two-tone headline typography. Post-upload performance comparisons revealed clear topic and framing signals.",
      deliverables: [
        "13 public defense & armored vehicle essays totaling 121,672 views across Jun - Dec 2025",
        "Consistent visual thumbnail system combining real platform photos, flags, and the (S|H) monogram",
        "Channel performance audit identifying Indonesian defense procurement & question-led hooks as top growth drivers",
      ],
      technicalDecisions: [
        {
          title: "Topic Analysis: Local Context Wins (~72% Share)",
          rationale: "Indonesian defense procurement topics (Tank Boat Antasena: 40.5K, Alutsista Mix: 17.9K, FV101 Scorpion: 9.8K, Kaplan MT: 9.5K, Leopard 2A4: 9.3K) generated ~87K+ views compared to 227 - 335 views on regional news topics like J-10C or LCS Malaysia.",
        },
        {
          title: "Packaging Analysis: Critical Questions Beat News Recaps",
          rationale: "Open-ended curiosity titles ('...implementasi entah ke mana?', 'Kenapa Alutsista Campur Aduk?', 'Warisan atau beban?') paired with real photo thumbnails consistently yielded 9K - 40K views per essay.",
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
      { name: "Font", spec: "JetBrains Mono (Ligatures active) & Hanken Grotesk" },
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
      {
        name: "TypeScript",
        detail: "End-to-end strict typing & contract safety",
        kbd: "TS",
        logos: ["typescript"],
        url: "https://www.typescriptlang.org/docs/",
      },
      {
        name: "React 19 & Next.js",
        detail: "App Router, SSR, Server Components & Hydration",
        kbd: "NEXT",
        logos: ["react", "nextdotjs"],
        url: "https://nextjs.org/docs",
      },
      {
        name: "Tailwind CSS v4",
        detail: "Custom design systems & tokenized hairlines",
        kbd: "CSS",
        logos: ["tailwindcss"],
        url: "https://tailwindcss.com/docs",
      },
      {
        name: "TanStack Query",
        detail: "Asynchronous state, caching & query invalidation",
        kbd: "RQ",
        logos: ["tanstack"],
        url: "https://tanstack.com/query/latest",
      },
      {
        name: "Framer Motion",
        detail: "Subtle micro-interactions & hardware-accelerated reveals",
        kbd: "FM",
        logos: ["framer"],
        url: "https://motion.dev/docs",
      },
    ],
  },
  {
    title: "Systems & Backend Integration",
    description: "API communication, schema design, and server-side data models.",
    skills: [
      {
        name: "RESTful API Design",
        detail: "HTTP methods, status semantics & payload contracts",
        kbd: "REST",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      },
      {
        name: "Node.js & Runtime",
        detail: "JavaScript server environments & asynchronous event loop",
        kbd: "NODE",
        logos: ["nodedotjs"],
        url: "https://nodejs.org/en/docs",
      },
      {
        name: "PostgreSQL & Relational DB",
        detail: "Table schema design, foreign keys & query hygiene",
        kbd: "SQL",
        logos: ["postgresql"],
        url: "https://www.postgresql.org/docs/",
      },
      {
        name: "Network Engineering",
        detail: "TCP/IP, routing protocols, subnets & GNS3 emulation",
        kbd: "NET",
        url: "https://docs.gns3.com/",
      },
    ],
  },
  {
    title: "Tooling & Workflow Precision",
    description: "Daily engineering instrument cluster for development, debugging, and review.",
    skills: [
      {
        name: "VS Code",
        detail: "Strict linting, TypeScript compiler integration & keybindings",
        kbd: "IDE",
        url: "https://code.visualstudio.com/docs",
      },
      {
        name: "Postman",
        detail: "Endpoint interrogation, payload mocking & automated testing",
        kbd: "API",
        logos: ["postman"],
        url: "https://www.postman.com/",
      },
      {
        name: "Git & GitHub",
        detail: "Branching strategies, semantic commits & PR reviews",
        kbd: "GIT",
        logos: ["git", "github"],
        url: "https://docs.github.com/en",
      },
      {
        name: "Figma",
        detail: "Design handoff, spacing audits & layout geometry parsing",
        kbd: "FIGMA",
        logos: ["figma"],
        url: "https://www.figma.com/",
      },
    ],
  },
];

export const ENGINEERING_PRINCIPLES: PrincipleItem[] = [
  {
    number: "01",
    title: "Build to Remove Real Friction",
    statement:
      "Most of my personal software started from an itch I wanted gone, whether pulling War Thunder player records in seconds with StatShark Exporter or tracking multi-currency spending offline in Xpense. Useful tools matter more to me than showcase demos.",
    note: "Rooted in real daily use across StatShark Exporter (Python GUI) and Xpense Ledger (Flutter + SQLite).",
  },
  {
    number: "02",
    title: "Bridge Systems Thinking & Interface Craft",
    statement:
      "Studying Information Systems at UNTAR alongside frontend work at CarbonEthics trained me to look at the whole chain: how relational schemas, API contracts, and user clarity depend on one another before a single button renders.",
    note: "Practiced daily across CarbonEthics frontend sprints and Information Systems coursework at UNTAR.",
  },
  {
    number: "03",
    title: "Calm Ownership & Honest Verification",
    statement:
      "I prefer verifying work directly (inspecting Wireshark captures, timing API payloads, or testing responsive breakpoints) rather than assuming it works. When something breaks, I trace the root cause and leave clear notes behind.",
    note: "Backed by direct checks: packet captures in GNS3/Wireshark, API latency benchmarks, and responsive layout audits.",
  },
  {
    number: "04",
    title: "Steady Rhythm Beyond the Screen",
    statement:
      "Shipping reliable code while balancing university and an active internship comes from pacing myself away from the keyboard. Weekend camping, badminton, and tinkering with PC hardware keep my focus sharp when problems get dense.",
    note: "Kept balanced through regular badminton sessions, weekend camping trips, and PC hardware builds.",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "Feb 2026 - Feb 2027",
    role: "Frontend Developer Intern",
    company: "CarbonEthics",
    location: "Jakarta / Hybrid",
    type: "Internship",
    impact:
      "Contributed to frontend development for CarbonEthics' client-facing platform. Implemented responsive interfaces for carbon footprint and tree planting initiatives, maintained design-token consistency, and supported cross-device accessibility.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "REST API", "Figma"],
    gallery: [
      {
        src: "/images/experience/carbonethics-team-1.jpg",
        alt: "Joshua Abdiel with the CarbonEthics team in front of the Jakarta headquarters logo",
        caption: "Jakarta HQ",
      },
      {
        src: "/images/experience/carbonethics-team-2.jpg",
        alt: "CarbonEthics engineering squad during an outdoor team lunch",
        caption: "Team Lunch",
      },
      {
        src: "/images/experience/carbonethics-team-3.jpg",
        alt: "CarbonEthics teammates gathered around the table together",
        caption: "Squad Meetup",
      },
      {
        src: "/images/experience/carbonethics-team-4.jfif",
        alt: "CarbonEthics full team documentation frame inside the Jakarta office",
        caption: "Office Team",
      },
    ],
  },
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    period: "2023 - Present",
    degree: "Bachelor of Science in Information Systems (Sistem Informasi)",
    institution: "Tarumanagara University (UNTAR)",
    details:
      "Focusing on enterprise information architecture, software development methodologies, database systems, and full-stack web applications.",
    gallery: [
      {
        src: "/images/experience/untar-1.jpg",
        alt: "UNTAR cohort team visit inside an immersive digital forest exhibition",
        caption: "Field Visit",
      },
      {
        src: "/images/experience/untar-2.jpg",
        alt: "UNTAR Information Systems students in maroon blazers at a museum heritage mural",
        caption: "Heritage Study",
      },
      {
        src: "/images/experience/untar-3.jpg",
        alt: "UNTAR Faculty of Information Technology cohort group portrait on campus",
        caption: "FTI Courtyard",
      },
      {
        src: "/images/experience/untar-4.jpg",
        alt: "UNTAR Information Systems students gathered on the main campus steps",
        caption: "Campus Cohort",
      },
      {
        src: "/images/experience/untar-5.jfif",
        alt: "UNTAR Information Systems classmates together in the university lecture hall",
        caption: "Lecture Hall",
      },
    ],
  },
  {
    period: "Primary, Junior & Senior High",
    degree: "Formal Education Track",
    institution: "Santo Fransiskus Asisi",
    details:
      "Comprehensive mathematics and scientific foundation fostering analytical reasoning and systematic problem solving.",
    gallery: [
      {
        src: "/images/experience/asisi-1.JPG",
        alt: "Santo Fransiskus Asisi student cohort during the Live In and Blend In retreat",
        caption: "Live In",
      },
      {
        src: "/images/experience/asisi-2.jpg",
        alt: "Santo Fransiskus Asisi students during a field trip market stop",
        caption: "Field Trip",
      },
      {
        src: "/images/experience/asisi-3.jpg",
        alt: "Santo Fransiskus Asisi classmates riding the tour bus together",
        caption: "Transit",
      },
      {
        src: "/images/experience/asisi-4.jpg",
        alt: "Santo Fransiskus Asisi student group seated together indoors",
        caption: "Gathering",
      },
      {
        src: "/images/experience/asisi-5.JPG",
        alt: "Santo Fransiskus Asisi students standing together outdoors on community immersion",
        caption: "Immersion",
      },
    ],
  },
];

// Gallery plates are fully managed from the admin studio (/admin → Gallery)
// and persisted in the database (Upstash Redis). No bundled images here;
// add exposures via Upload instead of hardcoding paths.
export const GALLERY_PLATES: GalleryPlate[] = [];

export const COLOPHON_SPECS = {
  designerDeveloper: "Joshua Abdiel",
  typography: ["Newsreader (Display Editorial Serif)", "Hanken Grotesk (Clean Grotesk)", "JetBrains Mono (Technical Monospace)"],
  framework: "Next.js 16 (App Router) + React 19",
  styling: "Tailwind CSS v4 + Custom Micro-Border Tokens",
  icons: "Phosphor Icons (Uniform Stroke Weight)",
  protocol: "Leonxlnx/taste-skill Architecture (Minimalist UI & Full Output)",
  year: "2026",
};