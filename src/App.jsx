import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Hero } from "./components/Hero";
import { MatchingInterface } from "./components/MatchingInterface";
import { SignUpModal } from "./components/SignUpModal";
import { LoginModal } from "./components/LoginModal";
import { ConsultantMatches } from "./components/ConsultantMatches";
import { FirmDashboard } from "./components/FirmDashboard";
import { ProfileSummary } from "./components/ProfileSummary";
import { Toaster } from "react-hot-toast";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import HowItWorks from "./components/Howitworks";
import YourMatches from "./components/YourMatches";
import About from "./components/About";
import CompatibilityCalculator from "./components/CompatibilityCalculator";
import Contact from "./components/Contact";

function App() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [signUpType, setSignUpType] = useState("consultant");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    checkSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        loadUserData(session.user.email);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await loadUserData(session.user.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (email) => {
    try {
      const { data: consultant } = await supabase
        .from("consultants")
        .select("name")
        .eq("email", email)
        .maybeSingle();

      if (consultant) {
        setUser({ name: consultant.name, type: "consultant" });
        return;
      }

      const { data: firm } = await supabase
        .from("firms")
        .select("company_name")
        .eq("email", email)
        .maybeSingle();

      if (firm) {
        setUser({ name: firm.company_name, type: "firm" });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleCloseSignUp = () => {
    setIsSignUpOpen(false);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first!");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    setText(data.text || "No text found.");
  };

  return (
    <div className="min-h-screen bg-white">
      <div style={{ padding: "20px" }}>
        <h1>Upload & Read PDF</h1>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload"}
        </button>
        {text && <pre>{text}</pre>}
      </div>
      <Navbar
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        loading={loading}
        user={user}
        setIsLoginOpen={setIsLoginOpen}
        setIsSignUpOpen={setIsSignUpOpen}
        handleLogout={handleLogout}
      />
      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        {/*<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">ConsultMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
              {!loading && (
                user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-900">
                      {user.type === 'consultant' ? 'Welcome, ' : ''}{user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => setIsSignUpOpen(true)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
                    >
                      Sign Up
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </nav>*/}
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero user={user} />
                <MatchingInterface />
              </>
            }
          />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {user && <Route path="/profile" element={<ProfileSummary />} />}
          {user?.type === "consultant" && (
            <Route path="/matches" element={<ConsultantMatches />} />
          )}

          {!user && <Route path="/matching" element={<MatchingInterface />} />}
          {user && <Route path="/yourmatches" element={<FirmDashboard />} />}
          <Route path="/about" element={<About />}></Route>
          <Route
            path="/compatibility-calculator"
            element={<CompatibilityCalculator />}
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/*<main>
        {!user && <Hero />}
        {user && <ProfileSummary />}
        {user?.type === "consultant" && <ConsultantMatches />}
        {user?.type === "firm" && <FirmDashboard />}
        {!user && <MatchingInterface />}
      </main>

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>*/}

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={handleCloseSignUp}
        initialType={signUpType}
        setIsLoginOpen={setIsLoginOpen}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        setIsSignUpOpen={setIsSignUpOpen}
        setUser={setUser}
      />

      {/*{ && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          setShowSignup={setShowSignup}
        />
      )}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}*/}

      <footer className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 ConsultMatch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
