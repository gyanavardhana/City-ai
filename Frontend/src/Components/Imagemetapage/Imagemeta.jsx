import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Navbar from "../Homepage/Navbar";
import ImageUpload from "./ImageUpload";
import { Edit, Eye, X } from 'lucide-react';
import Mapicon from '../../assets/mapicon.png';
const Imagemeta = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imageMetadata, setImageMetadata] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editImageId, setEditImageId] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const token = Cookies.get("authToken");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}maps/locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations(response.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchImageMetadata = async (locationId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}images/image-metadata/${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageMetadata(response.data.imageMetadata);
    } catch (error) {
      console.error("Error fetching image metadata:", error);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const location = locations.find(
      (loc) => loc.latitude === lat && loc.longitude === lng
    );

    if (location) {
      setSelectedLocation(location);
      setImageMetadata([]);
      setImageURL("");
      setDescription("");
      setLabels([]);
      setIsEditing(false);
      fetchImageMetadata(location.id);
    } else {
      alert("No location found at this point.");
    }
  };

  const handleImageSubmit = async (fileData) => {
    const { fileUrl, result } = fileData;

    if (!selectedLocation) {
      alert("Please select a location on the map.");
      return;
    }

    setImageURL(fileUrl);
    setLabels(result.split("\n").map((label) => label.trim()));
    setDescription("");
  };

  const handleFinalSubmit = async () => {
    if (!selectedLocation || !imageURL || !description || labels.length === 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const payload = {
        locationId: selectedLocation.id,
        imageURL,
        description,
        labels,
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_APP_URL}images/image-metadata/${editImageId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_URL}images/image-metadata/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setImageURL("");
      setDescription("");
      setLabels([]);
      setEditImageId(null);
      setIsEditing(false);
      fetchImageMetadata(selectedLocation.id);
    } catch (error) {
      console.error("Error submitting image metadata:", error);
    }
  };

  const handleEdit = (image) => {
    setIsEditing(true);
    setEditImageId(image.id);
    setImageURL(image.imageURL);
    setDescription(image.description);
    setLabels(image.labels);
  };

  return (
    <div className="min-h-screen bg-cyan-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-cyan-700">Image Metadata Management</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "600px" }}
                center={{ lat: -33.865143, lng: 151.2099 }}
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
              </GoogleMap>
            </div>
          </div>
          
          {/* Scrollable Sidebar */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow-md p-6 max-h-[600px] overflow-y-auto">
              {selectedLocation ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-cyan-600">
                    Manage Images for {selectedLocation.name}
                  </h2>
                  <ImageUpload onUploadSuccess={handleImageSubmit} />
                  <div className="mb-4 space-y-3">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-cyan-500"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={labels.join(", ")}
                      onChange={(e) => setLabels(e.target.value.split(",").map((label) => label.trim()))}
                      placeholder="Labels (comma separated)"
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleFinalSubmit}
                      className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition duration-300"
                    >
                      {isEditing ? "Update Image" : "Upload Image"}
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-600">Uploaded Images</h3>
                    <ul className="space-y-4">
                      {imageMetadata.map((image) => (
                        <li key={image.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{image.description}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Labels: {image.labels.join(", ")}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(image)}
                                className="text-cyan-600 hover:text-cyan-800"
                                title="Edit"
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => {
                                  setImageURL(image.imageURL);
                                  setShowImagePreview(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                                title="View"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600">Select a location on the map to manage images.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowImagePreview(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <img src={imageURL} alt="Preview" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
export default Imagemeta;