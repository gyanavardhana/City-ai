import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const SearchBar = ({ setSearchResult, apiKey }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
      const response = await axios.get(geocodeUrl);

      if (response.data.status === "OK" && response.data.results[0]) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setSearchResult({ lat, lng, name: response.data.results[0].formatted_address });
      } else {
        setError("Location not found. Please try a different search term.");
      }
    } catch (error) {
      setError("An error occurred while searching. Please try again.");
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64 px-4 py-2 rounded-full border"
      />
      <button onClick={handleSearch} className="absolute right-0 top-0 mt-2 mr-3">
        <Search className="h-5 w-5" />
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchBar;
