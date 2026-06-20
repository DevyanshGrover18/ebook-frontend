import { useState } from 'react';
import {
  footerBrand,
  socialLinks,
  footerColumns,
  newsletter,
  copyrightNotice,
} from '../../data/footer.js';
import IconButton from '../common/IconButton.jsx';
import { Globe, Share2, Mail, Send } from 'lucide-react';

const SOCIAL_ICON_MAP = {
  public: Globe,
  share: Share2,
  mail: Mail,
};

function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    // Wire up to a real subscription endpoint when the backend is ready.
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="w-full py-stack-xl bg-tertiary dark:bg-tertiary-container border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="font-display-lg text-headline-md text-on-tertiary mb-6">
            {footerBrand.name}
          </div>
          <p className="font-body-md text-body-md text-on-tertiary/70 mb-8 max-w-xs">
            {footerBrand.blurb}
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const IconComponent = SOCIAL_ICON_MAP[social.icon] || Globe;
              return (
                <IconButton
                  key={social.id}
                  icon={<IconComponent className="w-5 h-5" />}
                  label={social.label}
                  href={social.href}
                  className="text-on-tertiary opacity-80 hover:opacity-100"
                />
              );
            })}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-4">
            <h4 className="font-title-lg text-title-lg text-on-tertiary">{column.title}</h4>
            <nav className="flex flex-col gap-2">
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-on-tertiary-container hover:text-secondary-fixed-dim transition-colors opacity-80 hover:opacity-100 font-body-md text-body-md"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <h4 className="font-title-lg text-title-lg text-on-tertiary">{newsletter.title}</h4>
          <p className="text-on-tertiary-container opacity-80 font-body-md text-body-md mb-2">
            {newsletter.description}
          </p>
          <form className="flex" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={newsletter.placeholder}
              className="bg-white/5 border border-white/20 text-on-tertiary px-4 py-2 rounded-l-lg focus:outline-none focus:ring-0 focus:border-secondary w-full"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center justify-center bg-secondary text-on-secondary px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-16 pt-8 border-t border-white/10 text-center text-on-tertiary-container font-label-md text-label-md opacity-60">
        {copyrightNotice}
      </div>
    </footer>
  );
}

export default Footer;