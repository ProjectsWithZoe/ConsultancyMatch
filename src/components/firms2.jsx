import React, { useState } from "react";
import { countries } from "../types";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const FirmSignUp = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [firmSignupError, setFirmSignupError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    category: "",
    location: "",
    country: "",
    minimumHourlyRate: "",
    projectDuration: "",
    requiredSkills: [],
  });

  const [newSkill, setNewSkill] = useState({
    skill: "",
  });

  const handleAddSkill = () => {
    if (newSkill.skill.trim() !== "") {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill],
      });
    }
    setNewSkill({ skill: "" });
  };

  const handleSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s.skill !== skill),
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (signUpError) {
        setFirmSignupError(signUpError.message);
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
        return;
      }
      console.log("Account created! Proceeding to next step...");
      toast.success("Account created! Proceeding to next step...");
      setStep(2);
    } catch (error) {
      console.error("Error: ", error);
      toast.error(
        error.message || "Failed to create account. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create the firm profile
    try {
      const { error: profileError } = await supabase.from("firms").insert([
        {
          email: formData.email,
          company_name: formData.companyName,
          category: formData.category,
          location: formData.location,
          country: formData.country,
          minimum_hourly_rate: parseInt(formData.minimumHourlyRate),
          project_duration: parseInt(formData.projectDuration),
          requiredSkills: formData.requiredSkills,
        },
      ]);

      if (profileError) {
        if (profileError.code === "23505") {
          console.log("A profile with this email already exists.");
          toast.error("A profile with this email already exists.");
          return;
        }
        throw profileError;
      }
      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
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
              Company Email
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
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.email || !formData.password}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-400"
          >
            Continue
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleFirmSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.companyName}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Hourly Rate (USD)
            </label>
            <input
              type="number"
              name="minimumHourlyRate"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.minimumHourlyRate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Required skills
            </label>
            <input
              type="skill"
              name="skill"
              placeholder="Enter a skill"
              value={newSkill.skill}
              onChange={handleSkillChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
            >
              Add Skill
            </button>
          </div>

          {formData.requiredSkills.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Selected Skills</h3>
              <ul className="list-disc pl-5">
                {formData.requiredSkills.map((skill, index) => (
                  <li key={index} className="flex justify-between">
                    {skill.skill}
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Duration (Hours)
            </label>
            <input
              type="number"
              name="projectDuration"
              placeholder="e.g., 160 for a month of full-time work"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.projectDuration}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              Typical durations: 160 hours (1 month), 480 hours (3 months), 960
              hours (6 months)
            </p>
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
