import { ArrowRight } from 'lucide-react';
import CategoryCard from './CategoryCard.jsx';

function PracticeAreas({ heading, items = [] }) {
  const title = heading?.title ?? 'Browse Practice Areas';
  const eyebrow = heading?.eyebrow ?? 'Specializations';
  const ctaLabel = heading?.ctaLabel ?? 'Show All';
  const ctaHref = heading?.ctaHref ?? '/books';

  return (
    <section className="py-stack-2xl bg-background">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Header row */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
              {eyebrow}
            </p>
            <h2 className="font-headline-md text-headline-md text-primary">
              {title}
            </h2>
          </div>
          <a
            href={ctaHref}
            className="flex items-center gap-1 font-label-md text-label-md text-primary hover:gap-2 transition-all whitespace-nowrap mt-1"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid — 2 cols mobile, 4 cols md+ matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {items.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default PracticeAreas;