const locations = [
  { id: 1, name: "New York", latitude: 40.7128, longitude: -74.0060, pollution: 3.2, safety: 4.5 },
  { id: 2, name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, pollution: 4.0, safety: 3.8 },
  { id: 3, name: "Chicago", latitude: 41.8781, longitude: -87.6298, pollution: 2.9, safety: 4.2 },
  { id: 4, name: "San Francisco", latitude: 37.7749, longitude: -122.4194, pollution: 3.5, safety: 4.0 },
  { id: 5, name: "Miami", latitude: 25.7617, longitude: -80.1918, pollution: 2.8, safety: 4.7 },
  { id: 6, name: "Dallas", latitude: 32.7767, longitude: -96.7970, pollution: 3.9, safety: 3.6 },
  { id: 7, name: "Seattle", latitude: 47.6062, longitude: -122.3321, pollution: 2.5, safety: 4.3 },
  { id: 8, name: "Austin", latitude: 30.2672, longitude: -97.7431, pollution: 2.2, safety: 4.8 },
  { id: 9, name: "Boston", latitude: 42.3601, longitude: -71.0589, pollution: 3.0, safety: 4.4 },
  { id: 10, name: "Las Vegas", latitude: 36.1699, longitude: -115.1398, pollution: 4.5, safety: 3.5 },
  { id: 11, name: "Denver", latitude: 39.7392, longitude: -104.9903, pollution: 2.7, safety: 4.6 },
  { id: 12, name: "Portland", latitude: 45.5155, longitude: -122.6793, pollution: 2.4, safety: 4.1 },
  { id: 13, name: "Phoenix", latitude: 33.4484, longitude: -112.0740, pollution: 4.1, safety: 3.3 },
  { id: 14, name: "Philadelphia", latitude: 39.9526, longitude: -75.1652, pollution: 3.8, safety: 3.9 },
  { id: 15, name: "Washington D.C.", latitude: 38.9072, longitude: -77.0369, pollution: 3.6, safety: 4.2 },
  { id: 16, name: "San Diego", latitude: 32.7157, longitude: -117.1611, pollution: 3.1, safety: 4.5 },
  { id: 17, name: "Houston", latitude: 29.7604, longitude: -95.3698, pollution: 4.3, safety: 3.7 },
  { id: 18, name: "Atlanta", latitude: 33.7490, longitude: -84.3880, pollution: 3.4, safety: 4.0 },
  { id: 19, name: "Orlando", latitude: 28.5383, longitude: -81.3792, pollution: 3.0, safety: 4.1 },
  { id: 20, name: "Nashville", latitude: 36.1627, longitude: -86.7816, pollution: 2.9, safety: 4.3 },
];



const reviews = [
  { id: 1, locationId: 1, userId: 1, rating: 4, reviewText: "Amazing city with lots to do!", createdAt: "2024-01-01" },
  { id: 2, locationId: 2, userId: 2, rating: 5, reviewText: "Absolutely loved my time here!", createdAt: "2024-02-01" },
  { id: 3, locationId: 3, userId: 1, rating: 3, reviewText: "Good vibes, but traffic is a nightmare.", createdAt: "2024-03-01" },
  { id: 4, locationId: 4, userId: 3, rating: 2, reviewText: "Beautiful views, but overcrowded.", createdAt: "2024-04-01" },
  { id: 5, locationId: 5, userId: 2, rating: 4, reviewText: "Lovely beaches and vibrant nightlife!", createdAt: "2024-05-01" },
  { id: 6, locationId: 6, userId: 4, rating: 3, reviewText: "Nice place, but it's too hot in summer.", createdAt: "2024-06-01" },
  { id: 7, locationId: 7, userId: 5, rating: 5, reviewText: "Great coffee shops and friendly people!", createdAt: "2024-07-01" },
  { id: 8, locationId: 8, userId: 1, rating: 4, reviewText: "The music scene here is fantastic!", createdAt: "2024-08-01" },
  { id: 9, locationId: 9, userId: 3, rating: 4, reviewText: "Historical landmarks are worth a visit.", createdAt: "2024-09-01" },
  { id: 10, locationId: 10, userId: 2, rating: 3, reviewText: "A fun place, but expensive!", createdAt: "2024-10-01" },
  { id: 11, locationId: 11, userId: 4, rating: 4, reviewText: "Great outdoor activities available!", createdAt: "2024-10-02" },
  { id: 12, locationId: 12, userId: 5, rating: 5, reviewText: "The food scene is incredible!", createdAt: "2024-10-03" },
  { id: 13, locationId: 13, userId: 1, rating: 2, reviewText: "Too hot, not my favorite city.", createdAt: "2024-10-04" },
  { id: 14, locationId: 14, userId: 3, rating: 3, reviewText: "Average city, nothing special.", createdAt: "2024-10-05" },
  { id: 15, locationId: 15, userId: 2, rating: 5, reviewText: "Beautiful city with rich history!", createdAt: "2024-10-06" },
  { id: 16, locationId: 16, userId: 4, rating: 4, reviewText: "Lovely weather and friendly locals.", createdAt: "2024-10-07" },
  { id: 17, locationId: 17, userId: 5, rating: 3, reviewText: "Good food but poor public transport.", createdAt: "2024-10-08" },
  { id: 18, locationId: 18, userId: 1, rating: 4, reviewText: "Vibrant culture and art scene!", createdAt: "2024-10-09" },
  { id: 19, locationId: 19, userId: 3, rating: 5, reviewText: "The theme parks are amazing!", createdAt: "2024-10-10" },
  { id: 20, locationId: 20, userId: 2, rating: 4, reviewText: "Great live music everywhere!", createdAt: "2024-10-11" },
];


const users = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "User" },
  { id: 3, name: "Charlie", role: "Moderator" },
  { id: 4, name: "David", role: "User" },
  { id: 5, name: "Eve", role: "User" },
  { id: 6, name: "Frank", role: "Admin" },
  { id: 7, name: "Grace", role: "Moderator" },
  { id: 8, name: "Heidi", role: "User" },
  { id: 9, name: "Ivan", role: "User" },
  { id: 10, name: "Judy", role: "Admin" },
];


const images = [
  { id: 1, locationId: 1, imageURL: "https://via.placeholder.com/200/FF5733/FFFFFF?text=NYC", labels: ["urban", "skyscrapers"] },
  { id: 2, locationId: 2, imageURL: "https://via.placeholder.com/200/33FF57/FFFFFF?text=LA", labels: ["beach", "sunny"] },
  { id: 3, locationId: 3, imageURL: "https://via.placeholder.com/200/3357FF/FFFFFF?text=Chicago", labels: ["cityscape", "lakefront"] },
  { id: 4, locationId: 4, imageURL: "https://via.placeholder.com/200/FF33A6/FFFFFF?text=SF", labels: ["bridge", "hills"] },
  { id: 5, locationId: 5, imageURL: "https://via.placeholder.com/200/33A6FF/FFFFFF?text=Miami", labels: ["beach", "palm trees"] },
  { id: 6, locationId: 6, imageURL: "https://via.placeholder.com/200/FFCC33/FFFFFF?text=Dallas", labels: ["city", "nightlife"] },
  { id: 7, locationId: 7, imageURL: "https://via.placeholder.com/200/FF33B5/FFFFFF?text=Seattle", labels: ["mountains", "coffee"] },
  { id: 8, locationId: 8, imageURL: "https://via.placeholder.com/200/33FFC1/FFFFFF?text=Austin", labels: ["music", "festivals"] },
  { id: 9, locationId: 9, imageURL: "https://via.placeholder.com/200/FF5733/FFFFFF?text=Boston", labels: ["history", "education"] },
  { id: 10, locationId: 10, imageURL: "https://via.placeholder.com/200/33FF8E/FFFFFF?text=Vegas", labels: ["nightlife", "entertainment"] },
  { id: 11, locationId: 11, imageURL: "https://via.placeholder.com/200/33B5FF/FFFFFF?text=Denver", labels: ["outdoors", "hiking"] },
  { id: 12, locationId: 12, imageURL: "https://via.placeholder.com/200/FF33A6/FFFFFF?text=Portland", labels: ["food", "nature"] },
  { id: 13, locationId: 13, imageURL: "https://via.placeholder.com/200/FF33D4/FFFFFF?text=Phoenix", labels: ["desert", "sun"] },
  { id: 14, locationId: 14, imageURL: "https://via.placeholder.com/200/FFB733/FFFFFF?text=Philadelphia", labels: ["history", "art"] },
  { id: 15, locationId: 15, imageURL: "https://via.placeholder.com/200/FFC133/FFFFFF?text=WDC", labels: ["monuments", "politics"] },
  { id: 16, locationId: 16, imageURL: "https://via.placeholder.com/200/FF5733/FFFFFF?text=San+Diego", labels: ["beach", "family"] },
  { id: 17, locationId: 17, imageURL: "https://via.placeholder.com/200/3A33FF/FFFFFF?text=Houston", labels: ["culture", "food"] },
  { id: 18, locationId: 18, imageURL: "https://via.placeholder.com/200/FF33AA/FFFFFF?text=Atlanta", labels: ["history", "music"] },
  { id: 19, locationId: 19, imageURL: "https://via.placeholder.com/200/FFC833/FFFFFF?text=Orlando", labels: ["theme parks", "family"] },
  { id: 20, locationId: 20, imageURL: "https://via.placeholder.com/200/3A33AA/FFFFFF?text=Nashville", labels: ["music", "nightlife"] },
];

export { locations, reviews, users, images };