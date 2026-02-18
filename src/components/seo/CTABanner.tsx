import Link from "next/link";

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTABanner({
  headline = "Ready to assemble your AI squad?",
  description = "10 specialized AI agents. One mission. $99/mo + your Claude subscription.",
  buttonText = "Start Your Mission",
  buttonHref = "/#waitlist",
}: CTABannerProps) {
  return (
    <section className="my-12 rounded-2xl bg-gradient-to-r from-accent-blue/10 via-accent-purple/10 to-accent-pink/10 border border-white/[0.05] p-8 text-center">
      <h2 className="text-2xl font-bold text-text-primary mb-3">
        {headline}
      </h2>
      <p className="text-text-secondary mb-6 max-w-xl mx-auto">
        {description}
      </p>
      <Link
        href={buttonHref}
        className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 transition-all duration-300"
      >
        {buttonText}
      </Link>
    </section>
  );
}
