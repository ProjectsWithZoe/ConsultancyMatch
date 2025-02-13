import React from "react";
import HowItWorks from "./Howitworks";
import { useNavigate } from "react-router-dom";

export const Hero = ({ user }) => {
  const navigate = useNavigate();
  console.log(user);

  return (
    <div className="relative">
      {/* Hero background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2574")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 sm:py-48 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Connect with the Perfect Match
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Our AI-powered platform matches top consultants with leading firms,
            creating perfect partnerships that drive success.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <a
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                onClick={() => navigate("/yourmatches")}
              >
                Your Matches
                <i className="fa-solid fa-arrow-right ml-2 inline-block h-4 w-4"></i>
              </a>
            ) : (
              <a
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                onClick={() => navigate("/how-it-works")}
              >
                Find Matches
                <i className="fa-solid fa-arrow-right ml-2 inline-block h-4 w-4"></i>
              </a>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="rounded-lg bg-indigo-600/20 p-3">
              <i className="fa-solid fa-briefcase h-6 w-6 text-indigo-300"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Expert Matching
            </h3>
            <p className="mt-2 text-gray-200">
              Our algorithm considers expertise, experience, and other relevant
              requirements for every role.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="rounded-lg bg-indigo-600/20 p-3">
              <i className="fa-solid fa-users h-6 w-6 text-indigo-300"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Top Matches
            </h3>
            <p className="mt-2 text-gray-200">
              Returns the closest matches between consultants skills and top
              business needs by those hiring.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="rounded-lg bg-indigo-600/20 p-3">
              <i className="fa-solid fa-chart-line h-6 w-6 text-indigo-300"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Accurate Comparison
            </h3>
            <p className="mt-2 text-gray-200">
              Calculate how closely your profile matches a given job description
              for precise targetting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
