import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqsService } from '../../services/api.js';

/**
 * Single collapsible FAQ item.
 */
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-outline-variant/30 rounded-xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        id={`faq-btn-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${faq.id}`}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="font-title-lg text-title-lg text-on-surface">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-secondary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Animated answer panel */}
      <div
        id={`faq-panel-${faq.id}`}
        role="region"
        aria-labelledby={`faq-btn-${faq.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 py-5 font-body-md text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/20 bg-surface">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

/**
 * FAQ section — accordion-style list sourced from backend /api/faqs.
 * Only one item is open at a time (accordion behaviour).
 */
function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    faqsService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch((err) => {
        console.warn('Backend FAQs not loaded, using local static fallback:', err.message);
      });
  }, []);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-stack-xl bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to know before you purchase.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>

          {/* Support CTA */}
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-10">
            Still have questions?{' '}
            <a href="mailto:support@lexisjuris.com" className="text-secondary font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
