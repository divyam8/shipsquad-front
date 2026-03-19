export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
            >
              <summary className="cursor-pointer text-text-primary font-medium flex items-center justify-between">
                {item.question}
                <span className="text-text-muted group-open:rotate-180 transition-transform ml-2">
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-text-secondary leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
