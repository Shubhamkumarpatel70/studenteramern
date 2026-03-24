import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Users, Award, BookOpen, Target, MessageCircle, Lightbulb, ShieldCheck, Handshake, Sparkles } from "lucide-react";
import api from "../config/api";

const About = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    studentsTrained: 1000,
    certificatesIssued: 100,
    internshipTracks: 5,
    successRate: 95
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/public-stats');
        if (res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load public stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <div className="text-center mb-16 sm:mb-24">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 mb-4 uppercase tracking-wider">
            About Student Era
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Empowering Future Leaders
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            We create transformative learning experiences that bridge the gap between academia and the tech industry, preparing you to excel in tomorrow's world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Mission */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 lg:p-12 h-full flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To bridge the gap between education and industry by equipping
              students with cutting-edge knowledge, practical skills, and
              real-world experience through structured internship programs and
              expert mentorship.
            </p>
          </div>

          {/* Right: Core Values */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
              Core Values
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 shrink-0 border border-blue-100 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Innovation</h4>
                  <p className="text-gray-600">Pioneering creative solutions and future-ready approaches to tech education.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-600 shrink-0 border border-slate-200 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Integrity</h4>
                  <p className="text-gray-600">Upholding absolute trust, transparency, and ethical practices in our certifications.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-green-50 p-2.5 rounded-lg text-green-600 shrink-0 border border-green-100 mt-0.5">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Collaboration</h4>
                  <p className="text-gray-600">Partnering with students, educators, and industry leaders for collective success.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 shrink-0 border border-indigo-100 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Excellence</h4>
                  <p className="text-gray-600">Committing to the absolute highest standards in deliverables and platform quality.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 flex flex-col items-center justify-center">
            <Users className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.studentsTrained}+</h3>
            <p className="text-gray-500 font-medium text-sm">Students Trained</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 flex flex-col items-center justify-center">
            <Award className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.certificatesIssued}+</h3>
            <p className="text-gray-500 font-medium text-sm">Certificates Issued</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 flex flex-col items-center justify-center">
            <BookOpen className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.internshipTracks}+</h3>
            <p className="text-gray-500 font-medium text-sm">Internship Tracks</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200 flex flex-col items-center justify-center">
            <Target className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.successRate}%</h3>
            <p className="text-gray-500 font-medium text-sm">Success Rate</p>
          </div>
        </div>

        {/* Approach to Learning */}
        <div className="mt-24 sm:mt-32">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Our Pedagogical Approach
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              We focus on building strong foundations, backed by real, deployable projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Innovative Learning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our programs foster creativity and critical thinking through
                project-based learning, preparing you to lead with innovative solutions in production environments.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Empowering Minds
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We equip students with technical skills, problem-solving
                abilities, and the growth mindset needed to tackle highly complex
                architectural challenges.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10 border border-gray-200 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 border border-green-100">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Future-Ready Output
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our curriculum evolves with industry trends, directly addressing the tech stack demands of modern SaaS organizations.
              </p>
            </div>
          </div>
        </div>

        {/* Certifications & Recognition */}
        <div className="mt-24 sm:mt-32">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Officially Recognized By
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 border border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24">
            <div className="flex flex-col items-center">
              <img src="/msme.png" alt="MSME Registered" className="h-20 sm:h-24 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
              <p className="mt-4 text-gray-500 font-semibold text-sm tracking-wide uppercase">MSME Certified</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/startup india.png" alt="Startup India Registered" className="h-20 sm:h-24 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
              <p className="mt-4 text-gray-500 font-semibold text-sm tracking-wide uppercase">Startup India</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-24 sm:mt-32">
          <div className="bg-blue-600 rounded-2xl shadow-lg p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>

            <div className="relative z-10">
              <MessageCircle className="w-12 h-12 text-white/90 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to accelerate your career?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
                Get in touch with us for any queries, support, or collaboration
                opportunities. Our technical team is ready to assist you.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="bg-white text-blue-600 px-8 py-3.5 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reach Out Today
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
