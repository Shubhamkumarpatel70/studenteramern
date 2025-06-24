import React from "react";
import Footer from "../components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2">
    <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-2xl w-full mt-8 mb-8">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-700 text-center">Terms & Conditions</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">1. Acceptance of Terms</h2>
        <p className="text-gray-700 text-lg">By using Student Era, you agree to these terms and conditions. Please read them carefully before using our services.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">2. User Responsibilities</h2>
        <ul className="list-disc pl-6 text-gray-700 text-lg">
          <li className="mb-2">Provide accurate and complete information during registration and application.</li>
          <li className="mb-2">Do not share your account credentials with others.</li>
          <li className="mb-2">Respect deadlines and guidelines for internships and tasks.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">3. Privacy Policy</h2>
        <p className="text-gray-700 text-lg">We value your privacy. Your data will not be shared with third parties except as required by law or for service provision.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">4. Changes to Terms</h2>
        <p className="text-gray-700 text-lg">Student Era reserves the right to update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">5. Contact</h2>
        <p className="text-gray-700 text-lg">For any questions, please <a href="/contact" className="text-blue-600 underline">contact us</a>.</p>
      </section>
    </div>
    <Footer />
  </div>
);

export default Terms; 