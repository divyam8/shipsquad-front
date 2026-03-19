// Typed GA4 event helper — call from any component
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

// Predefined events matching our conversion goals
export const events = {
  toolClick: (toolName: string, href: string) =>
    trackEvent("tool_click", { tool_name: toolName, outbound_url: href }),
  comparisonView: (slugs: string) =>
    trackEvent("comparison_view", { comparison: slugs }),
  ctaClick: (location: string, label: string) =>
    trackEvent("cta_click", { cta_location: location, cta_label: label }),
  newsletterSignup: (source: string) =>
    trackEvent("newsletter_signup", { signup_source: source }),
} as const;

// Extend Window for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
