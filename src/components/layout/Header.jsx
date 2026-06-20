import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/navigation.js';
import IconButton from '../common/IconButton.jsx';
import Button from '../common/Button.jsx';
import { Search } from 'lucide-react';

/**
 * Fixed top navigation bar. `brandName` and `navLinks`/`onSignIn` are props
 * so this same component can be reused across every page.
 */
function Header({ brandName = 'Lexis & Juris', links = navLinks, onSignIn }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignInClick = () => {
    if (typeof onSignIn === 'function') {
      onSignIn();
    } else {
      navigate('/admin');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div
        className={`flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <Link to="/" className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight hover:opacity-90 transition-opacity">
          {brandName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isCurrent = location.pathname === link.href;
            return (
              <Link
                key={link.id}
                to={link.href}
                className={
                  isCurrent
                    ? 'text-secondary font-semibold border-b-2 border-secondary pb-1 font-label-md text-label-md'
                    : 'text-on-surface-variant font-medium hover:text-secondary transition-colors duration-300 font-label-md text-label-md'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <IconButton icon={<Search className="w-5 h-5" />} label="Search" />
          <Button variant="primary" size="sm" rounded="lg" onClick={handleSignInClick}>
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;