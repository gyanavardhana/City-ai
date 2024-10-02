import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/logo.png";
import ExtraImage from "../../assets/extra-image.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { isTokenExpired } from "../../utils/authutils";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState({
    profile: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsLoggedIn(token && !isTokenExpired(token));
  }, []);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenMenu((prev) => ({ ...prev, [menu]: true }));
  };

  const handleMouseLeave = (menu) => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu((prev) => ({ ...prev, [menu]: false }));
    }, 100);
  };

  const handleOptionClick = (path) => {
    const token = Cookies.get("authToken");
    if (!token || isTokenExpired(token)) {
      toast.error("Session timed out", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Zoom,
      });
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    toast.success("Logged out successfully", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Zoom,
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <header className="bg-cyan-100 shadow-md">
        <div className="container mx-auto px-5 py-4 border-b border-cyan-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={Logo}
              alt="Logo"
              className="h-16 w-16 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <img
              src={ExtraImage}
              alt="Extra Icon"
              className="h-16 w-52 cursor-pointer"
            />
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <NavItem onClick={() => handleOptionClick("/location-map")}>
                Location Map
              </NavItem>
              <NavItem onClick={() => handleOptionClick("/reviews")}>
                Review Page
              </NavItem>
              <NavItem onClick={() => handleOptionClick("/image-meta")}>
                ImageMeta
              </NavItem>
              <NavItem onClick={() => handleOptionClick("/dashboard")}>
                Dashboard
              </NavItem>
              {isLoggedIn ? (
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("profile")}
                  onMouseLeave={() => handleMouseLeave("profile")}
                >
                  <NavItem>User Profile</NavItem>
                  {openMenu.profile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-cyan-200 rounded-md shadow-lg z-50">
                      <DropdownItem onClick={handleLogout}>
                        Logout
                      </DropdownItem>
                    </div>
                  )}
                </div>
              ) : (
                <NavItem onClick={() => navigate("/login")}>Sign In</NavItem>
              )}
            </ul>
          </nav>
          <button
            className="md:hidden text-cyan-800 hover:text-cyan-600"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Improved Sidebar for small screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleSidebar}>
          <div className="absolute top-0 right-0 h-full w-64 bg-cyan-100 shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-cyan-200">
              <h2 className="text-xl font-semibold text-cyan-800">Menu</h2>
              <button onClick={toggleSidebar} className="text-cyan-800 hover:text-cyan-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="p-4">
              <SidebarNavItem onClick={() => handleOptionClick("/location-map")} toggleSidebar={toggleSidebar}>
                Location Map
              </SidebarNavItem>
              <SidebarNavItem onClick={() => handleOptionClick("/reviews")} toggleSidebar={toggleSidebar}>
                Review Page
              </SidebarNavItem>
              <SidebarNavItem onClick={() => handleOptionClick("/image-meta")} toggleSidebar={toggleSidebar}>
                ImageMeta
              </SidebarNavItem>
              <SidebarNavItem onClick={() => handleOptionClick("/dashboard")} toggleSidebar={toggleSidebar}>
                Dashboard
              </SidebarNavItem>
              {isLoggedIn ? (
                <SidebarNavItem onClick={() => { handleLogout(); toggleSidebar(); }}>
                  Logout
                </SidebarNavItem>
              ) : (
                <SidebarNavItem onClick={() => { navigate("/login"); toggleSidebar(); }}>Sign In</SidebarNavItem>
              )}
            </ul>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </>
  );
};

const NavItem = ({ children, onClick, toggleSidebar }) => (
  <li>
    <button
      onClick={() => {
        if (toggleSidebar) toggleSidebar(); // Close sidebar if function exists
        onClick();
      }}
      className="text-cyan-800 hover:text-cyan-600 font-medium text-lg transition duration-150 ease-in-out"
    >
      {children}
    </button>
  </li>
);

const DropdownItem = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="px-4 py-2 text-sm text-cyan-800 hover:bg-cyan-50 cursor-pointer transition duration-150 ease-in-out"
  >
    {children}
  </div>

);

const SidebarNavItem = ({ children, onClick, toggleSidebar }) => (
  <li className="mb-4 border-b border-cyan-200 pb-2">
    <button
      onClick={() => {
        if (toggleSidebar) toggleSidebar();
        onClick();
      }}
      className="text-cyan-800 hover:text-cyan-600 font-medium text-lg transition duration-150 ease-in-out w-full text-left"
    >
      {children}
    </button>
  </li>
);

export default Navbar;
