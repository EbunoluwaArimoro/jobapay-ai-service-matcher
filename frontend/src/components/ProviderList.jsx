import React from "react";
import ProviderCard from "./ProviderCard";

const ProviderList = ({ providers }) => {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="grid gap-4 mt-6 w-full max-w-5xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
};

export default ProviderList;
