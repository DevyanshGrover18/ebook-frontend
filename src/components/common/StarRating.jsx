import { Star, StarHalf } from 'lucide-react';

/**
 * Renders a 5-star rating from a single numeric `rating` prop (e.g. 4.5),
 * rounding to the nearest half star, plus the numeric label used on book cards.
 */
function StarRating({ rating, max = 5 }) {
  const stars = Array.from({ length: max }, (_, index) => {
    const starValue = index + 1;
    let fill = 0;
    if (rating >= starValue) fill = 1;
    else if (rating >= starValue - 0.5) fill = 0.5;
    return fill;
  });

  return (
    <div className="flex items-center gap-1">
      {stars.map((fill, index) => {
        if (fill === 1) {
          return (
            <Star
              key={index}
              className="w-4 h-4 fill-secondary text-secondary"
            />
          );
        } else if (fill === 0.5) {
          return (
            <StarHalf
              key={index}
              className="w-4 h-4 fill-secondary text-secondary"
            />
          );
        } else {
          return (
            <Star
              key={index}
              className="w-4 h-4 text-outline"
            />
          );
        }
      })}
      <span className="text-label-sm text-outline ml-1">({rating.toFixed(1)})</span>
    </div>
  );
}

export default StarRating;