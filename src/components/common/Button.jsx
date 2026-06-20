const VARIANT_STYLES = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'bg-secondary text-on-secondary hover:scale-105 shadow-xl',
  inverted: 'bg-primary-container text-on-primary hover:opacity-90',
  outlined:
    'bg-white/10 text-on-primary border border-white/20 backdrop-blur-md hover:bg-white/20',
};

const SIZE_STYLES = {
  sm: 'px-6 py-2 text-label-md font-label-md',
  md: 'px-8 py-3 text-label-md font-label-md',
  lg: 'px-10 py-4 text-title-lg font-title-lg',
};

const RADIUS_STYLES = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

/**
 * Generic call-to-action button driven entirely by props so it can render
 * any of the brand lexicon's button styles.
 *
 * @param {'primary'|'secondary'|'inverted'|'outlined'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {'lg'|'xl'|'full'} rounded
 */
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
  const classes = `inline-flex items-center justify-center gap-2 transition-all duration-300 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${RADIUS_STYLES[rounded]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;