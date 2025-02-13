import React from "react";

const Contact = () => {
  return (
    <div>
      <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header Section */}
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
            Contact Us
          </h2>

          {/* Main Description */}
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Contact us on admin@projectswithz.space for any inquiries,
            suggestions or complaints !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
