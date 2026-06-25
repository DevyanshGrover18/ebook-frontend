const VARIANT_STYLES = {
  // Filled navy — used inside search bar and on light surfaces
  primary:
    'bg-[#0F172A] text-white hover:bg-[#1E2B3B] active:opacity-90',

  // Slate-blue filled — secondary actions on light surfaces
  secondary:
    'bg-[#47556B] text-white hover:bg-[#3a4a5e] shadow-lg',

  // Dark container filled — inverted surfaces
  inverted:
    'bg-[#1E2B3B] text-white hover:opacity-90',

  // White border + frosted glass — primary CTA on dark hero (matches "BROWSE COLLECTIONS")
  'outlined-white':
    'bg-white/10 text-white border border-white/80 backdrop-blur-md hover:bg-white/20 active:bg-white/25',

  // No border, subtle text — ghost CTA on dark hero (matches "FREE SAMPLE")
  ghost:
    'bg-transparent text-white/80 border border-white/20 hover:text-white hover:border-white/50 hover:bg-white/5',

  // Border only — actions on light/surface backgrounds
  outlined:
    'bg-transparent text-[#0F172A] border border-[#0F172A]/40 hover:bg-[#0F172A]/5',
};

const SIZE_STYLES = {
  sm:  'px-5 py-2 text-[12px] leading-[16px] tracking-[0.05em] font-semibold font-["Work_Sans"]',
  md:  'px-8 py-3 text-[14px] leading-[20px] tracking-[0.02em] font-medium font-["Work_Sans"]',
  lg:  'px-10 py-4 text-[20px] leading-[28px] font-semibold font-["Work_Sans"]',
};

const RADIUS_STYLES = {
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  '2xl':'rounded-2xl',
  full: 'rounded-full',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'xl',
  href,
  onClick,
  className = '',
  type = 'button',
}) {
  const classes = `inline-flex items-center justify-center gap-2 transition-all duration-200 ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary} ${SIZE_STYLES[size]} ${RADIUS_STYLES[rounded]} ${className}`;

  if (href) {
    return <a href={href} className={classes}>{children}</a>;
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;