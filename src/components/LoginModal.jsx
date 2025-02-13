import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const LoginModal = ({ isOpen, onClose, setIsSignUpOpen, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Successfully logged in!");
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) throw new Error("User not found");

        const userId = userData.user.email;
        let profile = { name: userData.user.email, type: "user" };

        // Fetch user data from 'consultants'
        const { data: consultant } = await supabase
          .from("consultants")
          .select("name")
          .eq("email", userId)
          .single();

        if (consultant) {
          profile = { name: consultant.name, type: "consultant" };
        } else {
          // Fetch user data from 'firms' if not found in 'consultants'
          const { data: firm } = await supabase
            .from("firms")
            .select("company_name")
            .eq("email", userId)
            .single();

          if (firm) {
            profile = { name: firm.company_name, type: "firm" };
          }
        }

        setUser({ ...userData.user, ...profile });
        onClose();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.message || "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Log In</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsSignUpOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
