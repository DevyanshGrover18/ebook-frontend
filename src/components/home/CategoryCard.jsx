function CategoryCard({ category }) {
  const { title, publicationsLabel, description, image, imageAlt, href } = category;

  return (
    <a
      href={href || `/books?category=${title}`}
      className="group relative h-[280px] sm:h-[340px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
        role="img"
        aria-label={imageAlt}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-5 sm:p-8">
        <span className="text-secondary-fixed text-label-sm font-bold uppercase tracking-widest mb-2 block">
          {publicationsLabel}
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-tertiary text-shadow-sm">
          {title}
        </h3>
        {/* Always visible on touch, hover-revealed on pointer devices */}
        <p className="text-white/70 font-body-md text-body-md mt-2 [@media(hover:none)]:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
          {description}
        </p>
      </div>
    </a>
  );
}

export default CategoryCard;