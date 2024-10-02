import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Homepage/Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

const center = {
  lat: -33.865143,
  lng: 151.2099,
};

const FootpathAssessmentPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [assessmentText, setAssessmentText] = useState("");
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editAssessmentId, setEditAssessmentId] = useState(null);
  const [showAssessments, setShowAssessments] = useState(false);
  
  const token = Cookies.get("authToken");
  const apiKey = import.meta.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY; // Ensure this is set in your environment variables
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);

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

  const fetchFootpathAssessments = async (locationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}assessments/footpathAssessments/location/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssessments(response.data); 
    } catch (error) {
      console.error("Error fetching footpath assessments:", error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowAssessments(false);
    fetchFootpathAssessments(location.id);
  };

  const handleAssessmentInputChange = (e) => {
    setAssessmentText(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToGemini = async (file) => {
    const uploadResult = await fileManager.uploadFile(file.path, {
      mimeType: file.type,
      displayName: file.name,
    });
    const uploadedFile = uploadResult.file;
    return uploadedFile; // This will contain the file info, including the URL
  };

  const handleAssessmentSubmit = async () => {
    try {
      let fileUrl = null;

      // Upload image to Gemini if a file is selected
      if (file) {
        const uploadedFile = await uploadToGemini(file);
        fileUrl = uploadedFile.uri; // Assuming the file contains the URI
      }

      const payload = {
        locationId: selectedLocation.id,
        feedback: assessmentText,
        imageUrl: fileUrl, // Include image URL in the payload
      };

      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_APP_URL}footpathAssessments/${editAssessmentId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_APP_URL}footpathAssessments`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      // Reset form
      setAssessmentText("");
      setFile(null);
      setEditAssessmentId(null);
      setIsEditing(false);
      fetchFootpathAssessments(selectedLocation.id);
    } catch (error) {
      console.error("Error submitting footpath assessment:", error);
    }
  };

  const handleEditAssessment = (assessment) => {
    setIsEditing(true);
    setEditAssessmentId(assessment.id);
    setAssessmentText(assessment.feedback);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_URL}footpathAssessments/${assessmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFootpathAssessments(selectedLocation.id);
    } catch (error) {
      console.error("Error deleting footpath assessment:", error);
    }
  };

  const handleCloseAssessments = () => {
    setShowAssessments(false);
    setAssessmentText("");
    setFile(null);
    setEditAssessmentId(null);
    setIsEditing(false);
    setAssessments([]);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 relative">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                onClick={() => handleLocationClick(location)}
                icon="src/assets/mapicon.png"
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
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
                  <button
                    onClick={() => setShowAssessments(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    See Footpath Assessments
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {showAssessments && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-md shadow-md max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Footpath Assessments for {selectedLocation.name}</h2>

              <button
                onClick={handleCloseAssessments}
                className="bg-red-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-600 transition-colors"
              >
                Close Assessments
              </button>

              <textarea
                value={assessmentText}
                onChange={handleAssessmentInputChange}
                className="border p-2 rounded w-full"
                rows={4}
                placeholder="Write your assessment here..."
              />

              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded w-full mb-4"
              />

              <button
                onClick={handleAssessmentSubmit}
                className="bg-cyan-500 text-white px-4 py-2 rounded mb-4"
              >
                {isEditing ? "Update Assessment" : "Submit Assessment"}
              </button>

              <h3 className="text-lg font-bold">Existing Assessments:</h3>
              <ul>
                {assessments.map((assessment) => (
                  <li key={assessment.id} className="border-b py-2">
                    <div>
                      <p>{assessment.feedback}</p>
                      {assessment.imageUrl && (
                        <img src={assessment.imageUrl} alt="Assessment" className="w-24 h-24 object-cover" />
                      )}
                      <button
                        onClick={() => handleEditAssessment(assessment)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="text-red-500 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FootpathAssessmentPage;
