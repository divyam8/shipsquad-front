const TOOL_PILLAR_SLUGS = ["chatgpt", "claude", "gemini", "cursor", "github-copilot"];

const TOOL_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
};

export function getToolPillarLink(toolSlug: string): { title: string; href: string; description: string } | null {
  if (TOOL_PILLAR_SLUGS.includes(toolSlug)) {
    const name = TOOL_NAMES[toolSlug] || toolSlug;
    return {
      title: `Complete Guide to ${name} in 2026`,
      href: `/tools/${toolSlug}`,
      description: `Everything you need to know about ${name}`,
    };
  }
  return null;
}

export function getLearnPillarLinks(category: string): { title: string; href: string; description: string }[] {
  const links: { title: string; href: string; description: string }[] = [];
  const cat = category.toLowerCase();

  if (cat.includes("development") || cat.includes("coding") || cat.includes("engineering") || cat.includes("software")) {
    links.push({ title: "AI-Powered Software Development Guide", href: "/learn/ai-development", description: "Complete guide to building with AI" });
  }
  if (cat.includes("agent") || cat.includes("automation") || cat.includes("workflow")) {
    links.push({ title: "Complete Guide to AI Agents in 2026", href: "/learn/ai-agents", description: "Everything about AI agents and automation" });
  }
  if (cat.includes("prototype") || cat.includes("production") || cat.includes("deployment") || cat.includes("startup")) {
    links.push({ title: "From Prototype to Production", href: "/learn/prototype-to-production", description: "Ship your AI project to production" });
  }

  if (links.length === 0) {
    links.push({ title: "Complete Guide to AI Agents in 2026", href: "/learn/ai-agents", description: "Everything about AI agents and automation" });
  }

  return links;
}
