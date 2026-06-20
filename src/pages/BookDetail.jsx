import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import BookHero from '../components/bookdetail/BookHero.jsx';
import BookTabs from '../components/bookdetail/BookTabs.jsx';
import AboutBook from '../components/bookdetail/AboutBook.jsx';
import TableOfContents from '../components/bookdetail/TableOfContents.jsx';
import ReviewsSection from '../components/bookdetail/ReviewsSection.jsx';
import RelatedBooks from '../components/bookdetail/RelatedBooks.jsx';
import FAQSection from '../components/bookdetail/FAQSection.jsx';
import { books } from '../data/books.js';
import { booksService } from '../services/api.js';

/**
 * Book Details page — driven entirely by the `id` URL param.
 * Resolves the book and its related titles from the static books array.
 * Tab state is local to this page; tabs control which content panel is visible.
 */
function BookDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Resolve the requested book locally first as fallback
  const staticBook = books.find((b) => b.id === id);
  const [book, setBook] = useState(staticBook);

  useEffect(() => {
    booksService.getById(id)
      .then((data) => {
        if (data && data.id) {
          setBook(data);
        }
      })
      .catch((err) => {
        console.warn('Backend book details not loaded, using local static fallback:', err.message);
      });
  }, [id]);

  // Guard: unknown id → redirect home
  if (!book) {
    return <Navigate to="/" replace />;
  }

  // Resolve related books (up to 4)
  const relatedBooks = book.relatedBookIds
    ? book.relatedBookIds.map((rid) => books.find((b) => b.id === rid)).filter(Boolean)
    : [];


  return (
    <>
      <Header />
      <main className="pt-20">

        {/* ── Hero: Cover + Purchase Panel ── */}
        <BookHero book={book} />

        {/* ── Sticky Tab Bar ── */}
        <BookTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewCount={book.reviews?.length}
        />

        {/* ── Tab Panels ── */}
        <div className="bg-surface">
          {activeTab === 'overview' && (
            <AboutBook
              description={book.description}
              keyFeatures={book.keyFeatures}
            />
          )}
          {activeTab === 'contents' && (
            <TableOfContents chapters={book.tableOfContents} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsSection reviews={book.reviews} />
          )}
        </div>

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── Related Books ── */}
        <RelatedBooks books={relatedBooks} />

      </main>
      <Footer />
    </>
  );
}

export default BookDetailPage;
