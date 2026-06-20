import { CheckCircle2 } from 'lucide-react';

/**
 * Overview tab panel.
 * Renders the book description paragraph(s) and a styled key-feature bullet list.
 */
function AboutBook({ description, keyFeatures }) {
  return (
    <div
      id="tabpanel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      className="py-12"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">About This Publication</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="font-title-lg text-title-lg text-primary mb-6">Key Features</h3>
            <ul className="flex flex-col gap-4">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="font-body-md text-body-md text-on-surface-variant">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutBook;
