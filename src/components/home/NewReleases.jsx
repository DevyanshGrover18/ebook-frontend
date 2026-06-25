import { useEffect, useState } from 'react';
import SectionHeader from '../common/SectionHeader.jsx';
import BookCard from './BookCard.jsx';
import { newReleasesHeading, books as fallbackBooks } from '../../data/books.js';
import { booksService } from '../../services/api.js';

function NewReleases({ heading = newReleasesHeading, items = [], onQuickPreview }) {
  const [books, setBooks] = useState(items.length ? items : fallbackBooks);

  useEffect(() => {
    if (items.length > 0) {
      setBooks(items);
      return;
    }

    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
      })
      .catch((err) => {
        console.warn('NewReleases failed to load books from backend:', err.message);
      });
  }, [items]);

  return (
    <section className="py-stack-xl bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHeader title={heading.title} variant="divider" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="featured" onQuickPreview={onQuickPreview} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewReleases;