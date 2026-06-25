import { CirclePlus } from 'lucide-react';

const STATS = [
  { value: '98%',  label: 'Accuracy Rate' },
  { value: '12k+', label: 'Drafts Sold' },
  { value: '24/7', label: 'Legal Support' },
  { value: 'V2.4', label: 'Latest Update' },
];

const DEFAULT_TESTIMONIAL = {
  badge: 'Trusted by 500+ Leading Advocates',
  quote:
    '"The precision of the Civil Litigation set is unparalleled. It hasn\'t just saved me time; it has elevated the standard of my filings. A must-have for any serious practitioner."',
  authorName: 'Senior Advocate David Henderson',
  authorTitle: 'Supreme Court Practitioner',
  authorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX3-KPFuWHIv_KZ8ODYlrmVnep0DMqphbdngMGD_bh9Oc6jW40WoD4K18Yi1nQbJeVST91OlRYSZ_TahQv_TbDOa6b6T6ljU8ilibGwxg8LHSjf2n-uO_NFFzYOCk0UK27mrn1aVPRbKjCriK2NMYSm23B6DqH2gMXaJLx4gVkbHJ2MsfZ-ejKToFsl_OrUzHJkX17pvm-o3xe25b4Maj96nPk5n8I3FdQMiybN_XTTiWfsP32rZjNpBy5kxTkY_kaXCGGhF-VH18', // pass a URL or leave null for initials fallback
};

function TestimonialStats({
  testimonial = DEFAULT_TESTIMONIAL,
  stats = STATS,
}) {
  const { badge, quote, authorName, authorTitle, authorImage } = testimonial;

  return (
    <section className="py-stack-2xl bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* ── Left: testimonial ── */}
          <div className="flex flex-col gap-8">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 self-start bg-surface-container rounded-full px-4 py-2">
              <CirclePlus className="w-4 h-4 text-on-surface-variant shrink-0" />
              <span className="font-label-md text-label-md text-on-surface-variant">
                {badge}
              </span>
            </div>

            {/* Quote */}
            <blockquote
              className="text-primary leading-snug"
              style={{ fontFamily: 'Domine, Georgia, serif', fontSize: '28px', fontStyle: 'italic', lineHeight: '1.45' }}
            >
              {quote}
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-14 h-14 rounded-xl object-cover shadow-md shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container font-semibold text-lg select-none">
                  {authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-title-lg text-title-lg text-primary">
                  {authorName}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-0.5">
                  {authorTitle}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: stats grid ── */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-surface-container-low rounded-2xl px-8 py-8 flex flex-col gap-2"
              >
                <span
                  className="text-primary"
                  style={{ fontFamily: 'Domine, Georgia, serif', fontSize: '40px', fontWeight: '600', lineHeight: '1' }}
                >
                  {value}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default TestimonialStats;