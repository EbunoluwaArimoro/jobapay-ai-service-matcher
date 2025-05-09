import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BookingForm() {
  const { providerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const provider = state?.provider;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    address: ""
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!provider) {
      alert("Missing provider data. Please go back and search again.");
      navigate("/");
    }
  }, [provider, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate processing
    setTimeout(() => {
        navigate("/confirmation", {
          state: {
            providerName: provider.name,
            userName: formData.name,
            service: provider.service,
            date: formData.date,
            time: formData.time,
          },
        });
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FBFDFE] flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-md rounded-2xl px-6 py-8 space-y-6"
      >
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-[#1C3458]">
            Booking with {provider?.name}
          </h2>
          <p className="text-sm text-[#949EAE] mt-1">
            {provider?.service} · {provider?.location}
          </p>
        </div>

        {/* Booking Form */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-[#D9E2EC] rounded-md w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="p-3 border border-[#D9E2EC] rounded-md w-full"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-3 border border-[#D9E2EC] rounded-md w-full"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="p-3 border border-[#D9E2EC] rounded-md w-full"
          />
        </div>

        <textarea
          name="address"
          placeholder="Where should the provider come?"
          value={formData.address}
          onChange={handleChange}
          required
          className="p-3 border border-[#D9E2EC] rounded-md w-full h-24 resize-none"
        />

        {/* Summary Block */}
        <div className="bg-[#EDF4FC] border border-[#D9E2EC] rounded-xl p-4 text-sm text-[#1C3458]">
          <p className="font-medium mb-2">Booking Summary:</p>
          <ul className="space-y-1">
            <li><strong>Provider:</strong> {provider?.name}</li>
            <li><strong>Service:</strong> {provider?.service}</li>
            <li><strong>Location:</strong> {provider?.location}</li>
            <li><strong>Preferred Time:</strong> {formData.date} at {formData.time}</li>
            <li><strong>Address:</strong> {formData.address}</li>
          </ul>
        </div>

        {/* Reviews */}
        <div className="bg-[#F2F2F2] border border-[#E0E0E0] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#1C3458] mb-2">What others said:</p>
          <ul className="space-y-2 text-sm text-[#5e5e5e]">
            {provider?.reviews?.slice(0, 2).map((r, i) => (
              <li key={i}>
                ⭐ {r.rating}/5 — {r.comment}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#00ABE4] text-white py-3 rounded-md hover:bg-[#007fa1] transition"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
