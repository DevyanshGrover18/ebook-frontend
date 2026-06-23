import { useState } from 'react';
import { useSearchParams, useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, Copy, Check, ChevronRight, Download } from 'lucide-react';

function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');
  
  // Get order data from location state passed from Checkout
  const orderData = location.state?.order;

  // If there's no status in URL, we shouldn't be on this page
  if (!status) {
    return <Navigate to="/" replace />;
  }

  const isSuccess = status === 'success';

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="pt-24 pb-stack-xl max-w-container mx-auto px-margin-mobile md:px-margin-desktop min-h-[75vh] flex justify-center items-start">
      <div className="w-full max-w-3xl">
        
        {/* Status Header */}
        <div className="flex flex-col items-center text-center mb-10">
          {isSuccess ? (
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
          
          <h1 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-3">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-lg">
            {isSuccess 
              ? 'Thank you for your purchase. Your digital books are now available.'
              : reason 
                ? `We couldn't process your payment: ${decodeURIComponent(reason)}`
                : 'Something went wrong while processing your payment. Please try again.'}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Card Header */}
          <div className="border-b border-outline-variant/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mb-1">
                Order Reference
              </p>
              <div className="flex items-center gap-2">
                <span className="font-title-lg text-title-lg font-mono text-on-surface">
                  {orderId || 'N/A'}
                </span>
                {orderId && (
                  <button 
                    onClick={handleCopyOrderId}
                    className="p-1.5 text-secondary hover:bg-secondary/10 rounded-md transition-colors"
                    title="Copy Order ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className={`px-4 py-1.5 rounded-full font-label-md text-label-md ${
                isSuccess 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {isSuccess ? 'Paid' : 'Failed'}
              </span>
            </div>
          </div>

          {/* If order data is available, show details */}
          {orderData && (
            <div className="flex flex-col md:flex-row">
              {/* Items List */}
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant/30">
                <h3 className="font-title-md text-title-md text-on-surface mb-4">Items Purchased</h3>
                <div className="space-y-4">
                  {orderData.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.imageAlt || item.title} 
                          className="w-16 h-24 object-cover rounded-md border border-outline-variant/30 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-surface-container-high rounded-md border border-outline-variant/30 shrink-0 flex items-center justify-center text-on-surface-variant">
                          No Image
                        </div>
                      )}
                      <div>
                        <h4 className="font-title-sm text-title-sm text-on-surface leading-tight mb-1">
                          {item.title}
                        </h4>
                        <p className="text-on-surface-variant text-body-sm font-body-sm mb-2">
                          {item.author}
                        </p>
                        {isSuccess && (
                          <button className="flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:underline cursor-pointer">
                            <Download className="w-3.5 h-3.5" /> Download PDF
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary List */}
              <div className="w-full md:w-64 p-6 bg-surface-container-lowest">
                <h3 className="font-title-md text-title-md text-on-surface mb-4">Summary</h3>
                <div className="space-y-3 font-body-md text-body-md">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>₹{(orderData.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {(orderData.discount || 0) > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-₹{orderData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tax</span>
                    <span>₹{(orderData.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-outline-variant/30 flex justify-between font-title-lg text-title-lg text-on-surface">
                    <span>Total</span>
                    <span>₹{(orderData.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!orderData && (
            <div className="p-6 text-center text-on-surface-variant text-body-md">
              Order details are unavailable. Check your email for the receipt.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isSuccess ? (
            <Link 
              to="/books" 
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Continue Browsing <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              to="/checkout" 
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Try Payment Again
            </Link>
          )}
        </div>
        
      </div>
    </main>
  );
}

export default OrderStatusPage;
