import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({
  isDropdownOpen,
  toggleDropdown,
  loading,
  user,
  setIsLoginOpen,
  setIsSignUpOpen,
  handleLogout,
}) {
  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto p-2">
        <div className="flex items-center justify-end">
          <div className="hidden md:flex align-items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            {user ? (
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            ) : (
              <Link
                to="/how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                Find your match
              </Link>
            )}

            <Link
              to="compatibility-calculator"
              className="text-gray-600 hover:text-gray-900"
            >
              Compatibility Calculator
            </Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {!loading &&
              (user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900">
                    {user.type === "consultant" ? "Welcome, " : ""}
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <i className="fa-solid fa-right-from-bracket h-4 w-4 mr-1"></i>
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setIsSignUpOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Sign Up
                  </button>
                </>
              ))}
          </div>
          {/* Mobile Dropdown Button */}
          <button className="md:hidden text-primary" onClick={toggleDropdown}>
            <i className="fa-solid fa-bars" style={{ color: "#4f46e5" }}></i>
          </button>
        </div>
        {/* Dropdown Menu for Mobile */}
        {isDropdownOpen && (
          <div className="md:hidden flex flex-col space-y-4">
            <Link
              to="/"
              className="flex flex-column justify-center text-gray-600 hover:text-gray-900"
              onClick={toggleDropdown}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className="flex flex-column justify-center text-gray-600 hover:text-gray-900"
              onClick={toggleDropdown}
            >
              Find Your Match
            </Link>
            <Link
              to="compatibility-calculator"
              className="flex flex-column justify-center text-gray-600 hover:text-gray-900"
            >
              Compatibility Calculator{" "}
            </Link>
            <Link
              to="/about"
              className="flex flex-column justify-center text-gray-600 hover:text-gray-900"
            >
              About{" "}
            </Link>
            <Link
              to="/contact"
              className="flex flex-column justify-center text-gray-600 hover:text-gray-900"
            >
              Contact{" "}
            </Link>

            {!loading &&
              (user ? (
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-gray-900">
                    {user.type === "consultant" ? "Welcome, " : ""}
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-indigo-100 text-indigo-800 hover:text-gray-900"
                  >
                    <i className="fa-solid fa-right-from-bracket h-4 w-4 mr-1"></i>
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setIsSignUpOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Sign Up
                  </button>
                </>
              ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
