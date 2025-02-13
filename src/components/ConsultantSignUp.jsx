import React, { useState, useEffect } from "react";
import { countries, skills } from "../types";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const ConsultantSignUp = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    category: "",
    location: "",
    country: "",
    hourlyRate: "",
    availability: "full-time",
    expertise: [],
  });
  const [newSkill, setNewSkill] = useState({
    skill: "",
    yearsOfExperience: "",
  });

  useEffect(() => {
    // Add no-scroll class to body when component mounts
    document.body.classList.add("no-scroll");
    return () => {
      // Remove no-scroll class from body when component unmounts
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (
      newSkill.skill.trim() !== "" &&
      newSkill.yearsOfExperience.trim() !== ""
    ) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, newSkill],
      });
    }
    setNewSkill({ skill: "", yearsOfExperience: "" });
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((s) => s.skill !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (signUpError) {
        setSignUpError(signUpError.message);
        console.log(signUpError.message);

        if (signUpError.message === "User already registered") {
          setFormData((prev) => ({
            email: "",
            password: "",
          }));
          toast.error(
            "An account with this email already exists. Please log in instead."
          );
        }

        setLoading(false);
        return; // Exiting here prevents onClose from running
      }

      toast.success("Account created! Proceeding to next step...");
      setStep(2);
    } catch (error) {
      console.error("Error: ", error);
      toast.error(
        error.message || "Failed to create account.Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: profileError } = await supabase
        .from("consultants")
        .insert([
          {
            email: formData.email,
            name: formData.name,
            category: formData.category,
            location: formData.location,
            country: formData.country,
            hourly_rate: parseInt(formData.hourlyRate),
            availability: formData.availability,
            expertise: formData.expertise,
          },
        ]);

      /*if (formData.expertise.length === 0) {
        toast.error("Please select at least one skill.");
        setLoading(false);
        return;
      }*/

      if (profileError) {
        if (profileError.code === "23505") {
          toast.error("A profile with this email already exists.");
          return;
        }
        throw profileError;
      }
      toast.success("Profile created successfully! Please verify your email");
      if (onClose) onClose();
    } catch (error) {
      console.log("Profile creation error: ", error);
      toast.error(error.message || "Failed to save profile. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-2">
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={!formData.email || !formData.password}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Strategy">Strategy</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Work Type
            </label>
            <select
              name="location"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select work type</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              name="country"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <input
              type="skill"
              name="skill"
              placeholder="Enter a skill"
              value={newSkill.skill}
              onChange={handleSkillChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                placeholder="Enter years of experience"
                value={newSkill.yearsOfExperience}
                onChange={handleSkillChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
          >
            Add Skill
          </button>

          <div className="mt-4">
            <h3 className="font-semibold">Selected Skills</h3>
            <ul className="list-disc pl-5">
              {formData.expertise.map((skill, index) => (
                <li key={index} className="flex justify-between">
                  {skill.skill} ({skill.yearsOfExperience} years)
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.skill)}
                    className="text-red-500 ml-2"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hourly Rate (USD)
            </label>
            <input
              type="number"
              name="hourlyRate"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.hourlyRate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              name="availability"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
