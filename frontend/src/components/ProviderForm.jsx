import React, { useState } from "react";

const ProviderForm = ({ onSearch, onReset, services, locations }) => {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !service) return;
    onSearch({ location, service });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
      <input
        list="location-list"
        type="text"
        placeholder="Enter your location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ABE4] focus:border-transparent"
      />
      <datalist id="location-list">
        {locations.map((loc, index) => (
          <option key={index} value={loc} />
        ))}
      </datalist>
      <input
        type="text"
        placeholder="Service Needed (e.g., plumber)"
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ABE4] focus:border-transparent"
      />
      
      <button
        type="submit"
        className="w-full bg-[#00ABE4] text-white font-medium p-3 rounded-lg hover:bg-[#0497cc] transition-all duration-200"
      >
        Search
      </button>
      <button
        type="button"
        onClick={onReset}
        className="w-full text-[#1C3458] mt-2 p-2 border border-[#00ABE4] rounded-lg hover:bg-[#f2f2f2] transition-all">
        Reset Search
      </button>
    </form>
  );
};

export default ProviderForm;
// This component is responsible for the form that allows users to search for service providers.
// It uses the `useState` hook to manage the state of the location and service inputs.
// When the form is submitted, it calls the `onSearch` function passed as a prop with the current values of location and service.