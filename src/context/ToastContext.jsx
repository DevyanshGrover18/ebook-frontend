import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <ToastContainer
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ message, type, duration, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgStyle =
    type === 'success'
      ? 'bg-primary-container text-on-primary border-secondary/30'
      : 'bg-error-container text-on-error-container border-error/20';

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const iconColor = type === 'success' ? 'text-secondary' : 'text-error';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl backdrop-blur-md max-w-sm ${bgStyle}`}
      style={{
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      role="status"
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <span className="font-label-md text-label-md leading-snug flex-grow">
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        className="text-on-primary/60 hover:text-on-primary p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
