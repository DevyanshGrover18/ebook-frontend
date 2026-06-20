import { ArrowRight } from 'lucide-react';

/**
 * Shared section heading used above content grids (Practice Areas, New Releases, etc.).
 * Two layouts are supported via the `variant` prop:
 *  - 'cta'     -> title + description on the left, a "View all" link on the right
 *  - 'divider' -> title followed by a flush horizontal rule
 */
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
        <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
        <div className="h-px bg-outline-variant grow" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
        )}
      </div>
      {ctaLabel && (
        <a
          href={ctaHref}
          className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap animate-hover-icon"
        >
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

export default SectionHeader;