import { Star } from 'lucide-react';

export default function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex gap-1">
      {[...Array(10)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isHalf = starValue - 0.5 === rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readonly && onRatingChange(starValue)}
            onMouseEnter={(e) => {
              if (!readonly) {
                // Show preview on hover
                e.currentTarget.parentElement.querySelectorAll('svg').forEach((svg, i) => {
                  if (i < starValue) {
                    svg.classList.add('fill-yellow-400', 'text-yellow-400');
                  } else {
                    svg.classList.remove('fill-yellow-400', 'text-yellow-400');
                  }
                });
              }
            }}
            onMouseLeave={(e) => {
              if (!readonly) {
                // Restore actual rating
                e.currentTarget.parentElement.querySelectorAll('svg').forEach((svg, i) => {
                  if (i < rating) {
                    svg.classList.add('fill-yellow-400', 'text-yellow-400');
                  } else {
                    svg.classList.remove('fill-yellow-400', 'text-yellow-400');
                  }
                });
              }
            }}
            className={`transition-transform ${!readonly && 'hover:scale-110'}`}
            disabled={readonly}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-600 hover:text-yellow-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
