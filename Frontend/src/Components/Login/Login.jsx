import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Pyro from "../../assets/citysphere-logo-dark.png";
import loginImage from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigateToHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    toast.promise(
      axios
        .post(`${import.meta.env.VITE_APP_URL}users/login`, { email, password })
        .then((response) => {
          Cookies.set("authToken", response.data.token, { expires: 7 });
          return response;
        }),
      {
        pending: "Logging in...",
        success: {
          render() {
            navigateToHome();
            return "Login Successful";
          },
        },
        error: {
          render({ data }) {
            const errMsg = data?.response?.data?.error || "Internal Server Error";
            setError(errMsg); // Set inline error message
            return errMsg; // This will be used for the toast
          },
        },
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Zoom,
      }
    );
  };
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cyan-100">
        <div className="bg-white mt-0 shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-4">
              <img src={Pyro} alt="Pyro Icon" className="h-14 w-55" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-cyan-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-700 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-cyan-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-cyan-700 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Displaying error message */}
              {error && (
                <div className="text-red-500 text-sm italic mb-4">{error}</div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
                <a
                  href="/signup"
                  className="text-cyan-600 hover:text-cyan-800 text-sm"
                >
                  Create an account?
                </a>
              </div>
            </form>
          </div>
          {/* Login Image Section */}
          <div className="hidden md:block md:w-1/2 bg-cyan-200 p-8">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
