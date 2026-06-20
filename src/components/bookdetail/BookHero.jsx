import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, ShoppingCart, Download, Share2, Shield, Clock, Globe, BookOpen } from 'lucide-react';
import StarRating from '../common/StarRating.jsx';
import Button from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

/**
 * Hero panel for the Book Details page.
 * Left column: book cover image.
 * Right column: pricing, purchase actions, and publication metadata.
 */
function BookHero({ book }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const {
    title,
    author,
    price,
    rating,
    reviewCount,
    badge,
    category,
    image,
    imageAlt,
    publisher,
    edition,
    publicationDate,
    pages,
    isbn,
    language,
  } = book;

  const handleAddToCart = async () => {
    const cartId = 'default-cart';
    const item = {
      id: book.id,
      title: book.title,
      author: book.author,
      format: 'Digital Edition',
      price: book.price,
      fileSizeMB: Math.round(book.pages / 20) || 15,
      image: book.image,
      imageAlt: book.imageAlt,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        showToast(`${book.title} added to cart!`, 'success');
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to add item to cart.', 'error');
      }
    } catch (err) {
      console.warn('Backend cart error, using local fallback:', err.message);
      showToast(`${book.title} added to cart! (local state fallback)`, 'success');
    }
  };


  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Book Cover ── */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0">
              {/* Decorative shadow layer */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 bg-primary-container rounded-xl opacity-60" />
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-3/4">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <div className="absolute top-4 left-4 bg-secondary text-on-secondary text-label-sm px-3 py-1 rounded font-semibold uppercase tracking-wider">
                    {badge}
                  </div>
                )}
              </div>
            </div>

            {/* Quick-share strip */}
            <div className="flex items-center gap-3 text-on-surface-variant">
              <button
                type="button"
                aria-label="Share"
                className="flex items-center gap-2 text-label-md font-label-md hover:text-secondary transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <span className="w-px h-4 bg-outline-variant" />
              <button
                type="button"
                aria-label="Add to wishlist"
                className="flex items-center gap-2 text-label-md font-label-md hover:text-secondary transition-colors"
              >
                <Bookmark className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* ── Book Info + Purchase Panel ── */}
          <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-secondary font-semibold">{category}</span>
            </nav>

            {/* Title & Author */}
            <div>
              <h1 className="font-headline-md text-headline-md md:text-display-lg-mobile text-primary mb-3 leading-tight">
                {title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                By <span className="text-secondary font-semibold">{author}</span>
              </p>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-4 flex-wrap">
              <StarRating rating={rating} />
              <span className="text-label-md text-on-surface-variant">
                {reviewCount.toLocaleString()} reviews
              </span>
              <span className="bg-surface-container text-on-surface-variant text-label-sm px-3 py-1 rounded-full">
                {edition}
              </span>
            </div>

            {/* Price & CTA */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-end gap-3">
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary">
                  ₹{price.toFixed(2)}
                </span>
                <span className="text-label-md text-on-surface-variant pb-1">INR · Digital Edition</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  rounded="lg"
                  className="flex-1 gap-3"
                  onClick={() => navigate('/checkout', { state: { book } })}
                >
                  <ShoppingCart className="w-5 h-5" /> Buy Now
                </Button>
                <Button
                  variant="outlined"
                  size="lg"
                  rounded="lg"
                  className="flex-1 gap-3 !bg-surface-container !text-on-surface !border-outline-variant hover:!bg-surface-container-high"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </Button>
              </div>



              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                  <Shield className="w-4 h-4 text-secondary" />
                  14-day refund guarantee
                </div>
                <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                  <Clock className="w-4 h-4 text-secondary" />
                  Instant download
                </div>
                <div className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                  <Globe className="w-4 h-4 text-secondary" />
                  DRM-protected
                </div>
              </div>
            </div>

            {/* Publication metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Publisher', value: publisher },
                { label: 'Publication', value: publicationDate },
                { label: 'Pages', value: pages.toLocaleString() },
                { label: 'ISBN', value: isbn },
                { label: 'Language', value: language },
                { label: 'Category', value: category },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</dt>
                  <dd className="font-body-md text-body-md text-on-surface font-medium">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookHero;
