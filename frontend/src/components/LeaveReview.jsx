import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LeaveReview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { providerName, service} = state || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Simulate save
    setTimeout(() => {
      navigate("/review/thanks");
    }, 1000);
  };

  if (!providerName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div className="text-[#1C3458]">
          <p className="mb-4">No review target found. Please book a service first.</p>
          <button
            className="bg-[#00ABE4] text-white py-2 px-4 rounded-md"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFDFE] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-2xl p-6 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1C3458]">
            How was your experience with {providerName}?
          </h2>
          <p className="text-sm text-[#949EAE] mt-1">
            Service: {service}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRating(val)}
              className={`text-2xl ${
                rating >= val ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Write a short review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full border border-[#D9E2EC] p-3 rounded-md h-28 resize-none"
        />

        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-[#00ABE4] text-white py-3 rounded-md hover:bg-[#007fa1] transition"
        >
          {submitted ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
