import { Logo } from "@/components/icons/Logo";
import { TwitterIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-primary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <Logo />
        <p className="text-sm text-text-muted">{SITE.tagline}</p>
        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-text-primary"
            aria-label="Follow us on X (Twitter)"
          >
            <TwitterIcon />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted transition-colors hover:text-text-primary"
            aria-label="Follow us on LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} ShipSquad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
