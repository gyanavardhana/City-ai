import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { Search, MapPin, X } from "lucide-react";
import Sidebar from "./Sidebar";
import EditSidebar from "./Editsidebar";
import Cookies from "js-cookie";
import Navbar from "../Homepage/Navbar";
import Mapicon from '../../assets/mapicon.png';

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

const center = {
  lat: -33.865143,
  lng: 151.2099,
};

const LocationMapPage = () => { // Corrected the component name to PascalCase
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState(center);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);

  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  const fetchLocationDetails = useCallback(
    (lat, lng) => {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

      axios
        .get(geocodeUrl)
        .then((response) => {
          if (response.data.status === "OK" && response.data.results[0]) {
            const locationName = response.data.results[0].formatted_address;
            setSelectedLocation({
              name: locationName || `Location @ [${lat}, ${lng}]`,
              latitude: lat,
              longitude: lng,
            });
            setSidebarOpen(true);
          } else {
            setSelectedLocation({
              name: `Location @ [${lat}, ${lng}]`,
              latitude: lat,
              longitude: lng,
            });
            setSidebarOpen(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching geocode data: ", error);
          setSelectedLocation({
            name: `Location @ [${lat}, ${lng}]`,
            latitude: lat,
            longitude: lng,
          });
          setSidebarOpen(true);
        });
    },
    [apiKey]
  );

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const token = Cookies.get("authToken");
  const fetchSavedLocations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}maps/locations/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching saved locations:", error);
      setError("Failed to load saved locations.");
    }
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    fetchLocationDetails(lat, lng);
  }, [fetchLocationDetails]);

  const handleSearch = useCallback(() => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}`;

    axios
      .get(geocodeUrl)
      .then((response) => {
        if (response.data.status === "OK" && response.data.results[0]) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setSearchResult({ lat, lng });
          setMapCenter({ lat, lng });
          setMapZoom(15); // Zoom in to the searched location
          fetchLocationDetails(lat, lng);
        } else {
          setError("Location not found. Please try a different search term.");
        }
      })
      .catch((error) => {
        console.error("Error fetching geocode data: ", error);
        setError("An error occurred while searching. Please try again.");
      });
  }, [searchQuery, apiKey, fetchLocationDetails]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
    setSelectedLocation(null);
  }, []);

  const handleSavedLocationClick = useCallback((location) => {
    setActiveInfoWindow(location);
  }, []);

  const handleEditLocation = useCallback((location) => {
    setLocationToEdit(location);
    setEditSidebarOpen(true);
    setActiveInfoWindow(null);
  }, []);

  const handleCloseEditSidebar = useCallback(() => {
    setEditSidebarOpen(false);
    setLocationToEdit(null);
    fetchSavedLocations();
  }, [fetchSavedLocations]);

  return (
    <div className="flex flex-col h-screen bg-cyan-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content (Map and Search) */}
        <div className="w-full lg:w-3/5 flex flex-col relative p-4">
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="ml-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </button>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {error && (
              <div className="absolute top-4 right-4 p-4 bg-red-500 text-white rounded-lg shadow-md">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-white hover:text-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker
                  position={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  icon={{
                    path: MapPin,
                    fillColor: "#ef4444",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#ef4444",
                    scale: 0.075,
                  }}
                />
              )}

              {savedLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  onClick={() => handleSavedLocationClick(location)}
                  icon={Mapicon}
                />
              ))}

              {activeInfoWindow && (
                <InfoWindow
                  position={{
                    lat: activeInfoWindow.latitude,
                    lng: activeInfoWindow.longitude,
                  }}
                  onCloseClick={() => setActiveInfoWindow(null)}
                >
                  <div className="p-4">
                    <h3 className="font-bold">{activeInfoWindow.name}</h3>
                    <p className="mb-1">
                      <span className="font-semibold">Type:</span>{" "}
                      {activeInfoWindow.type}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Safety:</span>{" "}
                      {activeInfoWindow.safety}
                    </p>
                    <p className="mb-3">
                      <span className="font-semibold">Cost of Living:</span>{" "}
                      {activeInfoWindow.costOfLiving}
                    </p>
                    <button
                      onClick={() => handleEditLocation(activeInfoWindow)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Sidebar (Saved Locations and Edit Panel) */}
        {(sidebarOpen || editSidebarOpen) && (
          <div className="w-full lg:w-2/5 bg-cyan-100 shadow-lg p-4 overflow-y-auto">
            {sidebarOpen && selectedLocation ? (
              <Sidebar location={selectedLocation} onClose={handleCloseSidebar} />
            ) : editSidebarOpen && locationToEdit ? (
              <EditSidebar location={locationToEdit} onClose={handleCloseEditSidebar} />
            ) : (
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold mb-4">Saved Locations</h2>
                <ul>
                  {savedLocations.map((location) => (
                    <li
                      key={location.id}
                      className="mb-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSavedLocationClick(location)}
                    >
                      {location.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMapPage;
