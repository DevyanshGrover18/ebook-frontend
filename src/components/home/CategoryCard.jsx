import * as LucideIcons from 'lucide-react';
import { Tag } from 'lucide-react';

function CategoryCard({ category }) {
  const Icon = LucideIcons[category.icon] ?? Tag;
  const href = category.href ?? `/books?category=${category.id}`;

  return (
    <a
      href={href}
      className="group flex flex-col items-center text-center bg-surface-container-lowest rounded-2xl p-8 hover:shadow-md transition-shadow duration-200"
    >
      {/* Icon badge */}
      <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:bg-secondary-container transition-colors duration-200">
        <Icon className="w-7 h-7 text-primary" strokeWidth={1.75} />
      </div>

      {/* Title */}
      <span className="font-title-lg text-title-lg text-primary leading-snug">
        {category.title}
      </span>
    </a>
  );
}

export default CategoryCard;