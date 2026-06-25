import { BadgeCheck, FileEdit, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Expertly Vetted',
    description:
      'Written and reviewed by senior advocates with over 20 years of high-stakes courtroom experience.',
  },
  {
    icon: FileEdit,
    title: 'Fully Customizable',
    description:
      'Provided in editable formats. Easily adapt templates to fit your specific case nuances and local rules.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description:
      'Zero waiting time. Download your selected collections immediately after purchase and start drafting.',
  },
];

function WhyChooseUs({
  eyebrow = 'The Professional Choice',
  title = 'Why Hundreds of Firms Choose Our Drafts',
  features = FEATURES,
}) {
  return (
    <section className="py-stack-2xl bg-primary">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-widest mb-4">
            {eyebrow}
          </p>
          <h2
            className="font-headline-md text-headline-md text-on-primary mx-auto"
            style={{ maxWidth: '720px' }}
          >
            {title}
          </h2>
          {/* Divider */}
          <div className="mx-auto mt-6 h-px w-12 bg-on-primary-container opacity-40" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {features.map(({ icon: Icon, title: featureTitle, description }) => (
            <div
              key={featureTitle}
              className="flex flex-col items-center bg-white/5 hover:bg-white/10 text-center rounded-2xl px-8 py-10"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Icon badge */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full mb-8"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Icon className="w-6 h-6 text-on-primary" strokeWidth={1.75} />
              </div>

              <h3 className="font-title-lg text-title-lg text-on-primary mb-3">
                {featureTitle}
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;