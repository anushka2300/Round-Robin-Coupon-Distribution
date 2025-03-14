"use client";

import React, { useState, useEffect } from "react";

export default function Index() {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkPreferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDarkPreferred);
    }
  }, []);

  const claimCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://round-robin-coupon-distribution-1.onrender.com/claim', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCoupon(data.coupon);
        setMessage(data.message);
      } else {
        setMessage(data.message || "Error claiming coupon");
      }
    } catch (error) {
      setMessage("An error occurred while claiming the coupon.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Coupon Claim
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <p className="text-sm mb-4">
            Click the button below to claim your exclusive coupon. Each user can claim one coupon on a first-come, first-served basis.
          </p>
          
          <button
            onClick={claimCoupon}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-300 flex items-center justify-center ${
              loading 
                ? "bg-gray-500 cursor-not-allowed"
                : darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Claim Your Coupon"
            )}
          </button>
        </div>

        {(message || coupon) && (
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {message && (
              <p className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                {message}
              </p>
            )}
            {coupon && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your coupon code:</p>
                <div className={`flex items-center justify-between p-3 rounded-md border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                  <span className={`font-mono font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    {coupon}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon);
                      setMessage("Coupon copied to clipboard!");
                      setTimeout(() => setMessage(""), 2000);
                    }}
                    className={`ml-2 p-1 rounded ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                    aria-label="Copy coupon code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}