import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { calculateMatchScore } from "./MatchingAlgorithm";
import toast from "react-hot-toast";

export const FirmDashboard = () => {
  const [recentConsultants, setRecentConsultants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [firm, setFirm] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) return;

      // Load firm profile
      const { data: firmData } = await supabase
        .from("firms")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle();

      if (firmData) {
        setFirm(firmData);
      }

      // Load recent consultants
      const { data: consultants, error: consultantsError } = await supabase
        .from("consultants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (consultantsError) throw consultantsError;
      setRecentConsultants(consultants || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const findMatches = async () => {
    if (!firm) return;

    try {
      setMatchLoading(true);

      // Load all consultants
      const { data: consultants, error: consultantsError } = await supabase
        .from("consultants")
        .select("*");

      if (consultantsError) throw consultantsError;

      // Calculate match scores
      const matchedConsultants = consultants
        .map((consultant) => ({
          consultant,
          score: calculateMatchScore(consultant, firm),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get top 3 matches

      setMatches(matchedConsultants);
      toast.success("Found your top matches!");
    } catch (error) {
      console.error("Error finding matches:", error);
      toast.error("Failed to find matches");
    } finally {
      setMatchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recent Consultants Section */}
        <div className="m-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Recently Joined Consultants
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {recentConsultants.map((consultant) => (
              <div
                key={consultant.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {consultant.name}
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fa-solid fa-briefcase h-4 w-4 mr-2"></i>
                      {consultant.category}
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-map-pin h-4 w-4 mr-2"></i>
                      {consultant.location} • {consultant.country}
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-clock h-4 w-4 mr-2"></i>
                      {consultant.availability}
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-dollar-sign h-4 w-4 mr-2"></i>$
                      {consultant.hourly_rate}/hour
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Find Matches Section */}
        <div className="text-center mb-12">
          <button
            onClick={findMatches}
            disabled={matchLoading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center"
          >
            <i className="fa-solid fa-search h-5 w-5 mr-2"></i>
            {matchLoading ? "Finding Matches..." : "Find My Matches"}
          </button>
        </div>

        {/* Matches Section */}
        {matches.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Top Matches
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {matches.map(({ consultant, score }, index) => (
                <div
                  key={consultant.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <div className="h-3 bg-indigo-600"></div>
                    <div className="absolute -bottom-4 left-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {consultant.name}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="fa-solid fa-briefcase h-4 w-4 mr-2"></i>
                        {consultant.category}
                      </div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-map-pin h-4 w-4 mr-2"></i>
                        {consultant.location} • {consultant.country}
                      </div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-clock h-4 w-4 mr-2"></i>
                        {consultant.availability}
                      </div>
                      <div className="flex items-center">
                        <i className="fa-solid fa-dollar-sign h-4 w-4 mr-2"></i>
                        ${consultant.hourly_rate}/hour
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Match Score
                        </span>
                        <span className="text-sm font-bold text-indigo-600">
                          {Math.round(score)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300"
                      onClick={() => toast.success("Contact request sent!")}
                    >
                      Contact Consultant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
