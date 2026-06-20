import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import HeroSection from '../components/home/HeroSection.jsx';
import TrustedByBar from '../components/home/TrustedByBar.jsx';
import PracticeAreas from '../components/home/PracticeAreas.jsx';
import NewReleases from '../components/home/NewReleases.jsx';
import PremiumCTA from '../components/home/PremiumCTA.jsx';

import { trustedByLabel, trustedByLogos } from '../data/trustedBy.js';
import { premiumCta } from '../data/premiumCta.js';
import { books as staticBooks } from '../data/books.js';
import { booksService, categoriesService } from '../services/api.js';

function HomePage() {
  const [books, setBooks] = useState(staticBooks);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
      })
      .catch((err) => {
        console.warn('Backend books not loaded, using local seed fallback:', err.message);
      });

    categoriesService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Backend categories not loaded, using local seed fallback:', err.message);
      });
  }, []);

  const handleSearch = (query) => {
    navigate(`/books?search=${encodeURIComponent(query)}`);
  };

  const handleQuickPreview = (book) => {
    console.log('Quick preview requested for:', book.title);
  };

  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection onSearch={handleSearch} />
        <TrustedByBar label={trustedByLabel} logos={trustedByLogos} />
        <PracticeAreas items={categories} />
        <NewReleases items={books} onQuickPreview={handleQuickPreview} />
        <PremiumCTA content={premiumCta} />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
