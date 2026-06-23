import { useState, useEffect, useRef } from 'react';
import { X, BookPlus, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { bookRequestsService } from '../../services/requestBookService.js';

const MAX_IMAGE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function RequestBookModal({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    reason: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus first input on open
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only JPG, PNG, or WEBP images are accepted.');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!form.title.trim()) {
      setSubmitError('Book title is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (imageFile) body.append('image', imageFile);

      await bookRequestsService.create(body);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="request-book-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center">
              <BookPlus className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 id="request-book-title" className="font-headline-sm text-headline-sm text-on-surface">
                Request a Book
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We'll source it for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <CheckCircle className="w-14 h-14 text-secondary" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Request sent!</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                We've received your request and will look into sourcing this book. Thank you!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Title */}
              <Field label="Book title" required>
                <input
                  ref={firstInputRef}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. The Law of Contract"
                  required
                  className={inputCls}
                />
              </Field>

              {/* Author */}
              <Field label="Author">
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="e.g. Ewan McKendrick"
                  className={inputCls}
                />
              </Field>

              {/* ISBN + Publisher in a row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="ISBN">
                  <input
                    name="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                    placeholder="978-..."
                    className={inputCls}
                  />
                </Field>
                <Field label="Publisher">
                  <input
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                    placeholder="e.g. Oxford"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Reason */}
              <Field label="Why do you need this book?">
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe your use case or practice area..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* Image upload */}
              <Field label="Book cover or reference image" hint="Optional — JPG, PNG, WEBP · max 5 MB">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="book-image-upload"
                />
                {!imagePreview ? (
                  <label
                    htmlFor="book-image-upload"
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant/60 rounded-xl py-6 px-4 cursor-pointer hover:border-secondary hover:bg-secondary-container/10 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-outline-variant" />
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Upload image
                    </span>
                  </label>
                ) : (
                  <div className="relative w-full rounded-xl overflow-hidden border border-outline-variant/40 h-36">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {imageError && (
                  <p className="text-error font-body-sm text-body-sm mt-1">{imageError}</p>
                )}
              </Field>

              {submitError && (
                <p className="font-body-sm text-body-sm text-error bg-error-container/20 rounded-lg px-4 py-2">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer mt-1 py-3 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send request'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── small helpers ── */

const inputCls =
  'w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary-container transition-shadow';

function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="font-body-sm text-body-sm text-outline-variant">{hint}</p>}
    </div>
  );
}

/* ── Floating button (default export) ── */

export default function RequestBookButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed cursor-pointer bottom-6 right-6 z-[100] flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-on-secondary shadow-lg hover:shadow-xl hover:opacity-95 active:scale-95 transition-all font-label-lg text-label-lg"
        aria-label="Request a book"
      >
        <BookPlus className="w-5 h-5 shrink-0" />
        <span>Request a book</span>
      </button>

      {/* Modal */}
      {open && <RequestBookModal onClose={() => setOpen(false)} />}
    </>
  );
}