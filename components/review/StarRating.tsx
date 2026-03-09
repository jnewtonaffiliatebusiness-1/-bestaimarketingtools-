"use client";

interface Props {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({ rating, max = 5, size = "md", showValue = true }: Props) {
  const sizeClass = { sm: "text-sm", md: "text-xl", lg: "text-3xl" }[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${sizeClass}`}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <span key={i} className="relative inline-block">
              <span className="text-gray-600">★</span>
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden text-amber-400"
                  style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
                >
                  ★
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="font-semibold text-white">
          {rating.toFixed(1)}<span className="text-gray-400">/{max}</span>
        </span>
      )}
    </div>
  );
}
