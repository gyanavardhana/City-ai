import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const MetricCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-4 w-4 text-gray-400" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? '+' : ''}{change}%
    </p>
  </div>
);

const Barchart = ({ reviews, locations, users, images }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!reviews || !locations || reviews.length === 0 || locations.length === 0) {
      console.error("Missing or empty reviews or locations data");
      return;
    }

    const avgRatings = locations.map(location => {
      const locReviews = reviews.filter(r => r.locationId === location.id);
      const avgRating = locReviews.length > 0 ? 
        locReviews.reduce((sum, r) => sum + r.rating, 0) / locReviews.length : 0;
      return { ...location, avgRating };
    });

    setChartData(avgRatings);
  }, [reviews, locations]);

  const getUserName = (userId) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getImageUrl = (locationId) => {
    const image = images?.find(img => img.locationId === locationId);
    return image ? image.imageURL : '/api/placeholder/100/100';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Reviews" value={reviews?.length || 0} change={2.5} icon={() => <span>📊</span>} />
          <MetricCard title="Locations" value={locations?.length || 0} change={-0.7} icon={() => <span>📍</span>} />
          <MetricCard title="Users" value={users?.length || 0} change={1.2} icon={() => <span>👥</span>} />
          <MetricCard title="Images" value={images?.length || 0} change={3.1} icon={() => <span>🖼️</span>} />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Average Ratings by Location</h2>
        <div style={{ width: '100%', height: windowWidth > 600 ? '400px' : '300px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#8884d8" onClick={(data) => setSelectedLocation(data)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedLocation && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">{selectedLocation.name} Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2"><span className="font-semibold">Latitude:</span> {selectedLocation.latitude}</p>
              <p className="mb-2"><span className="font-semibold">Longitude:</span> {selectedLocation.longitude}</p>
              <p className="mb-2"><span className="font-semibold">Pollution Index:</span> {selectedLocation.pollution}</p>
              <p className="mb-2"><span className="font-semibold">Safety Index:</span> {selectedLocation.safety}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recent Reviews:</h4>
              <ul className="list-disc pl-5">
                {reviews
                  ?.filter(r => r.locationId === selectedLocation.id)
                  .slice(0, 2)
                  .map((review) => (
                    <li key={review.id} className="text-sm mb-2">
                      "{review.reviewText}" - {getUserName(review.userId)}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Image:</h4>
            <img 
              src={getImageUrl(selectedLocation.id)}
              alt={selectedLocation.name}
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Barchart;