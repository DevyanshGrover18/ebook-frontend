import Button from '../common/Button.jsx';

function PremiumCTA({ content }) {
  const { title, description, primaryCta, secondaryCta, image, imageAlt } = content;

  return (
    <section className="py-stack-xl px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto bg-primary-container rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
        <div className="relative z-10 p-12 md:p-20 md:w-3/5">
          <h2 className="font-display-lg text-headline-md text-on-primary mb-6">{title}</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-10 max-w-lg">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" size="lg" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
            <Button variant="outlined" size="lg" href={secondaryCta.href}>
              {secondaryCta.label}
            </Button>
          </div>
        </div>
        <div className="md:w-2/5 h-64 md:h-auto relative bg-secondary-container">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            role="img"
            aria-label={imageAlt}
          />
        </div>
      </div>
    </section>
  );
}

export default PremiumCTA;