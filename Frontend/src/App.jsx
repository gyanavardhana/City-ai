import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import Homepage from "./Components/Homepage/Homepage";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Locationmappage from "./Components/Locationmappage/Locationmappage";
import Reviewpage from "./Components/Reviewpage/Reviewpage";
import { LoadScript } from "@react-google-maps/api";
import Imagemeta from "./Components/Imagemetapage/Imagemeta";
import X from "./Components/x";
import Dashboard from "./Components/Admindashboardpage/Admindashboard";
import Chatbot from "./Components/AI-Integrationpage/Chatbot";
import { locations, reviews, users, images } from "./utils/api";

export default function App() {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/location-map" element={<Locationmappage />} />
          <Route path="/reviews" element={<Reviewpage />} />
          <Route path="/x" element={<Chatbot />} />
          <Route path="/image-meta" element={<Imagemeta />} />
          <Route path="/dashboard" element={<Dashboard locations={locations} reviews={reviews} users={users} images={images} />} />

        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}
