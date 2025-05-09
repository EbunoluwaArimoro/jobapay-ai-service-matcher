import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  const [showReviews, setShowReviews] = useState(false);

  const ratings = provider.reviews?.map(r => r.rating) || [];
  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1)
    : "No rating";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <h3 className="font-semibold text-lg text-[#1C3458] mb-1">{provider.name}</h3>
      <p className="text-sm text-gray-600">Service: {provider.service}</p>
      <p className="text-sm text-gray-500">Location: {provider.location}</p>

      <div className="mt-3">
        <button
          className="text-sm text-[#095b76] hover:underline"
          onClick={() => setShowReviews(!showReviews)}
        >
          ⭐ {avgRating}/5 {showReviews ? "(Hide Reviews)" : "(See Reviews)"}
        </button>

        {showReviews && (
          <div className="mt-2 space-y-2">
            {provider.reviews?.map((review, i) => (
              <div
                key={i}
                className="text-sm text-gray-600 border-l-4 border-blue-200 pl-2"
              >
                <span className="font-medium">⭐ {review.rating}/5</span> – {review.comment}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to={`/book/${provider.id}`}
      state={{ provider }}
      >
        <button className="mt-4 w-full bg-[#00ABE4] text-white px-4 py-2 rounded-md hover:bg-[#007fa1] transition">
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default ProviderCard;
