import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../common/StarRating.jsx';
import IconButton from '../common/IconButton.jsx';
import { Eye, Bookmark } from 'lucide-react';

function BookCard({ book, onQuickPreview }) {
  const { id, title, author, price, rating, badge, image, imageAlt } = book;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/books/${id}`);

  return (
    <div
      className="group relative bg-white border border-outline-variant/30 rounded-xl p-2 sm:p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="relative aspect-3/4 mb-3 sm:mb-6 overflow-hidden rounded-lg shadow-lg">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />

        {badge && (
          <div className="absolute top-2 left-2 bg-secondary text-on-secondary text-[8px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
            {badge}
          </div>
        )}
      </div>

      <div className="px-0.5 sm:px-2">
        <StarRating rating={rating} size="sm" />
        <h4 className="font-semibold text-[13px] sm:font-title-lg sm:text-title-lg text-primary line-clamp-2 mb-0.5 mt-1.5 sm:mb-1 sm:mt-2 leading-snug">
          {title}
        </h4>
        <p className="text-[11px] sm:text-label-md text-on-surface-variant mb-2 sm:mb-4 truncate">
          By {author}
        </p>
        <div className="flex justify-between items-center pt-2 sm:pt-4 border-t border-outline-variant/20">
          <span className="font-semibold text-[13px] sm:font-headline-sm sm:text-headline-sm text-primary">
            ₹{price.toFixed(2)}
          </span>
          
        </div>
      </div>
    </div>
  );
}

export default BookCard;