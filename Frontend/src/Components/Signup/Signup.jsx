import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Zoom } from "react-toastify"; // ToastContainer removed
import Navbar from "../Homepage/Navbar";

// Assume these imports exist in your project
import CitySphereLogoDark from "../../assets/citysphere-logo-dark.png";
import SignupIllustration from "../../assets/signup.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigateToLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Zoom,
      });
      return;
    }
  
    try {
      await toast.promise(
        axios.post(`${import.meta.env.VITE_APP_URL}users/signup`, {
          username,
          email,
          password,
        }),
        {
          pending: "Creating your account...",
          success: "Account created successfully!",
          error: {
            render({ data }) {
              setError(data?.response?.data?.error || "Internal Server Error");
              return data?.response?.data?.error || "Internal Server Error";
            },
          },
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Zoom,
        }
      );
      navigateToLogin();
    } catch (err) {
      // Removed the second toast.error call here
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen bg-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden flex max-w-4xl mx-auto">
          {/* Signup Image Section */}
          <div className="hidden md:block w-1/2 bg-cyan-100 p-8">
            <img
              src={SignupIllustration}
              alt="Signup Illustration"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-6">
              <img
                src={CitySphereLogoDark}
                alt="CitySphere Logo"
                className="h-16"
              />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center text-cyan-800">
              Join CitySphere
            </h2>
            <form onSubmit={handleSubmit}>
              <InputField
                label="Username"
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              {error && (
                <p className="text-red-500 text-sm italic mb-4">{error}</p>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Sign Up
                </button>
                <a
                  href="/login"
                  className="text-cyan-600 hover:text-cyan-800 text-sm"
                >
                  Already have an account?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* ToastContainer removed from here */}
    </div>
  );
};

const InputField = ({ label, id, name, type, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-cyan-700 text-sm font-bold mb-2" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="shadow appearance-none border border-cyan-200 rounded w-full py-2 px-3 text-cyan-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Signup;
