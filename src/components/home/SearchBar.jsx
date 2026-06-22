import { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import { Search } from 'lucide-react';
import { booksService } from '../../services/api.js';
import { books as staticBooks } from '../../data/books.js';
import SearchDropdownResults from '../common/SearchDropdownResults.jsx';

function SearchBar({ placeholder, ctaLabel = 'Search', onSearch }) {
  const [query, setQuery] = useState('');
  const [allBooks, setAllBooks] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data)) setAllBooks(data);
      })
      .catch((err) => {
        console.warn('SearchBar books fetch failed, using local offline seed:', err.message);
        setAllBooks(staticBooks);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsFocused(false);
    onSearch?.(query);
  };

  return (
    <div className="relative w-full text-left">
      {/* Click outside overlay specifically for the SearchBar's dropdown */}
      {isFocused && query.trim() && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setIsFocused(false)}
        />
      )}
      
      <form
        onSubmit={handleSubmit}
        className="relative z-50 bg-white/80 backdrop-blur-xl border border-white/30 rounded-full shadow-xl flex items-center p-1.5 sm:p-2 pl-4 sm:pl-6 transition-transform duration-300 focus-within:scale-[1.02] focus-within:ring-2 focus-within:ring-secondary-container"
      >
        <Search className="text-outline mr-2 sm:mr-4 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsFocused(true);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface font-body-md text-body-md py-2 sm:py-3 placeholder:text-outline-variant text-sm sm:text-base outline-none"
        />
        <Button type="submit" variant="primary" rounded="full" size="sm" className="ml-1.5 sm:ml-2 shadow-md shrink-0">
          <span className="hidden sm:inline">{ctaLabel}</span>
          <Search className="sm:hidden w-4 h-4" />
        </Button>
      </form>

      {isFocused && query.trim() && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl p-4 max-h-[350px] overflow-y-auto">
          <SearchDropdownResults
            query={query}
            books={allBooks}
            onItemClick={() => {
              setIsFocused(false);
              setQuery('');
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SearchBar;