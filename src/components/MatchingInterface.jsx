import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Sample data - in a real app, this would come from an API
const sampleConsultants = [
  {
    id: "1",
    name: "Sarah Chen",
    expertise: ["Strategy", "Digital Transformation", "Change Management"],
    yearsOfExperience: 12,
    hourlyRate: 200,
    availability: "full-time",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    expertise: ["IT Consulting", "Cloud Architecture", "Agile"],
    yearsOfExperience: 8,
    hourlyRate: 150,
    availability: "contract",
    rating: 4.7,
  },
];

const sampleFirms = [
  {
    id: "1",
    name: "TechForward Solutions",
    requiredSkills: ["Digital Transformation", "Change Management"],
    hourlyRate: 200,
    projectDuration: "6 months",
    location: "Remote",
  },
  {
    id: "2",
    name: "Global Innovations Corp",
    requiredSkills: ["IT Consulting", "Cloud Architecture"],
    hourlyRate: 150,
    projectDuration: "3 months",
    location: "Hybrid",
  },
];

export const MatchingInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [consultants, setConsultants] = useState([]);

  const loadAllConsultants = async () => {
    const { data: consultantData, error: consultantError } = await supabase
      .from("consultants")
      .select("*");

    if (consultantError) {
      console.error("Error fetching consultants");
    } else {
      setConsultants(consultantData);
    }

    console.log(consultantData);
  };

  useEffect(() => {
    loadAllConsultants();
  }, []);

  //const filteredConsultants = sampleConsultants.filter(consultant => {
  //const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //  consultant.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));

  //const matchesExpertise = selectedExpertise.length === 0 ||
  //  selectedExpertise.some(exp => consultant.expertise.includes(exp));

  //return matchesSearch && matchesExpertise;
  //});
  return (
    <div className="bg-gray-50 py-16" id="matching">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="flex text-2xl mb-2 justify-center">
            Search for consultants{" "}
          </h1>
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search consultants by name or expertise..."
              className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <h1 className="flex text-2xl justify-center mb-2">
          Recently added consultants{" "}
        </h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {consultants.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{consultant.name}</h3>
                <span className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded">
                  {consultant.availability}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {consultant.location}
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Rate: ${consultant.hourly_rate}
                </p>
                <div className="flex flex-wrap gap-2">
                  {consultant.expertise.map((exp, index) => (
                    <span
                      key={`${consultant.id}-${index}`}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      <p>Skill: {exp.skill}</p>
                      <p>Years of experience: {exp.yearsOfExperience}</p>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
