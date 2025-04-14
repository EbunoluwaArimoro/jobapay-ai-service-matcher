import React from "react";
import ProviderCard from "./ProviderCard";

const ProviderList = ({ providers }) => {
  if (!providers || providers.length === 0) {
    return null;
  }    

  return (
    <div className="grid gap-4 mt-6 w-full max-w-5xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
};

export default ProviderList;
// This component is responsible for displaying the list of service providers. 
// It takes in a prop called `providers`, which is an array of provider objects. 
// If the array is empty, it displays a message indicating that no matches were found. 
// Otherwise, it maps over the array and renders a `ProviderCard` component for each provider. 
// The `ProviderCard` component is responsible for displaying the details of each individual provider.
