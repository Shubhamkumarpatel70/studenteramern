import React from "react";
import Footer from "../components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center">
    <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-2xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
      <p className="text-lg text-gray-700">Your privacy is important to us. Student Era does not share your personal information with third parties. Please read our privacy policy for more details.</p>
    </div>
    <Footer />
  </div>
);

export default Privacy; 