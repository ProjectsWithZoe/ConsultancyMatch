import { useState } from "react";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("firms");

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          How It Works
        </h2>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-l-lg text-lg font-medium ${
              activeTab === "firms"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("firms")}
          >
            For Firms
          </button>
          <button
            className={`px-6 py-2 rounded-r-lg text-lg font-medium ${
              activeTab === "consultants"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("consultants")}
          >
            For Consultants
          </button>
        </div>

        {/* Firms Section */}
        {activeTab === "firms" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              Hiring Consultants Made Easy
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">1.</span>
                <p>Sign up and create a company profile.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">2.</span>
                <p>Browse a list of top consultants and their expertise.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">3.</span>
                <p>View detailed profiles, including skills and experience.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">4.</span>
                <p>Receive top 3 matches based on your needs.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">5.</span>
                <p>Connect with consultants and start working together.</p>
              </li>
            </ul>
          </div>
        )}

        {/* Consultants Section */}
        {activeTab === "consultants" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-indigo-700">
              Find Your Perfect Project
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">1.</span>
                <p>Sign up and create your consultant profile.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">2.</span>
                <p>Enter your skills and expertise.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">3.</span>
                <p>Get automatically matched with the top 3 best firms.</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">4.</span>
                <p>Contact your matched firms and start working.</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HowItWorks;
