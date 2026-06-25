import { useNavigate } from 'react-router-dom';
import StarRating from '../common/StarRating.jsx';

function BookCard({ book, variant = 'default', onQuickPreview }) {
  const { id, title, author, price, rating, badge, image, imageAlt, categories } = book;
  const navigate = useNavigate();
  const handleCardClick = () => navigate(`/books/${id}`);

  // Shared 3D hover style injected once
  const tiltStyle = `
    .book-tilt {
      transform: perspective(800px) rotateY(0deg) rotateX(0deg) scale(1);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .book-card-wrap:hover .book-tilt {
      transform: perspective(800px) rotateY(-14deg) rotateX(4deg) scale(1.04);
    }
  `;

  // ── Featured / Trending variant ────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <>
        <style>{tiltStyle}</style>
        <div
          className="book-card-wrap group flex flex-col cursor-pointer"
          onClick={handleCardClick}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        >
          {/* Lavender card */}
          <div className="relative bg-primary-fixed rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '420px' }}>
            {badge && (
              <span className="absolute top-4 right-4 z-10 bg-white text-primary font-label-sm text-label-sm uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                {badge}
              </span>
            )}
            <div className="book-tilt w-48 drop-shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto object-contain rounded-sm"
              />
            </div>
          </div>

          {/* Content */}
          <div className="pt-6 flex flex-col gap-2">
            {categories?.length > 0 && (
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                {categories.join(' • ')}
              </p>
            )}
            <h4 className="font-headline-sm text-headline-sm text-primary leading-snug line-clamp-2">
              {title}
            </h4>
            <div className="flex items-center justify-between gap-3 mt-5">
              <span className="font-headline-sm text-headline-sm text-primary">
                ₹{price.toFixed(2)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/books/${id}`); }}
                className="bg-primary cursor-pointer text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all shrink-0 uppercase tracking-wide"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Default / New Releases variant ─────────────────────────────────────────
  return (
    <>
      <style>{tiltStyle}</style>
      <div
        className="book-card-wrap group relative bg-primary-fixed rounded-xl overflow-hidden cursor-pointer flex flex-col hover:shadow-md transition-shadow duration-300"
        onClick={handleCardClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      >
        {/* Image area */}
        <div className="relative flex items-center justify-center py-8 px-6" style={{ minHeight: '260px' }}>
          {badge && (
            <span className="absolute top-3 left-3 z-10 bg-white text-primary font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              {badge}
            </span>
          )}
          <div className="book-tilt drop-shadow-xl" style={{ width: '120px' }}>
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-auto object-contain rounded-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-5 pt-1 flex flex-col gap-1.5">
          <h4 className="font-title-lg text-title-lg text-primary line-clamp-2 leading-snug">
            {title}
          </h4>
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="font-headline-sm text-headline-sm text-primary">
              ₹{price.toFixed(2)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/books/${id}`); }}
              className="bg-primary cursor-pointer text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shrink-0"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookCard;