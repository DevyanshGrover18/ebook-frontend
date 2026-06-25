import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../common/Button.jsx';
import { Search } from 'lucide-react';
import { booksService } from '../../services/api.js';
import { books as staticBooks } from '../../data/books.js';
import SearchDropdownResults from '../common/SearchDropdownResults.jsx';

function SearchBar({ placeholder, ctaLabel = 'Search', onSearch }) {
  const [query, setQuery] = useState('');
  const [allBooks, setAllBooks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    booksService.getAll()
      .then((data) => { if (Array.isArray(data)) setAllBooks(data); })
      .catch(() => setAllBooks(staticBooks));
  }, []);

  // Recalculate dropdown position whenever it opens or window resizes
  useEffect(() => {
    if (!isFocused || !query.trim()) return;

    const reposition = () => {
      if (!formRef.current) return;
      const rect = formRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };

    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isFocused, query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFocused(false);
    onSearch?.(query);
  };

  const showDropdown = isFocused && query.trim();

  return (
    <div className="relative w-full text-left">
      {/* Backdrop to close on outside click */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsFocused(false)}
        />
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative z-50 bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl shadow-xl flex items-center p-1.5 sm:p-2 pl-4 sm:pl-6 transition-colors duration-300 focus-within:bg-white/15 focus-within:border-white/25"
      >
        <Search className="text-white/50 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => { setQuery(e.target.value); setIsFocused(true); }}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-white font-['Work_Sans'] text-sm sm:text-base leading-[24px] py-2 sm:py-2.5 placeholder:text-white/40 outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          rounded="lg"
          size="sm"
          className="ml-1.5 sm:ml-2 shrink-0 normal-case font-medium tracking-normal"
        >
          <Search className="sm:hidden w-4 h-4" />
          <span className="hidden sm:inline">{ctaLabel}</span>
        </Button>
      </form>

      {/* Portal dropdown — renders at document.body, escaping all stacking contexts */}
      {showDropdown && createPortal(
        <div
          style={dropdownStyle}
          className="bg-white border border-outline-variant/50 rounded-2xl shadow-2xl p-4 max-h-[350px] overflow-y-auto text-primary"
        >
          <SearchDropdownResults
            query={query}
            books={allBooks}
            onItemClick={() => { setIsFocused(false); setQuery(''); }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

export default SearchBar;