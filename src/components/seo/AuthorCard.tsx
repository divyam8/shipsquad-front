interface AuthorCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export function AuthorCard({
  name,
  role,
  bio,
  imageUrl,
  twitterUrl,
  linkedinUrl,
}: AuthorCardProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    description: bio,
    ...(imageUrl ? { image: imageUrl } : {}),
    sameAs: [twitterUrl, linkedinUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-start gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 mt-8">
        {imageUrl && (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!imageUrl && (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex-shrink-0 flex items-center justify-center text-white text-xl font-bold">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{name}</span>
            <span className="text-sm text-text-muted">&middot;</span>
            <span className="text-sm text-text-secondary">{role}</span>
          </div>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            {bio}
          </p>
          <div className="flex gap-3 mt-2">
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-accent-blue transition-colors"
              >
                Twitter/X
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-accent-blue transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
