import { BadgeCheck } from 'lucide-react';
import StarRating from '../common/StarRating.jsx';

/**
 * Single review card used inside ReviewsSection.
 */
function ReviewCard({ review }) {
  const { reviewer, title, rating, date, body, verified } = review;

  // Generate initials avatar from reviewer name
  const initials = reviewer
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span className="font-label-md text-label-md text-on-tertiary-container font-bold">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-title-lg text-title-lg text-on-surface truncate">{reviewer}</span>
            {verified && (
              <span className="flex items-center gap-1 text-label-sm text-secondary font-semibold">
                <BadgeCheck className="w-4 h-4" /> Verified Purchase
              </span>
            )}
          </div>
          <span className="text-label-sm text-on-surface-variant">{date}</span>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={rating} />

      {/* Title */}
      <h4 className="font-title-lg text-title-lg text-on-surface">{title}</h4>

      {/* Body */}
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{body}</p>
    </article>
  );
}

/**
 * Reviews tab panel — renders a responsive grid of ReviewCard components.
 */
function ReviewsSection({ reviews }) {
  return (
    <div
      id="tabpanel-reviews"
      role="tabpanel"
      aria-labelledby="tab-reviews"
      className="py-12"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-8">
          Reader Reviews
          <span className="ml-3 text-on-surface-variant font-body-md text-body-md font-normal">
            ({reviews.length} reviews)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;
