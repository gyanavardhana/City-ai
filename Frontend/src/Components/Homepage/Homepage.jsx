import React from "react";
import Navbar from "./Navbar";
import heroImage from "../../assets/hero.jpg";
import { Users, MapPin, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../AI-Integrationpage/Chatbot";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-cyan-50 min-h-screen text-cyan-800">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-cyan-900 py-56 bg-cover bg-center border-b border-black"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-cyan-900 opacity-60"></div>
        <div className="container mx-auto text-center relative z-10 px-4">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Welcome to CitySphere
          </h2>
          <p className="text-xl mb-8 text-cyan-100">
            Empowering Smarter Cities, One Review at a Time
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-cyan-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-cyan-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-12 text-center">What We Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Users size={48} />}
              title="Crowdsourced Reviews"
              description="Collect location data and reviews from citizens like you, creating a comprehensive database of urban experiences."
            />
            <FeatureCard
              icon={<MapPin size={48} />}
              title="AI-Powered Location Detection"
              description="Utilize cutting-edge AI technology for accurate location detection and in-depth analysis of urban spaces."
            />
            <FeatureCard
              icon={<ChartBar size={48} />}
              title="Data Visualization"
              description="Access interactive dashboards that bring urban data to life, enabling insightful analysis and informed decision-making."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-cyan-100 py-24">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-8">Get Started Today!</h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join our community of urban explorers and city planners. Your insights can shape the future of our cities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-cyan-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-cyan-700 transition duration-300">
              Contribute Data
            </button>
            <button className="bg-cyan-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-cyan-700 transition duration-300">
              Explore Locations
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold mb-12 text-center">Real People, Real Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <TestimonialCard
              quote="CitySphere helped me discover hidden gems in my neighborhood that I never knew existed. It's like having a local guide in your pocket!"
              author="Sarah Chen"
              title="Urban Explorer"
            />
            <TestimonialCard
              quote="As an urban planner, CitySphere has been invaluable. The crowdsourced data provides insights that traditional surveys simply can't match."
              author="John Martinez"
              title="City Planner"
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-cyan-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h4 className="text-2xl font-bold mb-2">CitySphere</h4>
              <p className="text-cyan-200">Empowering Smarter Cities</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <a href="#" className="text-cyan-200 hover:text-white transition duration-300">
                About Us
              </a>
              <a href="#" className="text-cyan-200 hover:text-white transition duration-300">
                Contact Us
              </a>
              <a href="#" className="text-cyan-200 hover:text-white transition duration-300">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-cyan-50 p-8 rounded-lg shadow-md text-center transition duration-300 hover:shadow-xl">
    <div className="text-cyan-600 mb-4 flex justify-center">{icon}</div>
    <h4 className="text-2xl font-semibold mb-4">{title}</h4>
    <p className="text-cyan-700">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, title }) => (
  <div className="bg-cyan-50 p-8 rounded-lg shadow-md transition duration-300 hover:shadow-xl">
    <p className="text-lg mb-6 italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-cyan-600">{title}</p>
    </div>
  </div>
);

export default Homepage;
