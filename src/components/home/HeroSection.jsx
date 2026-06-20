import SearchBar from './SearchBar.jsx';
import TrustMetrics from './TrustMetrics.jsx';
import { heroContent, trustMetrics } from '../../data/hero.js';

function HeroSection({ content = heroContent, metrics = trustMetrics, onSearch }) {
  return (
    <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden bg-surface-container-low">
      <div className="relative z-10 w-full max-w-[900px] px-margin-mobile text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8 leading-tight">
          {content.headlineLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < content.headlineLines.length - 1 && <br className="hidden md:block" />}
              {index < content.headlineLines.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <div className="relative max-w-3xl mx-auto mb-12">
          <SearchBar
            placeholder={content.searchPlaceholder}
            ctaLabel={content.searchCtaLabel}
            onSearch={onSearch}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <span className="text-label-sm text-outline uppercase tracking-wider">
              {content.trendingLabel}
            </span>
            {content.trendingTopics.map((topic) => (
              <a
                key={topic.id}
                href={topic.href}
                className="text-label-sm text-secondary hover:underline"
              >
                {topic.label}
              </a>
            ))}
          </div>
        </div>

        <TrustMetrics metrics={metrics} />
      </div>
    </section>
  );
}

export default HeroSection;