import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X, Save, MapPin, Thermometer, Shield, Camera, BarChart2, DollarSign } from "lucide-react";

const EditSidebar = ({ location, onClose }) => {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    latitude: location?.latitude || "",
    longitude: location?.longitude || "",
    type: location?.type || "",
    pollution: location?.pollution || 0,
    safety: location?.safety || 0,
    touristAttraction: location?.touristAttraction || false,
    crimeRate: location?.crimeRate || 0.0,
    costOfLiving: location?.costOfLiving || "",
  });
  const token = Cookies.get("authToken");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = ["pollution", "safety", "crimeRate"].includes(name)
      ? parseFloat(value) || 0
      : type === "checkbox"
      ? checked
      : value;

    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_URL}maps/locations/${location.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Location updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating location:", err);
      alert("Failed to update location. Please try again.");
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Location</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location Name</label>
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <MapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              className="bg-transparent w-full focus:outline-none"
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              className="w-full rounded-md border-gray-300 bg-gray-100 p-2"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              className="w-full rounded-md border-gray-300 bg-gray-100 p-2"
              readOnly
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Type of Location</label>
          <div className="relative">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="">Select Type</option>
              <option value="neighborhood">Neighborhood</option>
              <option value="park">Park</option>
              <option value="footpath">Footpath</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Thermometer className="text-red-500 mr-2" />
              Pollution Level (0-100)
            </div>
          </label>
          <input
            type="range"
            name="pollution"
            value={formData.pollution}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max="100"
          />
          <span className="text-sm text-gray-500">{formData.pollution}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Shield className="text-green-500 mr-2" />
              Safety Rating (0-100)
            </div>
          </label>
          <input
            type="range"
            name="safety"
            value={formData.safety}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max="100"
          />
          <span className="text-sm text-gray-500">{formData.safety}</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="touristAttraction"
            checked={formData.touristAttraction}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Camera className="text-yellow-500 mr-2" />
            Tourist Attraction
          </label>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <BarChart2 className="text-purple-500 mr-2" />
              Crime Rate (per 1000 people)
            </div>
          </label>
          <input
            type="number"
            step="0.01"
            name="crimeRate"
            value={formData.crimeRate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <DollarSign className="text-green-500 mr-2" />
              Cost of Living
            </div>
          </label>
          <div className="relative">
            <select
              name="costOfLiving"
              value={formData.costOfLiving}
              onChange={handleInputChange}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="">Select Cost of Living</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          <Save className="h-5 w-5 mr-2" /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSidebar;