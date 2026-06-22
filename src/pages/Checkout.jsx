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
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isBuyNow, setIsBuyNow] = useState(false);

  const cartId = 'default-cart';


  useEffect(() => {
    const loadCart = async () => {
      try {
        // If we arrived with a "Buy Now" book in state, show it directly without modifying cart
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

          setIsBuyNow(true);
          setCartItems([newItem]);

          // Clear history state to avoid re-adding on page refresh
          window.history.replaceState({}, document.title);
          return;
        }

        // Fetch the active cart items
        const data = await cartService.get(cartId);
        if (data && Array.isArray(data.items)) {
          setCartItems(data.items);
        }
      } catch (err) {
        console.warn('Backend cart fetch failed, using local offline state fallback:', err.message);
      }
    };

    loadCart();
  }, [location.state]);

  const handleRemoveItem = async (id) => {
    // Optimistic UI update
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    if (!isBuyNow) {
      try {
        await cartService.removeItem(cartId, id);
      } catch (err) {
        console.warn('Failed to delete item from backend cart:', err.message);
      }
    }
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (!formData.fullName.trim() || !formData.email.trim()) {
      showToast('Please fill these fields', 'error');
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your cart is empty.', 'error');
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
      // 1. Create Razorpay order on backend
      const razorpayOrder = await ordersService.createRazorpayOrder(total);

      // 2. Initialize Razorpay Checkout
      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Lexis & Juris Marketplace",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          // Automatically pick the payment method from the checkout screen
          method: selectedPayment === 'upi' ? 'upi' : selectedPayment === 'netbanking' ? 'netbanking' : 'card'
        },
        handler: async function (response) {
          // Add razorpay info to payload
          payload.paymentId = response.razorpay_payment_id;
          payload.razorpayOrderId = response.razorpay_order_id;
          payload.razorpaySignature = response.razorpay_signature;

          try {
            await ordersService.create(payload);
            if (!isBuyNow) {
              await cartService.clear(cartId).catch(() => {});
            }
            showToast('Order placed! Your items have been secured.', 'success');
            setCartItems([]);
            setFormData({ fullName: '', email: '' });
            setSubmitAttempted(false);
          } catch (err) {
            console.warn('Failed to save order to DB:', err.message);
            showToast('Payment successful, but failed to save order.', 'error');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            showToast('Payment cancelled.', 'error');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      // If there's an error during initialization
      rzp.on('payment.failed', function (response){
        showToast('Payment failed: ' + response.error.description, 'error');
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      console.warn('Razorpay error:', err.message);
      showToast('Error initiating payment.', 'error');
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
            <CustomerForm
              formData={formData}
              onChange={handleFormChange}
              submitAttempted={submitAttempted}
            />
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
