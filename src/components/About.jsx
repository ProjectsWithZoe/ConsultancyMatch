import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
          About Our Platform
        </h2>

        {/* Main Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Our platform is designed to streamline the matchmaking process between
          consultants and firms, ensuring that businesses find the right
          expertise while consultants secure the most suitable opportunities. By
          leveraging intelligent matching algorithms, we help both parties
          connect efficiently and effectively. Below are the key benefits of our
          platform:
        </p>

        {/* Section 1 */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Optimized Consultant-Firm Matching
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Finding the right consultant can be challenging, but our platform
            simplifies the process by identifying the most compatible candidates
            based on a firm’s specific needs. We analyze consultant profiles,
            experience, and skills to find the best possible matches for
            businesses looking for expertise.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-4">
            <li>
              Uses advanced algorithms to identify top consultant matches.
            </li>
            <li>
              Matches consultants to firms based on skills, experience, and
              industry requirements.
            </li>
            <li>
              Ensures firms connect with consultants who align closely with
              their project objectives.
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Helping Firms Find Top 10 Consultants
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Firms often struggle to sift through numerous profiles to find the
            right consultant for their projects. Our system ranks the 10 best
            consultants based on project requirements, skills, and experience,
            saving firms valuable time and effort.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-4">
            <li>Analyzes consultant qualifications and industry experience.</li>
            <li>
              Ranks the top 10 consultants who best fit the firm's requirements.
            </li>
            <li>
              Provides firms with an easy-to-compare list of candidates,
              ensuring informed decision-making.
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Consultant Job Profile Comparison
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Consultants can leverage our platform to compare their profiles
            against job specifications to assess their suitability for a given
            role. This feature provides valuable insights into how well they
            align with a firm’s expectations and where they can improve.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-4">
            <li>
              Allows consultants to compare their skills with job requirements.
            </li>
            <li>
              Identifies gaps in experience or qualifications to enhance
              competitiveness.
            </li>
            <li>
              Helps consultants tailor their profiles to better meet firm
              expectations.
            </li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mt-6">
            Our goal is to create a seamless, data-driven matching experience
            that benefits both firms and consultants, ensuring the best
            partnerships for successful collaborations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
