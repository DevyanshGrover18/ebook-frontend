import { Search, Bookmark, Globe, Share2, Mail, Send, Eye, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  search: Search,
  bookmark: Bookmark,
  public: Globe,
  share: Share2,
  mail: Mail,
  send: Send,
  visibility: Eye,
  arrow_forward: ArrowRight,
};

/**
 * Icon-only button used for the header search trigger, book bookmark toggle,
 * and the newsletter submit action. Supports Lucide React icons via name or node.
 */
function IconButton({
  icon,
  label,
  onClick,
  href,
  variant = 'ghost',
  className = '',
}) {
  const variants = {
    ghost: 'text-on-surface-variant hover:text-primary',
    ghostAccent: 'text-on-surface-variant hover:text-secondary',
    filled: 'bg-secondary text-on-secondary p-2 hover:opacity-90',
  };

  const classes = `inline-flex items-center justify-center cursor-pointer transition-colors rounded-full ${variants[variant]} ${className}`;

  let iconElement = icon;
  if (typeof icon === 'string') {
    const IconComponent = ICON_MAP[icon];
    iconElement = IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  }

  if (href) {
    return (
      <a href={href} aria-label={label} className={classes}>
        {iconElement}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {iconElement}
    </button>
  );
}

export default IconButton;