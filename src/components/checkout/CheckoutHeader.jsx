import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Checkout-specific header — stripped-down, secure-session variant.
 * No navigation links; shows brand name + "Secure Session" + lock icon only.
 */
function CheckoutHeader({ brandName = "Lexis & Juris" }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight hover:opacity-90 transition-opacity"
        >
          {brandName}
        </Link>

        {/* Secure session indicator */}
        <div className="flex items-center gap-2">
          <span className="font-label-md text-label-md text-on-surface-variant hidden md:block">
            Secure Session
          </span>
          <Lock className="w-5 h-5 text-secondary" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}

export default CheckoutHeader;
