/**
 * Minimal checkout footer — two link columns only (Legal + Support).
 * Matches the design in code.html which omits the newsletter panel.
 */
const checkoutFooterData = {
  brand: 'Lexis & Juris',
  blurb:
    'The premier digital marketplace for high-stakes legal scholarship, established to bridge the gap between academic theory and judicial practice.',
  columns: [
    {
      id: 'legal',
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Licensing', href: '#' },
      ],
    },
    {
      id: 'support',
      heading: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Counsel', href: '#' },
        { label: 'Affiliate Program', href: '#' },
      ],
    },
  ],
  copyright: '© 2024 Lexis & Juris Marketplace. All intellectual rights reserved.',
};

function CheckoutFooter() {
  const { brand, blurb, columns, copyright } = checkoutFooterData;

  return (
    <footer className="bg-tertiary text-on-tertiary py-stack-xl mt-stack-xl">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter opacity-80">

        {/* Brand column — spans 2 on md */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-display-lg text-headline-md mb-4 text-on-tertiary">{brand}</h2>
          <p className="font-body-md text-body-md max-w-sm text-on-tertiary/80">{blurb}</p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed mb-2">
              {col.heading}
            </span>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body-md text-body-md text-on-tertiary hover:text-secondary-fixed-dim transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-stack-md border-t border-white/10 text-center">
        <p className="font-body-md text-body-md opacity-60">{copyright}</p>
      </div>
    </footer>
  );
}

export default CheckoutFooter;
