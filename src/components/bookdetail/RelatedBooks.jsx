import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StarRating from '../common/StarRating.jsx';
import { Eye, Bookmark } from 'lucide-react';

/**
 * Lightweight related-book card used in RelatedBooks.
 * Navigates to /books/:id on card click.
 */
function RelatedBookCard({ book }) {
  const navigate = useNavigate();
  const { id, title, author, price, rating, badge, image, imageAlt } = book;
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div
      className="group relative bg-white border border-outline-variant/30 rounded-xl p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onClick={() => navigate(`/books/${id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/books/${id}`)}
    >
      <div className="relative aspect-3/4 mb-6 overflow-hidden rounded-lg shadow-lg">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
        {badge && (
          <div className="absolute top-3 left-3 bg-secondary text-on-secondary text-[10px] font-bold uppercase px-2 py-1 rounded">
            {badge}
          </div>
        )}
        
      </div>

      <div className="px-2">
        <StarRating rating={rating} />
        <h4 className="font-title-lg text-title-lg text-primary line-clamp-2 mb-1 mt-2">{title}</h4>
        <p className="text-label-md text-on-surface-variant mb-4">By {author}</p>
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
          <span className="font-headline-sm text-headline-sm text-primary">₹{price.toFixed(2)}</span>
          
        </div>
      </div>
    </div>
  );
}

/**
 * "You May Also Like" section below the FAQ, showing related titles.
 */
function RelatedBooks({ books }) {
  if (!books || books.length === 0) return null;

  return (
    <section className="py-stack-xl bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-headline-md text-headline-md text-primary whitespace-nowrap">You May Also Like</h2>
          <div className="h-px bg-outline-variant grow" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {books.map((book) => (
            <RelatedBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedBooks;
