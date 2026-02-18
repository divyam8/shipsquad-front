import type { SquadAgent, DomainVertical } from "@/types";

export const SITE = {
  name: "ShipSquad",
  url: "https://shipsquad.ai",
  title: "ShipSquad — Your AI Squad, Your Mission",
  description:
    "An AI-powered squad builds production software for you in 1-2 weeks. $99/mo. Join the mission.",
  tagline: "Your AI squad. Your mission.",
} as const;

export const HERO = {
  headline: "Your AI squad, ready to ship.",
  cycleWords: ["plan", "build", "test", "ship"],
  subhead:
    "8 specialized agents. One mission. Production-ready in days.",
  socialProof: "Describe your mission. Squad builds. Squad Lead reviews. Stay in sync. Ship.",
} as const;

export const SQUAD_LEAD = {
  title: "Squad Lead",
  subtitle: "Domain Expert",
  description:
    "Makes architectural decisions, resolves ambiguity, ensures quality",
} as const;

export const SQUAD_AGENTS: SquadAgent[] = [
  { name: "Decomposer", codename: "Splitter", emoji: "\u{1FAB3}", role: "Breaks your idea into buildable, testable tasks", icon: "puzzle" },
  { name: "Architect", codename: "Blueprint", emoji: "\u{1F3D7}\uFE0F", role: "Designs data models, APIs, and system structure", icon: "blueprint" },
  { name: "Frontend", codename: "Pixel", emoji: "\u{1F3A8}", role: "Builds UI components, pages, and interactions", icon: "layout" },
  { name: "Backend", codename: "Forge", emoji: "\u2699\uFE0F", role: "Creates APIs, business logic, and integrations", icon: "server" },
  { name: "QA", codename: "Watchdog", emoji: "\u{1F6E1}\uFE0F", role: "Writes tests, catches bugs, validates edge cases", icon: "check" },
  { name: "DevOps", codename: "Launchpad", emoji: "\u{1F680}", role: "Sets up CI/CD, hosting, monitoring, and deploys", icon: "cloud" },
  { name: "Reviewer", codename: "Hawkeye", emoji: "\u{1F441}\uFE0F", role: "Reviews every line for quality, security, and performance", icon: "eye" },
  { name: "Comms", codename: "Signal", emoji: "\u{1F4E1}", role: "Keeps you updated with progress reports and demos", icon: "message" },
];

export const DOMAIN_SQUADS: Record<string, SquadAgent[]> = {
  Engineering: SQUAD_AGENTS,
  Marketing: [
    { name: "Strategist", codename: "Crosshair", emoji: "\u{1F3AF}", role: "Breaks campaigns into targeted, measurable initiatives", icon: "puzzle" },
    { name: "Architect", codename: "Funnel", emoji: "\u{1F504}", role: "Designs funnels, journeys, and campaign structure", icon: "blueprint" },
    { name: "Designer", codename: "Canvas", emoji: "\u{1F58C}\uFE0F", role: "Creates landing pages, emails, and ad creatives", icon: "layout" },
    { name: "Automator", codename: "Relay", emoji: "\u26A1", role: "Builds workflows, integrations, and triggers", icon: "server" },
    { name: "Analyst", codename: "Radar", emoji: "\u{1F4CA}", role: "Tracks metrics, A/B tests, and validates ROI", icon: "check" },
    { name: "Publisher", codename: "Broadcast", emoji: "\u{1F4E2}", role: "Deploys campaigns, schedules posts, and manages distribution", icon: "cloud" },
    { name: "Optimizer", codename: "Lens", emoji: "\u{1F50D}", role: "Reviews copy, CTAs, and conversion paths", icon: "eye" },
    { name: "Comms", codename: "Pulse", emoji: "\u{1F4AC}", role: "Keeps you updated with performance reports and insights", icon: "message" },
  ],
  "E-commerce": [
    { name: "Planner", codename: "Cartographer", emoji: "\u{1F5FA}\uFE0F", role: "Breaks store requirements into buildable features", icon: "puzzle" },
    { name: "Architect", codename: "Scaffold", emoji: "\u{1F3DB}\uFE0F", role: "Designs product catalog, cart, and checkout flows", icon: "blueprint" },
    { name: "Storefront", codename: "Showcase", emoji: "\u{1F6CD}\uFE0F", role: "Builds product pages, collections, and shop UI", icon: "layout" },
    { name: "Backend", codename: "Vault", emoji: "\u{1F512}", role: "Creates payment processing, inventory, and order management", icon: "server" },
    { name: "QA", codename: "Inspector", emoji: "\u{1F50E}", role: "Tests checkout flows, edge cases, and payment scenarios", icon: "check" },
    { name: "DevOps", codename: "Express", emoji: "\u{1F4E6}", role: "Sets up hosting, CDN, monitoring, and deploys", icon: "cloud" },
    { name: "Optimizer", codename: "Converter", emoji: "\u{1F4C8}", role: "Reviews UX, page speed, and conversion rates", icon: "eye" },
    { name: "Comms", codename: "Ticker", emoji: "\u{1F4EC}", role: "Keeps you updated with progress reports and demos", icon: "message" },
  ],
  "Customer Support": [
    { name: "Planner", codename: "Triage", emoji: "\u{1F4CB}", role: "Maps support workflows into automatable processes", icon: "puzzle" },
    { name: "Architect", codename: "Router", emoji: "\u{1F500}", role: "Designs ticket routing, escalation, and knowledge base", icon: "blueprint" },
    { name: "Builder", codename: "Portal", emoji: "\u{1F5A5}\uFE0F", role: "Creates help centers, chatbots, and self-service portals", icon: "layout" },
    { name: "Integrator", codename: "Bridge", emoji: "\u{1F517}", role: "Connects CRM, ticketing, and communication channels", icon: "server" },
    { name: "QA", codename: "Sentinel", emoji: "\u{1F514}", role: "Tests response accuracy, SLAs, and edge cases", icon: "check" },
    { name: "Deployer", codename: "Dispatch", emoji: "\u{1F6A8}", role: "Launches support tools, monitors uptime, and scales", icon: "cloud" },
    { name: "Reviewer", codename: "Arbiter", emoji: "\u{1F4DD}", role: "Audits response quality, CSAT, and resolution rates", icon: "eye" },
    { name: "Comms", codename: "Beacon", emoji: "\u{1F4E3}", role: "Keeps you updated with progress reports and metrics", icon: "message" },
  ],
  Legal: [
    { name: "Decomposer", codename: "Docket", emoji: "\u{1F4DA}", role: "Breaks legal workflows into automatable tasks", icon: "puzzle" },
    { name: "Architect", codename: "Framework", emoji: "\u{1F3DB}\uFE0F", role: "Designs document templates, review flows, and databases", icon: "blueprint" },
    { name: "Builder", codename: "Scribe", emoji: "\u270D\uFE0F", role: "Creates contract editors, dashboards, and client portals", icon: "layout" },
    { name: "Processor", codename: "Parser", emoji: "\u{1F4C4}", role: "Automates document analysis, extraction, and filing", icon: "server" },
    { name: "Compliance", codename: "Shield", emoji: "\u{1F6E1}\uFE0F", role: "Validates accuracy, regulatory requirements, and standards", icon: "check" },
    { name: "Deployer", codename: "Archive", emoji: "\u{1F5C4}\uFE0F", role: "Deploys secure systems with audit trails and backups", icon: "cloud" },
    { name: "Reviewer", codename: "Gavel", emoji: "\u2696\uFE0F", role: "Reviews outputs for legal accuracy and consistency", icon: "eye" },
    { name: "Comms", codename: "Brief", emoji: "\u{1F4E9}", role: "Keeps you updated with progress reports and deliverables", icon: "message" },
  ],
  Finance: [
    { name: "Planner", codename: "Abacus", emoji: "\u{1F9EE}", role: "Breaks financial workflows into automatable processes", icon: "puzzle" },
    { name: "Architect", codename: "Pipeline", emoji: "\u{1F3D7}\uFE0F", role: "Designs data pipelines, dashboards, and reporting structures", icon: "blueprint" },
    { name: "Builder", codename: "Dashboard", emoji: "\u{1F4CA}", role: "Creates financial dashboards, reports, and interfaces", icon: "layout" },
    { name: "Processor", codename: "Ledger", emoji: "\u{1F4D2}", role: "Automates reconciliation, calculations, and data feeds", icon: "server" },
    { name: "Auditor", codename: "Sentinel", emoji: "\u{1F6E1}\uFE0F", role: "Validates accuracy, compliance, and regulatory standards", icon: "check" },
    { name: "Deployer", codename: "Fortress", emoji: "\u{1F510}", role: "Sets up secure infrastructure with encryption and backups", icon: "cloud" },
    { name: "Reviewer", codename: "Scope", emoji: "\u{1F50D}", role: "Reviews outputs for accuracy, anomalies, and risks", icon: "eye" },
    { name: "Comms", codename: "Digest", emoji: "\u{1F4E8}", role: "Keeps you updated with progress reports and insights", icon: "message" },
  ],
  Education: [
    { name: "Planner", codename: "Syllabus", emoji: "\u{1F4D6}", role: "Breaks learning objectives into buildable platform features", icon: "puzzle" },
    { name: "Architect", codename: "Curriculum", emoji: "\u{1F3EB}", role: "Designs curriculum structures, LMS, and assessments", icon: "blueprint" },
    { name: "Builder", codename: "Classroom", emoji: "\u{1F5A5}\uFE0F", role: "Creates course interfaces, dashboards, and content", icon: "layout" },
    { name: "Backend", codename: "Gradebook", emoji: "\u{1F4DD}", role: "Builds enrollment, grading, and progress tracking systems", icon: "server" },
    { name: "QA", codename: "Proctor", emoji: "\u2705", role: "Tests learning paths, accessibility, and content accuracy", icon: "check" },
    { name: "DevOps", codename: "Campus", emoji: "\u{1F680}", role: "Sets up hosting, video streaming, and deploys", icon: "cloud" },
    { name: "Reviewer", codename: "Mentor", emoji: "\u{1F9D1}\u200D\u{1F3EB}", role: "Reviews UX, engagement metrics, and learning outcomes", icon: "eye" },
    { name: "Comms", codename: "Bulletin", emoji: "\u{1F4E2}", role: "Keeps you updated with progress reports and demos", icon: "message" },
  ],
  Healthcare: [
    { name: "Planner", codename: "Triage", emoji: "\u{1FA7A}", role: "Breaks healthcare workflows into compliant, buildable tasks", icon: "puzzle" },
    { name: "Architect", codename: "Helix", emoji: "\u{1F9EC}", role: "Designs HIPAA-compliant systems and data flows", icon: "blueprint" },
    { name: "Builder", codename: "Vitals", emoji: "\u{1F5A5}\uFE0F", role: "Creates patient portals, dashboards, and interfaces", icon: "layout" },
    { name: "Backend", codename: "Pulse", emoji: "\u{1F49A}", role: "Builds EHR integrations, scheduling, and data processing", icon: "server" },
    { name: "Compliance", codename: "Guardian", emoji: "\u{1F6E1}\uFE0F", role: "Validates HIPAA, security standards, and audit trails", icon: "check" },
    { name: "Deployer", codename: "Capsule", emoji: "\u{1F48A}", role: "Sets up HIPAA-compliant hosting, encryption, and monitoring", icon: "cloud" },
    { name: "Reviewer", codename: "Prognosis", emoji: "\u{1F52C}", role: "Reviews security, privacy controls, and data handling", icon: "eye" },
    { name: "Comms", codename: "Chart", emoji: "\u{1F4CB}", role: "Keeps you updated with progress and compliance status", icon: "message" },
  ],
  Operations: [
    { name: "Planner", codename: "Mapper", emoji: "\u{1F5FA}\uFE0F", role: "Maps business processes into automatable workflows", icon: "puzzle" },
    { name: "Architect", codename: "Blueprint", emoji: "\u{1F3D7}\uFE0F", role: "Designs workflow engines, integrations, and data flows", icon: "blueprint" },
    { name: "Builder", codename: "Console", emoji: "\u{1F39B}\uFE0F", role: "Creates operations dashboards, forms, and control panels", icon: "layout" },
    { name: "Automator", codename: "Gears", emoji: "\u2699\uFE0F", role: "Builds process automation, triggers, and integrations", icon: "server" },
    { name: "QA", codename: "Checkpoint", emoji: "\u{1F6A6}", role: "Tests workflows, edge cases, and failure scenarios", icon: "check" },
    { name: "Deployer", codename: "Command", emoji: "\u{1F3AF}", role: "Sets up monitoring, alerting, and production deployments", icon: "cloud" },
    { name: "Optimizer", codename: "Tuner", emoji: "\u{1F527}", role: "Reviews efficiency, bottlenecks, and performance metrics", icon: "eye" },
    { name: "Comms", codename: "Dispatch", emoji: "\u{1F4E1}", role: "Keeps you updated with progress reports and KPIs", icon: "message" },
  ],
  "Real Estate": [
    { name: "Planner", codename: "Survey", emoji: "\u{1F4D0}", role: "Breaks property management needs into buildable features", icon: "puzzle" },
    { name: "Architect", codename: "Floorplan", emoji: "\u{1F3E0}", role: "Designs listing databases, CRM, and document workflows", icon: "blueprint" },
    { name: "Builder", codename: "Showcase", emoji: "\u{1F3D8}\uFE0F", role: "Creates property listings, search, and client portals", icon: "layout" },
    { name: "Backend", codename: "Keystone", emoji: "\u{1F511}", role: "Builds document processing, CRM, and market data APIs", icon: "server" },
    { name: "QA", codename: "Inspector", emoji: "\u{1F50E}", role: "Tests listing accuracy, search, and transaction flows", icon: "check" },
    { name: "Deployer", codename: "Closing", emoji: "\u{1F4DD}", role: "Sets up hosting, image CDN, and production deploys", icon: "cloud" },
    { name: "Reviewer", codename: "Appraiser", emoji: "\u{1F4B0}", role: "Reviews UX, listing quality, and conversion paths", icon: "eye" },
    { name: "Comms", codename: "Broker", emoji: "\u{1F4DE}", role: "Keeps you updated with progress reports and metrics", icon: "message" },
  ],
};

export const DOMAIN_VERTICALS: DomainVertical[] = [
  { name: "Engineering", icon: "code" },
  { name: "Marketing", icon: "megaphone" },
  { name: "E-commerce", icon: "shopping-cart" },
  { name: "Customer Support", icon: "headset" },
  { name: "Legal", icon: "scale" },
  { name: "Finance", icon: "chart" },
  { name: "Education", icon: "academic-cap" },
  { name: "Healthcare", icon: "heart" },
  { name: "Operations", icon: "cog" },
  { name: "Real Estate", icon: "home" },
];

export const CTA = {
  headline: "Ready to assemble your squad?",
  badge: "Early access pricing — lock in $99/mo before launch",
  subtext: "Your squad builds, tests, and deploys — you review every step",
} as const;

export const PRICING = {
  price: "$99",
  period: "/month",
  planName: "Mission Plan",
  features: [
    "Full AI squad on your mission",
    "Dedicated Squad Lead (domain expert)",
    "Production-ready code in 1-2 weeks",
    "2 rounds of revisions included",
    "Full source code ownership",
    "30 days post-delivery support",
  ],
  cta: "Start Your Mission",
} as const;

export function getHowItWorksSteps(domain: string) {
  const agents = DOMAIN_SQUADS[domain] ?? DOMAIN_SQUADS.Engineering;
  const agentNames = agents.slice(0, 4).map((a) => a.name);
  const agentList = agentNames.join(", ");

  return [
    {
      number: "01",
      title: "Describe your mission",
      description:
        "Tell us what you want to build. We'll scope it, break it down, and assign the right squad for your domain.",
    },
    {
      number: "02",
      title: "Your squad builds in parallel",
      description:
        `8 specialized agents work simultaneously — ${agentList} — all coordinated by your Squad Lead.`,
    },
    {
      number: "03",
      title: "Ship to production",
      description:
        "Production-ready code, fully tested and deployed. You own 100% of the IP. We stick around for 30 days of support.",
    },
  ];
}

export const SOCIAL_PROOF_METRICS = [
  { value: 2, prefix: "< ", suffix: " weeks", label: "Average delivery" },
  { value: 8, label: "Agents per squad" },
  { value: 99, prefix: "$", suffix: "/mo", label: "Full squad access" },
  { value: 100, suffix: "%", label: "IP ownership" },
] as const;

export const SOCIAL_LINKS = {
  twitter: "https://x.com/shipsquad",
  linkedin: "https://linkedin.com/company/shipsquad",
} as const;
