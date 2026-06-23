import SectionHeader from '../common/SectionHeader.jsx';
import BookCard from './BookCard.jsx';
import { newReleasesHeading, books } from '../../data/books.js';

function NewReleases({ heading = newReleasesHeading, items = books, onQuickPreview }) {
  return (
    <section className="py-stack-xl bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHeader title={heading.title} variant="divider" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {items.map((book) => (
            <BookCard key={book.id} book={book} onQuickPreview={onQuickPreview} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewReleases;