import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CheckoutHeader from '../components/checkout/CheckoutHeader.jsx';
import CartSection from '../components/checkout/CartSection.jsx';
import CustomerForm from '../components/checkout/CustomerForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import CheckoutFooter from '../components/checkout/CheckoutFooter.jsx';
import { initialCartItems } from '../data/cart.js';
import { useToast } from '../context/ToastContext.jsx';
import { cartService, ordersService } from '../services/api.js';
import { discount, TAX_RATE } from '../data/cart.js';

/**
 * Checkout page — orchestrates cart state, form state, and submission.
 *
 * State lives here so CartSection (item count, total MB) and
 * OrderSummary (pricing totals) stay in sync through a single source of truth.
 */
function CheckoutPage() {
  const location = useLocation();
  const showToast = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');

  const cartId = 'default-cart';


  useEffect(() => {
    const loadCart = async () => {
      try {
        // If we arrived with a "Buy Now" book in state, add it to the cart first
        if (location.state && location.state.book) {
          const b = location.state.book;
          const newItem = {
            id: b.id,
            title: b.title,
            author: b.author,
            format: 'Digital Edition',
            price: b.price,
            fileSizeMB: Math.round(b.pages / 20) || 15,
            image: b.image,
            imageAlt: b.imageAlt,
          };

          // Clear standard default-cart items first since we want a direct Buy Now checkout
          await cartService.clear(cartId).catch(() => {});

          // Add our new item to the cart
          await cartService.addItem(cartId, newItem);

          // Clear history state to avoid re-adding on page refresh
          window.history.replaceState({}, document.title);
        }

        // Fetch the active cart items
        const data = await cartService.get(cartId);
        if (data && Array.isArray(data.items)) {
          setCartItems(data.items);
        }
      } catch (err) {
        console.warn('Backend cart fetch failed, using local offline state fallback:', err.message);
        // Offline state fallback
        if (location.state && location.state.book) {
          const b = location.state.book;
          setCartItems([
            {
              id: b.id,
              title: b.title,
              author: b.author,
              format: 'Digital Edition',
              price: b.price,
              fileSizeMB: Math.round(b.pages / 20) || 15,
              image: b.image,
              imageAlt: b.imageAlt,
            }
          ]);
        }
      }
    };

    loadCart();
  }, [location.state]);

  const handleRemoveItem = async (id) => {
    // Optimistic UI update
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await cartService.removeItem(cartId, id);
    } catch (err) {
      console.warn('Failed to delete item from backend cart:', err.message);
    }
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      cartItems.length === 0
    ) {
      showToast('Please fill in all required checkout details.', 'error');
      return;
    }

    setIsSubmitting(true);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const discountAmount = subtotal * discount.rate;
    const tax = (subtotal - discountAmount) * TAX_RATE;
    const total = subtotal - discountAmount + tax;

    const payload = {
      customerInfo: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        address: 'Digital delivery',
        city: 'N/A',
        state: 'N/A',
        zipCode: '000000',
      },
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        author: item.author,
        format: item.format,
        fileSizeMB: item.fileSizeMB,
        ...(item.image ? { image: item.image } : {}),
        ...(item.imageAlt ? { imageAlt: item.imageAlt } : {}),
      })),
      subtotal,
      discount: discountAmount,
      tax,
      total,
      status: 'Completed',
      paymentMethod: selectedPayment,
    };

    try {
      await ordersService.create(payload);
      await new Promise((resolve) => setTimeout(resolve, 1800));
      await cartService.clear(cartId).catch(() => {});
      showToast('Order placed! Your items have been secured.', 'success');
      setCartItems([]);
      setFormData({ fullName: '', email: '' });
    } catch (err) {
      console.warn('Failed to create order:', err.message);
      showToast('Order failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <CheckoutHeader />

      <main className="pt-24 pb-stack-xl max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* ── Left Column: Cart & Customer Info ── */}
          <div className="lg:col-span-7 flex flex-col gap-stack-lg">
            {/* Page header */}
            <div>
              <h1 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-2">
                Review Your Order
              </h1>
              <p className="text-on-surface-variant font-body-md text-body-md">
                Complete your purchase to gain immediate access to our legal repository.
              </p>
            </div>

            {/* Cart items */}
            <CartSection items={cartItems} onRemoveItem={handleRemoveItem} />

            {/* Customer info form */}
            <CustomerForm formData={formData} onChange={handleFormChange} />
          </div>

          {/* ── Right Column: Sticky Order Summary ── */}
          <div className="lg:col-span-5">
            <OrderSummary
              items={cartItems}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              selectedPayment={selectedPayment}
              onPaymentChange={setSelectedPayment}
            />
          </div>

        </div>
      </main>

      <CheckoutFooter />
    </>
  );
}

export default CheckoutPage;
