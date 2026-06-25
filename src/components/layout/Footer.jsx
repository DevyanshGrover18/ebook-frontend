import { Globe, Share2, Mail } from 'lucide-react';
import {
  footerBrand,
  socialLinks,
  footerColumns,
  copyrightNotice,
} from '../../data/footer.js';

const SOCIAL_ICON_MAP = {
  public: Globe,
  share: Share2,
  mail: Mail,
};

const legalColumn = footerColumns.find((col) => col.id === 'legal') ?? footerColumns[0];

function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">

        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand + socials */}
          <div className="flex items-center gap-6">
            <span
              className="text-primary whitespace-nowrap"
              style={{ fontFamily: 'Domine, Georgia, serif', fontSize: '40px', fontWeight: '700' }}
            >
              {footerBrand.name}
            </span>

            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.icon] ?? Globe;
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-primary-fixed text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal links */}
          <nav className="flex items-center gap-6">
            {legalColumn.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

        </div>

        {/* Copyright */}
        <p className="font-label-md text-label-md text-on-surface-variant/60 mt-6 text-center sm:text-left">
          {copyrightNotice}
        </p>

      </div>
    </footer>
  );
}

export default Footer;