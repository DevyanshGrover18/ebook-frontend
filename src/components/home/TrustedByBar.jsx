function TrustedByBar({ label, logos }) {
  return (
    <section className="bg-surface py-12 border-b border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <p className="font-label-sm text-label-sm text-outline-variant uppercase tracking-[0.2em] mb-4 md:mb-0">
            {label}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {logos.map((logo) => (
              <span
                key={logo.id}
                className={`font-display-lg text-headline-sm text-on-surface-variant ${logo.className}`}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedByBar;