import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapWithImages = ({ locations, reviews, images }) => {
  const [activeLocation, setActiveLocation] = useState(null);

  const getAverageRating = (locationId) => {
    const locationReviews = reviews.filter(r => r.locationId === locationId);
    const sum = locationReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / locationReviews.length).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-600">
        <h2 className="text-2xl font-bold text-center text-white">Interactive City Explorer</h2>
      </div>
      <div className="p-0">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} className="h-[500px] w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker 
              key={location.id} 
              position={[location.latitude, location.longitude]} 
              icon={customIcon}
              eventHandlers={{
                click: () => setActiveLocation(location),
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="text-lg font-bold mb-2">{location.name}</h3>
                  <img 
                    src={images.find(img => img.locationId === location.id)?.imageURL} 
                    alt={location.name} 
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {getAverageRating(location.id)}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Pollution: {location.pollution}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Safety: {location.safety}
                    </span>
                  </div>
                  <p className="text-sm italic">
                    "{reviews.find(r => r.locationId === location.id)?.reviewText}"
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {activeLocation && (
        <div className="p-4 bg-gray-100">
          <h3 className="text-xl font-bold mb-2">{activeLocation.name} Details</h3>
          <p className="mb-1"><strong>Latitude:</strong> {activeLocation.latitude}</p>
          <p className="mb-1"><strong>Longitude:</strong> {activeLocation.longitude}</p>
          <p className="mb-1"><strong>Pollution Index:</strong> {activeLocation.pollution}</p>
          <p className="mb-1"><strong>Safety Index:</strong> {activeLocation.safety}</p>
          <p className="mt-2"><strong>Reviews:</strong></p>
          <ul className="list-disc pl-5">
            {reviews
              .filter(r => r.locationId === activeLocation.id)
              .map((review, index) => (
                <li key={index} className="text-sm">{review.reviewText}</li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapWithImages;