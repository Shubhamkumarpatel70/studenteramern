import React from "react";
import Footer from "../components/Footer";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col font-sans">
    {/* Hero Section */}
    <div className="max-w-6xl mx-auto w-full px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left: Image/Graphic */}
        <div className="flex-1 flex justify-center">
          <div className="bg-gradient-to-br from-blue-600 to-pink-400 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-80 h-80 backdrop-blur-md border border-indigo-100 group transition-transform duration-300 hover:scale-105">
            <span className="text-white text-lg font-semibold mb-2 mt-4 tracking-wider">INSPIRE COMPANY</span>
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="bg-pink-400 text-white px-4 py-2 rounded-lg text-2xl font-bold mb-2 shadow">WHY YOU SHOULD</span>
              <span className="bg-white text-blue-600 px-4 py-2 rounded-lg text-4xl font-extrabold mb-2 shadow">CHOOSE</span>
              <span className="bg-pink-400 text-white px-4 py-2 rounded-lg text-2xl font-bold mb-2 shadow">OUR COMPANY</span>
              <span className="text-white text-xs mt-4 tracking-widest">OUR ADVANTAGES</span>
            </div>
          </div>
        </div>
        {/* Right: Mission and Core Values */}
        <div className="flex-1">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-indigo-100 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base font-semibold">Our Mission</span>
            </h2>
            <p className="mb-6 text-gray-700">To bridge the gap between education and industry by equipping students with cutting-edge knowledge, practical skills, and real-world experience through innovative programs and expert mentorship.</p>
            <h3 className="text-xl font-bold text-purple-700 mb-2">Core Values</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">💡</span> <span><b>Innovation</b>: Pioneering creative solutions and future-ready approaches to education.</span></li>
              <li className="flex items-start gap-2"><span className="text-purple-500 mt-1">🛡️</span> <span><b>Integrity</b>: Upholding trust, transparency and ethical practices in all we do.</span></li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">🤝</span> <span><b>Collaboration</b>: Partnering with students, educators and industry for collective success.</span></li>
              <li className="flex items-start gap-2"><span className="text-pink-500 mt-1">🏆</span> <span><b>Excellence</b>: Committing to the highest standards in learning and innovation.</span></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Empowering Section */}
      <div className="text-center mt-12">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">About STUDENT ERA</span>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-2 drop-shadow">Empowering Future Leaders</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">We create transformative learning experiences that bridge academia and industry, preparing students to excel in tomorrow's world.</p>
      </div>
      {/* Approach to Learning */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Approach to Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-6 flex flex-col items-center backdrop-blur-md border border-indigo-100 group transition-transform duration-300 hover:scale-105">
            <img src="https://img.icons8.com/ios-filled/100/000000/idea.png" alt="Innovative Learning" className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Innovative Learning</h3>
            <p className="text-gray-700 text-center">Our programs foster creativity and critical thinking through project-based learning, preparing students to lead with innovative solutions.</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-6 flex flex-col items-center backdrop-blur-md border border-indigo-100 group transition-transform duration-300 hover:scale-105">
            <img src="https://img.icons8.com/ios-filled/100/000000/artificial-intelligence.png" alt="Empowering Minds" className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Empowering Minds</h3>
            <p className="text-gray-700 text-center">We equip students with technical skills, problem-solving abilities, and the growth mindset needed to tackle real-world challenges.</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-6 flex flex-col items-center backdrop-blur-md border border-indigo-100 group transition-transform duration-300 hover:scale-105">
            <img src="https://img.icons8.com/ios-filled/100/000000/virtual-reality.png" alt="Future-Ready Students" className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Future-Ready Students</h3>
            <p className="text-gray-700 text-center">Our curriculum evolves with industry trends, helping students adapt, innovate and succeed in an increasingly digital world.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About; 