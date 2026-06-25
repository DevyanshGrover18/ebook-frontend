import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection.jsx';
import TrustedByBar from '../components/home/TrustedByBar.jsx';
import PracticeAreas from '../components/home/PracticeAreas.jsx';
import NewReleases from '../components/home/NewReleases.jsx';
import PremiumCTA from '../components/home/PremiumCTA.jsx';
import BookRequestButton from '../components/home/BookRequestButton.jsx'

import { trustedByLabel, trustedByLogos } from '../data/trustedBy.js';
import { premiumCta } from '../data/premiumCta.js';
import { books as staticBooks } from '../data/books.js';
import { booksService, categoriesService } from '../services/api.js';
import TrustMetrics from '../components/home/TrustMetrics.jsx';
import StaffPicks from '../components/home/StaffPicks.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import TestimonialStats from '../components/home/Testimonials.jsx';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    booksService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        } else {
          setBooks(staticBooks);
          console.warn('Backend books returned no records, using local seed fallback.');
        }
      })
      .catch((err) => {
        setBooks(staticBooks);
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
    <main className="pt-20">
      <HeroSection onSearch={handleSearch} />
      <TrustMetrics/>
      <PracticeAreas items={categories} />
      <NewReleases items={books} onQuickPreview={handleQuickPreview} />
      <StaffPicks/>
      <WhyChooseUs/>
      <TestimonialStats/>
      <BookRequestButton/>
    </main>
  );
}

export default HomePage;
