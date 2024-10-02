import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Homepage/Navbar";
import VoiceReview from "./Voicereview";
import { Star, Edit, X } from 'lucide-react';
import Mapicon from '../../assets/mapicon.png';
const center = {
  lat: -33.865143,
  lng: 151.2099,
};

const Reviewpage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  const token = Cookies.get("authToken");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}maps/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchReviews = async (locationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}opinions/locations/${locationId}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    fetchReviews(location.id);
    setReviewText("");
    setRating(1);
    setIsEditing(false);
    setEditReviewId(null);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const location = locations.find(
      (loc) => loc.latitude === lat && loc.longitude === lng
    );

    if (location) {
      handleLocationClick(location);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      setRating(parseFloat(value) || 1);
    } else {
      setReviewText(value);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      alert("Please enter a review before submitting.");
      return;
    }

    try {
      const payload = {
        locationId: selectedLocation.id,
        reviewText,
        rating: parseInt(rating, 10),
      };
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_APP_URL}opinions/reviews/${editReviewId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_APP_URL}opinions/reviews/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setReviewText("");
      setRating(1);
      setEditReviewId(null);
      setIsEditing(false);
      fetchReviews(selectedLocation.id);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleEdit = (review) => {
    setIsEditing(true);
    setEditReviewId(review.id);
    setReviewText(review.reviewText);
    setRating(review.rating);
  };


  // ... (keep other functions like handleInputChange, handleReviewSubmit, handleEdit)

  return (
    <div className="min-h-screen bg-cyan-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-cyan-700">Location Reviews</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={center}
                zoom={12}
                onClick={handleMapClick}
              >
                {locations.map((location) => (
                  <Marker
                    key={location.id}
                    position={{ lat: location.latitude, lng: location.longitude }}
                    onClick={() => handleMapClick({ latLng: { lat: () => location.latitude, lng: () => location.longitude } })}
                    icon={Mapicon}
                  />
                ))}
                {selectedLocation && (
                  <InfoWindow
                    position={{
                      lat: selectedLocation.latitude,
                      lng: selectedLocation.longitude,
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-bold text-lg mb-2 text-cyan-700">{selectedLocation.name}</h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Type:</span> {selectedLocation.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Safety:</span> {selectedLocation.safety}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Cost of Living:</span> {selectedLocation.costOfLiving}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>
         <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow-md p-6 h-[600px] overflow-y-auto">
              {selectedLocation ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-cyan-600">
                    Reviews for {selectedLocation.name}
                  </h2>
                  <div className="mb-4 space-y-3">
                    <textarea
                      value={reviewText}
                      onChange={handleInputChange}
                      placeholder="Write your review here..."
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-cyan-500"
                      rows={4}
                    />
                    <VoiceReview
                      locationId={selectedLocation.id}
                      onTranscript={(transcript) => setReviewText(transcript)}
                    />
                    <div className="flex items-center">
                      <label htmlFor="rating" className="mr-2 text-gray-700">Rating:</label>
                      <input
                        id="rating"
                        name="rating"
                        type="number"
                        value={rating}
                        onChange={handleInputChange}
                        min={1}
                        max={5}
                        className="w-16 px-2 py-1 text-gray-700 border rounded focus:outline-none focus:border-cyan-500"
                      />
                      <div className="ml-2 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            fill={star <= rating ? "#4F46E5" : "none"}
                            stroke={star <= rating ? "#4F46E5" : "#9CA3AF"}
                            className="cursor-pointer"
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleReviewSubmit}
                      className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition duration-300"
                    >
                      {isEditing ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-600">Existing Reviews</h3>
                    {reviews.length > 0 ? (
                      <ul className="space-y-4">
                        {reviews.map((review) => (
                          <li key={review.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <p className="text-gray-800 mb-2">{review.reviewText}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-1">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    fill={star <= review.rating ? "#4F46E5" : "none"}
                                    stroke={star <= review.rating ? "#4F46E5" : "#9CA3AF"}
                                  />
                                ))}
                              </div>
                              <button
                                onClick={() => handleEdit(review)}
                                className="text-cyan-600 hover:text-cyan-800"
                              >
                                <Edit size={18} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-center">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600">Select a location on the map to view and add reviews.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviewpage;