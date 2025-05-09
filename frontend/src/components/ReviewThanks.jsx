import { useNavigate } from "react-router-dom";

export default function ReviewThanks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDF4FC] p-6">
      <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#1C3458] mb-4">Thank You!</h2>
        <p className="text-[#5e5e5e] mb-4">
          Your review has been received. <br />
          Your feedback helps others book with confidence and helps Jobapay AI match smarter.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#00ABE4] text-white px-4 py-2 rounded-md hover:bg-[#007fa1]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
