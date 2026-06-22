import { ShoppingBasket, Download, Zap } from 'lucide-react';
import CartItem from './CartItem.jsx';

/**
 * Cart section — renders the list of CartItem rows plus a metadata/status bar.
 * Props:
 *  - items: current cart items array
 *  - onRemoveItem: (id) => void — called when an item is removed
 */
function CartSection({ items, onRemoveItem }) {
  const totalMB = items.reduce((sum, item) => sum + (item.fileSizeMB || 0), 0);

  return (
    <section
      className="bg-surface-container-low rounded-xl p-stack-md md:p-stack-lg"
      style={{ boxShadow: '0 4px 20px -2px rgba(15,23,42,0.04)' }}
      aria-label="Cart items"
    >
      {items.length === 0 ? (
        /* Empty cart state */
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <ShoppingBasket className="w-12 h-12 text-outline" />
          <p className="font-title-lg text-title-lg text-on-surface-variant">Your cart is empty</p>
          <a
            href="/books"
            className="font-label-md text-label-md text-secondary hover:underline"
          >
            Browse publications →
          </a>
        </div>
      ) : (
        <div className="flex flex-col">
          {items.map((item, index) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              isLast={index === items.length - 1}
            />
          ))}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-stack-md mt-stack-xs border-t border-outline-variant/20">
            <div className="flex items-center gap-6">
              {/* Item count */}
              <div className="flex items-center gap-2 text-on-surface-variant">
                <ShoppingBasket className="w-5 h-5" />
                <span className="font-label-md text-label-md">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Total size */}
              {totalMB > 0 && (
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Download className="w-5 h-5" />
                  <span className="font-label-md text-label-md">{totalMB}MB Total</span>
                </div>
              )}
            </div>

            {/* Instant delivery badge */}
            <div className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-label-sm text-label-sm">Instant Delivery</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartSection;
