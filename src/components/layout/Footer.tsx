import { Logo } from "@/components/icons/Logo";
import { TwitterIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="opacity-40">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/20 transition-colors hover:text-white/50"
            aria-label="Follow us on X (Twitter)"
          >
            <TwitterIcon />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/20 transition-colors hover:text-white/50"
            aria-label="Follow us on LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
        <p className="text-xs text-white/[0.15]">
          &copy; ShipSquad 2026
        </p>
      </div>
    </footer>
  );
}
