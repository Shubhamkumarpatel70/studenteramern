import React from "react";
import Footer from "../components/Footer";
import { Users, Award, BookOpen, Target } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-[Inter,sans-serif]">
    {/* Hero Section */}
    <div className="max-w-6xl mx-auto w-full px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left: Image/Graphic */}
        <div className="flex-1 flex justify-center">
          <div className="bg-[#0A2463] rounded-2xl shadow-2xl flex flex-col items-center justify-center w-80 h-80 border border-[#0A2463] group transition-transform duration-300 hover:scale-105 p-6">
            <span className="text-[#FFFFFF] text-lg font-semibold mb-2 mt-4 tracking-wider">STUDENT ERA</span>
            <div className="flex flex-col items-center justify-center flex-1">
              <span className="bg-[#28A745] text-[#FFFFFF] px-4 py-2 rounded-lg text-2xl font-bold mb-2 shadow">WHY YOU SHOULD</span>
              <span className="bg-[#FFFFFF] text-[#0A2463] px-4 py-2 rounded-lg text-4xl font-extrabold mb-2 shadow">CHOOSE</span>
              <span className="bg-[#28A745] text-[#FFFFFF] px-4 py-2 rounded-lg text-2xl font-bold mb-2 shadow">OUR PLATFORM</span>
              <span className="text-[#FFFFFF] text-xs mt-4 tracking-widest">OUR ADVANTAGES</span>
            </div>
          </div>
        </div>
        {/* Right: Mission and Core Values */}
        <div className="flex-1">
          <div className="bg-[#F8F9FA] rounded-2xl shadow-2xl p-10 border border-[#0A2463] transition-transform duration-300 hover:scale-105">
            <h2 className="text-3xl font-extrabold text-[#0A2463] mb-4 flex items-center gap-2">Our Mission</h2>
            <p className="mb-6 text-[#212529] text-lg">To bridge the gap between education and industry by equipping students with cutting-edge knowledge, practical skills, and real-world experience through innovative programs and expert mentorship.</p>
            <h3 className="text-2xl font-bold text-[#0A2463] mb-2 mt-6">Core Values</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3"><span className="text-[#28A745] text-2xl">💡</span> <span className="text-[#212529]"><b>Innovation</b>: Pioneering creative solutions and future-ready approaches to education.</span></li>
              <li className="flex items-center gap-3"><span className="text-[#0A2463] text-2xl">🛡️</span> <span className="text-[#212529]"><b>Integrity</b>: Upholding trust, transparency and ethical practices in all we do.</span></li>
              <li className="flex items-center gap-3"><span className="text-[#FD7E14] text-2xl">🤝</span> <span className="text-[#212529]"><b>Collaboration</b>: Partnering with students, educators and industry for collective success.</span></li>
              <li className="flex items-center gap-3"><span className="text-[#28A745] text-2xl">🏆</span> <span className="text-[#212529]"><b>Excellence</b>: Committing to the highest standards in learning and innovation.</span></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Empowering Section */}
      <div className="text-center mt-16">
        <span className="inline-block bg-[#0A2463] text-[#FFFFFF] px-3 py-1 rounded-full text-base font-semibold mb-2">About STUDENT ERA</span>
        <h1 className="text-5xl font-extrabold text-[#0A2463] mb-4">Empowering Future Leaders</h1>
        <p className="text-2xl text-[#212529] max-w-2xl mx-auto font-medium">We create transformative learning experiences that bridge academia and industry, preparing students to excel in tomorrow's world.</p>
      </div>
      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-6 text-center border border-[#0A2463]">
          <Users className="w-12 h-12 text-[#0A2463] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#0A2463]">10,000+</h3>
          <p className="text-[#212529]">Students Trained</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-6 text-center border border-[#0A2463]">
          <Award className="w-12 h-12 text-[#28A745] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#0A2463]">500+</h3>
          <p className="text-[#212529]">Certificates Issued</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-6 text-center border border-[#0A2463]">
          <BookOpen className="w-12 h-12 text-[#FD7E14] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#0A2463]">50+</h3>
          <p className="text-[#212529]">Internship Programs</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-6 text-center border border-[#0A2463]">
          <Target className="w-12 h-12 text-[#0A2463] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[#0A2463]">95%</h3>
          <p className="text-[#212529]">Placement Rate</p>
        </div>
      </div>
      {/* Approach to Learning */}
      <div className="mt-20">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-[#0A2463]">Our Approach to Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-8 flex flex-col items-center border border-[#0A2463] group transition-transform duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-[#0A2463] rounded-full flex items-center justify-center mb-4">
              <span className="text-[#FFFFFF] text-3xl">💡</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-[#0A2463]">Innovative Learning</h3>
            <p className="text-[#212529] text-center text-lg">Our programs foster creativity and critical thinking through project-based learning, preparing students to lead with innovative solutions.</p>
          </div>
          <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-8 flex flex-col items-center border border-[#0A2463] group transition-transform duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-[#0A2463] rounded-full flex items-center justify-center mb-4">
              <span className="text-[#FFFFFF] text-3xl">🧠</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-[#0A2463]">Empowering Minds</h3>
            <p className="text-[#212529] text-center text-lg">We equip students with technical skills, problem-solving abilities, and the growth mindset needed to tackle real-world challenges.</p>
          </div>
          <div className="bg-[#F8F9FA] rounded-2xl shadow-xl p-8 flex flex-col items-center border border-[#0A2463] group transition-transform duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-[#0A2463] rounded-full flex items-center justify-center mb-4">
              <span className="text-[#FFFFFF] text-3xl">🚀</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-[#0A2463]">Future-Ready Students</h3>
            <p className="text-[#212529] text-center text-lg">Our curriculum evolves with industry trends, helping students adapt, innovate and succeed in an increasingly digital world.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About; 