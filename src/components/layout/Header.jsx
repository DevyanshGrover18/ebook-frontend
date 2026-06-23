import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IconButton from '../common/IconButton.jsx';
import Button from '../common/Button.jsx';
import { Search, ChevronRight, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { categoriesService, booksService } from '../../services/api.js';
import { books as staticBooks } from '../../data/books.js';
import SearchDropdownResults from '../common/SearchDropdownResults.jsx';

const MAX_VISIBLE_NAV = 4;

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

function Header({ brandName = 'Lexis & Juris', links = [], onSignIn }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allBooks, setAllBooks] = useState([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    categoriesService.getAll()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c) => c.title).filter(Boolean));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingCats(false));
  }, []);

  useEffect(() => {
    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data)) setAllBooks(data);
      })
      .catch((err) => {
        console.warn('Header books fetch failed, using local offline seed:', err.message);
        setAllBooks(staticBooks);
      });
  }, []);

  const allNavItems = isLoadingCats
    ? links.map((link) => ({ label: link.label, href: link.href, key: link.id }))
    : categories.map((cat) => ({ label: cat, href: `/books?category=${slugify(cat)}`, key: cat }));

  const visibleNavItems = allNavItems.slice(0, MAX_VISIBLE_NAV);
  const overflowNavItems = allNavItems.slice(MAX_VISIBLE_NAV);

  const isItemActive = (label) =>
    location.search.includes(`category=${slugify(label)}`);

  const isOverflowActive = overflowNavItems.some(({ label }) => isItemActive(label));

  return (
    <>
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[45]"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
        />
      )}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div
          className={`flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-300 ${
            isScrolled ? 'py-2' : 'py-4'
          }`}
        >
          {isSearchOpen ? (
            <div className="flex-1 flex items-center justify-between gap-4 h-10 relative">
              {/* Search bar inside header */}
              <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant/50 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-secondary-container">
                <Search className="text-outline-variant w-4 h-4 mr-2.5" />
                <input
                  type="text"
                  placeholder="Search legal guides, publications, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface font-body-md text-body-md py-1 placeholder:text-outline-variant/60 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="font-label-md text-label-md text-secondary hover:underline cursor-pointer py-1.5 shrink-0"
              >
                Cancel
              </button>

              {/* Header Dropdown Results */}
              {searchQuery.trim() && (
                <div className="absolute top-12 left-0 right-0 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl p-4 z-[60] max-h-[400px] overflow-y-auto">
                  <SearchDropdownResults query={searchQuery} books={allBooks} onItemClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }} />
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/"
                className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight hover:opacity-90 transition-opacity shrink-0"
              >
                {brandName}
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6">
                {visibleNavItems.map(({ label, href, key }) => {
                  const isCurrent = isLoadingCats
                    ? location.pathname === href
                    : isItemActive(label);
                  return (
                    <Link
                      key={key}
                      to={href}
                      className={
                        isCurrent
                          ? 'text-secondary font-semibold border-b-2 border-secondary pb-1 font-label-md text-label-md whitespace-nowrap'
                          : 'text-on-surface-variant font-medium hover:text-secondary transition-colors duration-300 font-label-md text-label-md whitespace-nowrap'
                      }
                    >
                      {label}
                    </Link>
                  );
                })}

                {/* "More" overflow dropdown */}
                {overflowNavItems.length > 0 && (
                  <div className="relative" ref={moreRef}>
                    <button
                      onClick={() => setMoreOpen((prev) => !prev)}
                      className={`flex items-center gap-1 font-label-md text-label-md whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                        isOverflowActive
                          ? 'text-secondary font-semibold border-b-2 border-secondary pb-1'
                          : 'text-on-surface-variant font-medium hover:text-secondary'
                      }`}
                    >
                      More
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {moreOpen && (
                      <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl py-2 z-[70]">
                        {overflowNavItems.map(({ label, href, key }) => {
                          const isCurrent = isItemActive(label);
                          return (
                            <Link
                              key={key}
                              to={href}
                              onClick={() => setMoreOpen(false)}
                              className={`block px-4 py-2.5 font-label-md text-label-md transition-colors duration-200 ${
                                isCurrent
                                  ? 'text-secondary font-semibold bg-secondary-container/30'
                                  : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low'
                              }`}
                            >
                              {label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-3 md:gap-6 shrink-0">
                <IconButton icon={<Search className="w-5 h-5" />} label="Search" onClick={() => setIsSearchOpen(true)} />
                <Button
                  className="flex items-center gap-1 cursor-pointer"
                  variant="primary"
                  size="sm"
                  rounded="lg"
                  onClick={() => navigate('/checkout')}
                >
                  <span className="hidden sm:inline">Cart</span>
                  <ShoppingCart size={18} />
                </Button>
                {/* Hamburger — mobile only */}
                <button
                  className="md:hidden p-1 text-on-surface-variant hover:text-secondary transition-colors"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/20 bg-surface-container-lowest/95 backdrop-blur-xl px-margin-mobile py-4 flex flex-col gap-1">
            {allNavItems.map(({ label, href, key }) => {
              const isCurrent = isLoadingCats
                ? location.pathname === href
                : isItemActive(label);
              return (
                <Link
                  key={key}
                  to={href}
                  className={`py-2 font-label-md text-label-md transition-colors duration-200 ${
                    isCurrent
                      ? 'text-secondary font-semibold'
                      : 'text-on-surface-variant font-medium hover:text-secondary'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            
          </nav>
        )}
      </header>
    </>
  );
}

export default Header;