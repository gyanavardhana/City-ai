import React from "react";

const SearchResultPrompt = ({ searchResult, setMapCenter, setSearchResult }) => {
  if (!searchResult) return null;

  return (
    <div className="absolute top-4 right-4 bg-white shadow-md p-4 rounded">
      <p className="text-gray-800">Found {searchResult.name}. Do you want to center the map here?</p>
      <button
        onClick={() => {
          setMapCenter({ lat: searchResult.lat, lng: searchResult.lng });
          setSearchResult(null);
        }}
        className="bg-cyan-500 text-white px-4 py-2 mt-2 rounded"
      >
        Yes, Center Map
      </button>
      <button
        onClick={() => setSearchResult(null)}
        className="bg-gray-500 text-white px-4 py-2 mt-2 rounded ml-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default SearchResultPrompt;
