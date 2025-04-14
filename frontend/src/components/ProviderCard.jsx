import React, { useState } from "react";

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
    </div>
  );
};

export default ProviderCard;

// This component is responsible for displaying the details of a single service provider.
// It takes in a prop called `provider`, which is an object containing the provider's details.