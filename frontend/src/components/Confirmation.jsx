import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { providerName, userName, service, date, time } = state || {};

  if (!providerName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div className="text-[#1C3458]">
          <p className="mb-4">Missing booking data.</p>
          <button
            className="bg-[#00ABE4] text-white py-2 px-4 rounded-md"
            onClick={() => navigate("/")}
          >
            Go Back to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDF4FC] p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold text-[#1C3458] mb-4">
          Booking Confirmed 🎉
        </h2>
        <p className="text-[#5e5e5e] mb-4">
          Thank you <strong>{userName}</strong>!
          <br />
          Your booking with <strong>{providerName}</strong> for <strong>{service}</strong> is confirmed.
        </p>
        <p className="text-sm text-[#949EAE]">
          Date: {date} <br /> Time: {time}
        </p>
        <Link
            to="/review"
            state={{
                providerName,
                service,
                
            }}
        >
            <button className="mt-6 bg-[#00ABE4] text-white px-4 py-2 rounded-md hover:bg-[#007fa1]">
                Leave a Review
            </button>
        </Link>
      </div>
    </div>
  );
}
