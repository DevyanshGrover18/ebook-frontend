import { useNavigate } from 'react-router-dom';

/**
 * Renders a dropdown list of books matching the query.
 * Clicking a book navigates to its detail page.
 */
function SearchDropdownResults({ query, books, onItemClick }) {
  const navigate = useNavigate();

  const filtered = books.filter((book) => {
    const q = query.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      (book.category && book.category.toLowerCase().includes(q))
    );
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-6 text-on-surface-variant font-body-md text-body-md">
        No results found for "<span className="font-semibold">{query}</span>"
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-outline-variant/10">
      <div className="text-xs font-bold text-outline-variant/80 uppercase tracking-wider pb-2 px-2">
        Publications ({filtered.length})
      </div>
      {filtered.map((book) => (
        <button
          key={book.id}
          type="button"
          onClick={() => {
            navigate(`/books/${book.id}`);
            onItemClick?.();
          }}
          className="flex items-start gap-4 py-3 hover:bg-surface-container-low transition-colors duration-200 text-left w-full cursor-pointer px-2 rounded-xl"
        >
          {book.image && (
            <img
              src={book.image}
              alt={book.imageAlt || book.title}
              className="w-10 h-14 object-cover rounded-lg border border-outline-variant/20 shadow-sm shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold mb-0.5">
              {book.title}
            </h4>
            <p className="text-on-surface-variant font-label-md text-label-md truncate mb-1">
              by {book.author}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary">
                {book.category}
              </span>
              <span className="text-primary font-title-sm text-title-sm font-bold">
                ₹{book.price.toFixed(2)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default SearchDropdownResults;
