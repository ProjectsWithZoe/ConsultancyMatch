import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calculateMatchScore } from './MatchingAlgorithm';
import toast from 'react-hot-toast';

export const ConsultantMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadMatches(session.user.email);
        console.log("session", session);
      } else {
        setConsultant(null);
        setMatches([]);
        console.log('no session');
      }
    });

    // Check initial session
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session?.user?.email) {
      await loadMatches(session.user.email);
    } else {
      setLoading(false);
    }
  };

  const loadMatches = async (email) => {
    try {
      setLoading(true);

      // Get consultant profile
      const { data: consultantData, error: consultantError } = await supabase
        .from('consultants')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log("consultantData", consultantData);

      if (consultantError) throw consultantError;
      
      if (!consultantData) {
        setLoading(false);
        return; // Silently return if no consultant profile found
      }

      // Get all firms
      const { data: firms, error: firmsError } = await supabase
        .from('firms')
        .select('*');

      console.log("firms", firms);

      if (firmsError) throw firmsError;

      // Calculate match scores
      const matchedFirms = firms
        .map(firm => ({firm, score: calculateMatchScore(consultantData, firm)}))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Get top 3 matches

      console.log("matchedFirms", matchedFirms);

      setConsultant(consultantData);
      setMatches(matchedFirms);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!consultant) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Top Matches</h2>
          <p className="mt-4 text-lg text-gray-600">
            Based on your profile, here are the best matching firms for you
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {matches.map(({ firm, score }, index) => (
            <div
              key={firm.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="h-3 bg-indigo-600"></div>
                <div className="absolute -bottom-4 left-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{firm.company_name}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <i className="fa-solid fa-briefcase h-4 w-4 mr-2"></i>
                    {firm.category}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="fa-solid fa-map-pin h-4 w-4 mr-2"></i>
                    {firm.location} • {firm.country}
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-clock h-4 w-4 mr-2"></i>
                    {firm.project_duration} hours
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-dollar-sign h-4 w-4 mr-2"></i>
                    ${firm.minimum_hourly_rate}/hour minimum
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className="text-sm font-bold text-indigo-600">{Math.round(score)}%</span>
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
                  onClick={() => toast.success('Contact request sent!')}
                >
                  Contact Firm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};