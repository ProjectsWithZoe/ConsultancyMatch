import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const ProfileSummary = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [profileType, setProfileType] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) return;

      // Try loading consultant profile
      const { data: consultant } = await supabase
        .from("consultants")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle();

      if (consultant) {
        setProfile(consultant);
        setProfileType("consultant");
        setBio(consultant.bio || "");
        console.log(consultant);
        return;
      }

      // Try loading firm profile
      const { data: firm } = await supabase
        .from("firms")
        .select("*")
        .eq("email", session.user.email)
        .maybeSingle();

      if (firm) {
        setProfile(firm);
        setProfileType("firm");
        console.log(firm);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setUploading(true);

      // Upload file to Supabase Storage
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const fileName = `${session.user.id}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cvs").getPublicUrl(fileName);

      // Update consultant profile with CV URL
      const { error: updateError } = await supabase
        .from("consultants")
        .update({ cv_url: publicUrl })
        .eq("email", session.user.email);

      if (updateError) throw updateError;

      toast.success("CV uploaded successfully");
      loadProfile(); // Reload profile to get updated CV URL
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error(error.message || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleBioUpdate = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) return;

      const { error } = await supabase
        .from("consultants")
        .update({ bio })
        .eq("email", session.user.email);

      if (error) throw error;

      toast.success("Bio updated successfully");
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error(error.message || "Failed to update bio");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg mx-auto max-w-3xl my-8 overflow-hidden">
      <div className="px-6 py-20">
        {profileType === "consultant" ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {" "}
              {profile.name}
            </h2>
            <span className="rounded-md bg-indigo-700 text-white p-2 my-2">
              Consultant
            </span>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {" "}
              {profile.company_name}
            </h2>
            <span className="rounded-md bg-green-700 text-white p-2 my-2">
              Hiring Consultants
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600 mt-4">
              <i className="fa-solid fa-briefcase h-5 w-5 mr-2"></i>
              <span>{profile.category}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <i className="fa-solid fa-map-pin h-5 w-5 mr-2"></i>
              <span>
                {profile.location} • {profile.country}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <i className="fa-solid fa-clock h-5 w-5 mr-2"></i>
              {profileType === "consultant" ? (
                <span>{profile.availability}</span>
              ) : (
                <span>{profile.project_duration} hours typical duration</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {profileType === "consultant" ? (
              <></>
            ) : (
              <>
                <div className="text-gray-600">
                  <strong>Minimum Rate:</strong> ${profile.minimum_hourly_rate}
                  /hour
                </div>
                {profile.requirements && (
                  <div className="text-gray-600">
                    <strong>Requirements:</strong>
                    <p>{profile.requirements}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {profileType === "consultant" && (
          <div className="flex flex-col my-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Skills and Experience
            </h3>
            <div className="flex justify-between items-center p-2 border-b last:border-b-0">
              <p>
                <strong>Skills</strong>
              </p>
              <p>
                <strong>Years of experience</strong>
              </p>
            </div>

            {profile.expertise.map((exp, index) => (
              <div
                key={`${profile.id}-${index}`}
                className="flex justify-between items-center p-2 border-b last:border-b-0"
              >
                <p className="text-gray-700 font-medium"> {exp.skill}</p>
                <p className="text-gray-600">{exp.yearsOfExperience}</p>
              </div>
            ))}
          </div>
        )}

        {profileType === "consultant" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                Professional Bio
              </h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            {editing ? (
              <div className="space-y-4">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write a brief professional bio..."
                />
                <button
                  onClick={handleBioUpdate}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                >
                  Save Bio
                </button>
              </div>
            ) : (
              <p className="text-gray-600">
                {profile.bio || "No bio added yet."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
