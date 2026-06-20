import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../common/StarRating.jsx';
import IconButton from '../common/IconButton.jsx';
import { Eye, Bookmark } from 'lucide-react';

/**
 * Product card for a single publication.
 * Clicking anywhere on the card navigates to /books/:id.
 * The Quick Preview button calls onQuickPreview without triggering navigation.
 * Bookmark state is local; swap for a mutation once a backend exists.
 */
function BookCard({ book, onQuickPreview }) {
  const { id, title, author, price, rating, badge, image, imageAlt } = book;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/books/${id}`);
  };

  return (
    <div
      className="group relative bg-white border border-outline-variant/30 rounded-xl p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="relative aspect-3/4 mb-6 overflow-hidden rounded-lg shadow-lg">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />

        {badge && (
          <div className="absolute top-3 left-3 bg-secondary text-on-secondary text-[10px] font-bold uppercase px-2 py-1 rounded">
            {badge}
          </div>
        )}

        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickPreview?.(book);
            }}
            className="bg-white text-primary px-4 py-2 rounded-full font-label-md text-label-md shadow-lg flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Quick Preview
          </button>
        </div>
      </div>

      <div className="px-2">
        <StarRating rating={rating} />
        <h4 className="font-title-lg text-title-lg text-primary line-clamp-2 mb-1 mt-2">
          {title}
        </h4>
        <p className="text-label-md text-on-surface-variant mb-4">By {author}</p>
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
          <span className="font-headline-sm text-headline-sm text-primary">
            ₹{price.toFixed(2)}
          </span>
          <IconButton
            icon={<Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />}
            label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            variant="ghostAccent"
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked((prev) => !prev);
            }}
            className={isBookmarked ? 'text-secondary' : ''}
          />
        </div>
      </div>
    </div>
  );
}

export default BookCard;