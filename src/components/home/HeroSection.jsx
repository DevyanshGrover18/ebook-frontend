import SearchBar from './SearchBar.jsx';
import Button from '../common/Button.jsx';
import { heroContent } from '../../data/hero.js';

function HeroSection({ content = heroContent, onSearch }) {
  return (
    <section className="relative min-h-150 sm:min-h-112.5 md:min-h-155 flex items-center justify-center overflow-hidden bg-[#10182b] py-20 md:py-0">
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "url(https://www.transparenttextures.com/patterns/cubes.png)",
          backgroundSize: '56px 100px',
        }}
      />

      {/* Soft vignette so center content pops */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0c1322]/40 via-transparent to-[#0c1322]/60" />

      <div className="relative z-10 w-full max-w-190 px-margin-mobile text-center">
        <span className="inline-block bg-white/10 border border-white/15 text-white/70 text-[11px] font-['Work_Sans'] font-semibold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 mb-6">
          {content.eyebrow}
        </span>

        <h1 className="font-['Domine'] text-3xl sm:text-4xl md:text-[48px] md:leading-14 font-bold tracking-[-0.02em] mb-5 md:mb-6">
          {content.headlineLines.map((line, index) => (
            <span key={line.text}>
              <span className={line.tone === 'accent' ? 'text-[#A9C3F5]' : 'text-white'}>
                {line.text}
              </span>
              {index < content.headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="font-['Work_Sans'] text-[18px] leading-7 font-normal text-white/55 max-w-xl mx-auto mb-9 md:mb-10">
          {content.subheadline}
        </p>

        <div className="relative max-w-2xl mx-auto mb-8 md:mb-10">
          <SearchBar
            placeholder={content.searchPlaceholder}
            ctaLabel={content.searchCtaLabel}
            onSearch={onSearch}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button
            href={content.primaryCta.href}
            variant="outlined-white"
            rounded="lg"
            size="md"
            className="uppercase tracking-widest"
          >
            {content.primaryCta.label}
          </Button>
          <Button
            href={content.secondaryCta.href}
            variant="ghost"
            rounded="lg"
            size="md"
            className="uppercase tracking-widest"
          >
            {content.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;