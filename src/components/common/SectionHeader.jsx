import { ArrowRight } from 'lucide-react';

function SectionHeader({
  title,
  description,
  variant = 'cta',
  ctaLabel,
  ctaHref = '#',
}) {
  if (variant === 'divider') {
    return (
      <div className="flex items-center gap-4 mb-12">
        <h2 className="font-headline-md text-headline-md text-primary whitespace-nowrap">{title}</h2>
        <div className="h-px bg-outline-variant grow" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-12">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
        )}
      </div>
      {ctaLabel && (
        <a
          href={ctaHref}
          className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap sm:mt-1 animate-hover-icon self-start"
        >
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

export default SectionHeader;