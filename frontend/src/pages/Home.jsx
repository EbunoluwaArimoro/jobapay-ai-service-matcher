import React, { useState } from "react";
import ProviderForm from "../components/ProviderForm";
import ProviderList from "../components/ProviderList";
import { providers as mockProviders } from "../data/providers";

export default function Home() {
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const allLocations = [...new Set(mockProviders.map((p) => p.location))];
  const [predictedCategory, setPredictedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const locationGroups = {
    ibadan: ["dugbe", "akobo", "iyana church", "challenge", "ring road", "mokola", "bodija"],
    lagos: ["lekki", "ajah", "ikorodu", "surulere", "magodo", "yaba", "ikeja"]
  };

  const normalizeLocation = (input) => {
    const lower = input.toLowerCase();
    if (locationGroups[lower]) {
      return locationGroups[lower]; // user typed "Ibadan" → return all subareas
    }
    return [lower]; // user typed "Dugbe" → return Dugbe only
  };

  const classifyService = async (userInput) => {
    try {
      const response = await fetch("https://jobapay-ai-service-matcher-backend.onrender.com/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      console.log("🔍 AI raw response:", data);
      return data.category || "";
    } catch (error) {
      console.error("❌ Classification error:", error);
      return "";
    }
  };

  const handleSearch = async ({ location, service }) => {
    setIsLoading(true);

    const predictedService = await classifyService(service);
    setPredictedCategory(predictedService);

    if (!predictedService || predictedService.length < 3) {
      setIsLoading(false);
      alert("AI couldn't identify the service. Try being more specific.");
      return;
    }

    const normalizedLocations = normalizeLocation(location);

    const results = mockProviders.filter(
      (provider) =>
        normalizedLocations.includes(provider.location.toLowerCase()) &&
        provider.service.toLowerCase().includes(predictedService.toLowerCase())
    );

    setFilteredProviders(results);
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleReset = () => {
    setFilteredProviders([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#EDF4FC] flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-[#1C3458] mb-8 text-center">
        Smart Service Provider Finder
      </h1>
      <ProviderForm
        onSearch={handleSearch}
        onReset={handleReset}
        locations={allLocations}
      />
      {hasSearched && predictedCategory && (
        <p className="text-gray-700 text-lg mt-4">
          Showing results for: <span className="font-semibold text-blue-500">{predictedCategory}</span>
        </p>
      )}

      {isLoading && (
        <p className="text-gray-500 text-center mt-4 animate-pulse">
          🔄 Searching, please wait...
        </p>
      )}

      <ProviderList providers={filteredProviders} />
      {hasSearched && filteredProviders.length === 0 && (
        <div className="mt-6 text-center text-gray-500">
          No matches found. Please try again.
        </div>
      )}
    </div>
  );
}
