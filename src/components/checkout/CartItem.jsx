import { X } from 'lucide-react';

/**
 * A single line item in the cart section.
 * `onRemove` is called with the item id when the × button is clicked.
 */
function CartItem({ item, onRemove, isLast }) {
  const { id, title, author, format, price, image, imageAlt } = item;

  return (
    <div
      className={`flex gap-stack-md items-start py-stack-md ${
        !isLast ? 'border-b border-outline-variant/30' : ''
      }`}
    >
      {/* Book Cover */}
      <div className="w-20 h-28 md:w-24 md:h-32 flex-shrink-0 bg-surface-container-highest rounded-lg overflow-hidden shadow-md">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block">
              {format}
            </span>
            <h3 className="font-title-lg text-title-lg text-on-surface mt-1 leading-snug">
              {title}
            </h3>
            <p className="text-on-surface-variant font-body-md text-body-md mt-0.5">
              {author}
            </p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            aria-label={`Remove ${title} from cart`}
            onClick={() => onRemove(id)}
            className="text-on-surface-variant hover:text-error transition-colors p-1 flex-shrink-0 rounded-full hover:bg-error/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <span className="font-title-lg text-title-lg text-on-surface">
            ₹{price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
