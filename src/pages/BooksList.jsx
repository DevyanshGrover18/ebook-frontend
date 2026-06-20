import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import BookCard from '../components/home/BookCard.jsx';
import { books as staticBooks } from '../data/books.js';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { booksService } from '../services/api.js';

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

function BooksListPage() {
  const [books, setBooks] = useState(staticBooks);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'recommended';

  const setSelectedCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') {
      next.delete('category');
    } else {
      next.set('category', slugify(category));
    }
    setSearchParams(next, { replace: true });
  };

  const setSearchQuery = (query) => {
    const next = new URLSearchParams(searchParams);
    if (!query) {
      next.delete('search');
    } else {
      next.set('search', query);
    }
    setSearchParams(next, { replace: true });
  };

  const setSortBy = (sort) => {
    const next = new URLSearchParams(searchParams);
    if (sort === 'recommended') {
      next.delete('sort');
    } else {
      next.set('sort', sort);
    }
    setSearchParams(next, { replace: true });
  };

  // Fetch books from backend API
  useEffect(() => {
    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Backend books fetch failed, using local offline seed:', err.message);
        setIsLoading(false);
      });
  }, []);

  // Compute categories dynamically from book catalog
  const categories = useMemo(() => {
    const list = new Set(books.map((b) => b.category).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [books]);

  // Handle filtering, searching, and sorting
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((b) => slugify(b.category) === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
         (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          (b.description && b.description.toLowerCase().includes(query))
      );
    }

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [books, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-stack-xl max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop min-h-[70vh]">
        {/* Page Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="font-headline-md text-headline-sm md:text-headline-md text-primary mb-2">
            The Legal Repository
          </h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">
            Explore authoritative legal guides, texts, and resources written by distinguished scholars and jurists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* ── Left Column: Filters Panel ── */}
          <aside className="lg:col-span-3 bg-surface-container-low rounded-xl p-6 border border-outline-variant/30 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
              <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" /> Filters
              </h3>
              {(selectedCategory !== 'All' || searchQuery !== '' || sortBy !== 'recommended') && (
                <button
                  onClick={handleResetFilters}
                  className="text-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label htmlFor="search" className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Search Catalog
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-outline-variant rounded-xl p-3 pr-10 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md text-body-md text-on-surface"
                />
                <Search className="w-5 h-5 absolute right-3 top-3.5 text-on-surface-variant/60" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="mb-6">
              <label htmlFor="sort" className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                Sort Publications
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-body-md text-body-md text-on-surface cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Category Filter Chips */}
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant mb-3 block">
                Categories
              </span>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => {
                  const isActive = cat === 'All' ? selectedCategory === 'All' : slugify(cat) === selectedCategory;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-left font-label-md text-label-md transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-secondary text-on-secondary shadow-md font-semibold'
                          : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── Right Column: Book Cards List Grid ── */}
          <section className="lg:col-span-9" aria-label="Book catalog">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
                <p className="font-title-lg text-title-lg text-on-surface-variant">Loading legal library...</p>
              </div>
            ) : filteredAndSortedBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-low border border-outline-variant/30 rounded-xl">
                <Search className="w-12 h-12 text-outline mb-4" />
                <h3 className="font-title-lg text-title-lg text-on-surface mb-2">No publications found</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6 max-w-sm">
                  Try adjusting your search criteria or reset filters to explore our full legal repository.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider px-2">
                  <span>Showing {filteredAndSortedBooks.length} results</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {filteredAndSortedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default BooksListPage;
