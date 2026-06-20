import { useState } from 'react';
import Button from '../common/Button.jsx';
import { Search } from 'lucide-react';

/**
 * Central search bar. `onSearch` receives the query string so the parent
 * (or eventually a router) can decide what to do with it.
 */
function SearchBar({ placeholder, ctaLabel = 'Search', onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-full shadow-xl flex items-center p-2 pl-6 transition-transform duration-300 focus-within:scale-[1.02] focus-within:ring-2 focus-within:ring-secondary-container"
    >
      <Search className="text-outline mr-4 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface font-body-md text-body-md py-3 placeholder:text-outline-variant"
      />
      <Button type="submit" variant="primary" rounded="full" className="ml-2 shadow-md">
        {ctaLabel}
      </Button>
    </form>
  );
}

export default SearchBar;