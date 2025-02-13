import React, { useState } from "react";
import { ConsultantSignUp } from "./ConsultantSignUp";
import { FirmSignUp } from "./FirmSignUp";

export const SignUpModal = ({
  isOpen,
  onClose,
  initialType,
  setIsLoginOpen,
}) => {
  const [type, setType] = useState(initialType || "consultant");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Create an Account</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark h-6 w-6"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md ${
                type === "consultant"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setType("consultant")}
            >
              I'm a Consultant
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md ${
                type === "firm"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setType("firm")}
            >
              I'm Hiring Consultants
            </button>
          </div>

          {type === "consultant" ? (
            <ConsultantSignUp onClose={onClose} />
          ) : (
            <FirmSignUp onClose={onClose} />
          )}
          <div className="text-center text-sm text-gray-600">
            Have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsLoginOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
