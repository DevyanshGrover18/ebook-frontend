import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { booksService } from '../../services/booksService';



function BookCard({ book }) {
  return (
    <article className="flex rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group bg-white">
      {/* Left colour panel — holds the cover, bleeds to card edge */}
      <div
        className="shrink-0 w-[130px] flex items-center justify-center px-6 py-8"
        style={{ backgroundColor: book.panelBg }}
      >
        <div className="w-[72px] h-[100px]">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover rounded-md" />
        </div>
      </div>

      {/* Right white content panel */}
      <div className="flex flex-col justify-between px-7 py-6 flex-1 min-w-0">
        <div className="flex flex-col gap-3">
          <span className="font-['Work_Sans'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#47556B]">
            {book.tag}
          </span>
          <h3 className="font-['Domine'] text-[22px] leading-[28px] font-semibold text-[#0F172A]">
            {book.title}
          </h3>
          <p className="font-['Work_Sans'] text-[14px] leading-[22px] text-[#47556B]">
            {book.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#ECEEF8]">
          <span className="font-['Work_Sans'] text-[20px] font-bold text-[#0F172A] tracking-tight">
            ₹ {book.price}
          </span>
          <button className="inline-flex items-center gap-1.5 font-['Work_Sans'] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#47556B] hover:text-[#0F172A] transition-colors duration-150">
            Read Sample
            <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

function StaffPicks({ books = [] }) {
  const [latestBooks, setLatestBooks] = useState(books.length > 0 ? books.slice(-2) : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        setLoading(true);
        const allBooks = await booksService.getAll();
        // Get the latest 2 books (assuming API returns them in order, or sort by id/date)
        const latest = allBooks.slice(-2);
        setLatestBooks(latest);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        // Fallback to default
        setLatestBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  return (
    <section className="bg-[#ECEEF8] px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <p className="font-['Work_Sans'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#47556B] mb-2">
            Editor Recommended
          </p>
          <h2 className="font-['Domine'] text-[32px] leading-[40px] font-semibold text-[#0F172A]">
            Staff Picks
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            <p className="text-[#47556B]">Loading latest picks...</p>
          ) : (
            latestBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default StaffPicks;