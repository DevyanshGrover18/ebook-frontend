import SectionHeader from '../common/SectionHeader.jsx';
import CategoryCard from './CategoryCard.jsx';

const defaultHeading = {
  title: 'Practice Areas',
  description: 'Curated collections for specialized legal mastery.',
  ctaLabel: 'View All Categories',
  ctaHref: '/books',
};

function PracticeAreas({ heading = defaultHeading, items = [] }) {
  return (
    <section className="py-stack-xl bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHeader
          title={heading.title}
          description={heading.description}
          ctaLabel={heading.ctaLabel}
          ctaHref={heading.ctaHref}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {items.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PracticeAreas;