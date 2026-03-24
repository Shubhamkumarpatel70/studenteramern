import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";
import AuthContext from "../context/AuthContext";
import Footer from "../components/Footer";

import {
  Briefcase,
  ArrowRight,
  Server,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  CheckCircle,
  FileText,
  Star
} from "lucide-react";

// --- Data ---
const staticTestimonials = [
  {
    quote: "This was an amazing experience! I learned so much and built a real project that I could add to my portfolio. The mentorship was top-notch.",
    name: "Ranjeet Kumar",
    role: "Python Developer",
  },
  {
    quote: "Working on modern stacks allowed me to easily bridge the gap between academia and the real tech industry. Highly recommended for students.",
    name: "Azaz Alam",
    role: "Graphics Design Intern",
  },
  {
    quote: "I highly recommend Student-Era to any student looking to get a head start. The structured layout and expert support is unparalleled.",
    name: "Gulshan Kumar",
    role: "Web Developer",
  },
];

// --- Helpers ---
function parseMessageWithLinks(message) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = message.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-blue-200 hover:text-white transition-colors duration-150">
          {part}
        </a>
      );
    }
    return part;
  });
}

const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries || (error.code !== "ECONNABORTED" && !error.message?.includes("timeout"))) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// --- Components ---
const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const result = await retryWithBackoff(async () => {
          const { data } = await api.get("/announcements");
          return data;
        });
        if (result.data && result.data.length > 0) {
          setAnnouncements(result.data);
        }
      } catch (error) {
        console.error("Could not fetch announcements", error);
      }
    };
    fetchAnnouncements();
  }, []);

  if (!show || announcements.length === 0) return null;

  const marqueeText = announcements.map((a, i) => (
    <span key={i} className={i === 0 ? "mr-12" : "ml-12"}>
      <span className="bg-white text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mr-3 align-middle shadow-sm">
        New Update
      </span>
      {parseMessageWithLinks(a.message)}
    </span>
  ));

  return (
    <div className="bg-indigo-600 text-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto py-2.5 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center">
        <span className="flex-shrink-0 mr-3 animate-pulse opacity-80">
          <Megaphone className="h-4 w-4" />
        </span>
        <div className="w-full overflow-hidden text-sm font-medium tracking-wide">
          <span className="inline-block animate-[marquee-smooth_20s_linear_infinite] whitespace-nowrap">
            {marqueeText}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes marquee-smooth {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

const HeroSection = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
      {/* Subtle modern background gradient mesh */}
      <div className="absolute top-0 inset-x-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 mb-6 uppercase tracking-wider">
          <Briefcase className="h-3.5 w-3.5" /> Virtual Internships Active
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Launch Your Tech Career with <span className="text-blue-600 block sm:inline">Student-Era</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Gain real-world experience through premium virtual internships. Work on live projects, collaborate with experts, and build a verified portfolio.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/internships"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gray-300 text-base font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              Create Free Account
            </Link>
          )}
          <Link
            to="/verify-certificate"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 text-base font-semibold rounded-lg text-gray-600 bg-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Verify Credential
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gray-400" />
            <span>Industry Standard Tech</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <span>Verified Certification</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span>Expert Curated Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertifiedSection = () => (
  <div className="bg-white py-12 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
      <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Officially Recognized Organization
      </h2>
      <p className="text-gray-500 text-sm max-w-xl">
        All certificates issued by Student Era meet high compliance standards, giving you a verifiable credential to display on LinkedIn and resumes.
      </p>
    </div>
  </div>
);

const Feature = ({ icon, title, description }) => (
  <div className="bg-white flex flex-col items-start p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-blue-50 text-blue-600 rounded-lg p-3 mb-5 border border-blue-100">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection = () => (
  <div className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          A Better Way to Build Your Portfolio
        </h2>
        <p className="text-lg text-gray-500">
          Our platform bridges the gap between academic theory and real-world execution. Here's what you get when you join our internship programs.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<Briefcase className="h-6 w-6" />}
          title="Real-World Execution"
          description="Complete standardized deliverables simulating exact workflows expected by top tech employers today."
        />
        <Feature
          icon={<Server className="h-6 w-6" />}
          title="Live Project Deployment"
          description="We guide you on deploying your frontend and backend so your work exists live on the internet."
        />
        <Feature
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Verifiable Credentials"
          description="Each completed internship grants a unique cryptographic certificate easily verifiable by HR teams."
        />
      </div>
    </div>
  </div>
);

const InternshipCard = ({ internship }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:border-blue-300 transition-colors shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
        {internship.title}
      </h3>
      {internship.tag && (
        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200 shrink-0 ml-3">
          {internship.tag}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3 leading-relaxed">
      {internship.shortDescription || internship.description}
    </p>
    {Array.isArray(internship.technologies) && (
      <div className="flex flex-wrap gap-1.5 mb-6">
        {internship.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded border border-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
    <div className="pt-4 border-t border-gray-100 mt-auto">
      <Link
        to={`/internships/${internship._id}`}
        className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        View Details <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </div>
  </div>
);

const LatestInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const result = await retryWithBackoff(async () => {
          const res = await api.get("/internships/public");
          return res.data;
        });
        setInternships(result.data);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to load internships.");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  return (
    <div className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Open Internship Programs
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Select a learning track tailored to modern tech stacks.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && <div className="text-center text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships.length > 0 ? (
              internships.map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))
            ) : (
              <div className="col-span-full text-center p-12 bg-gray-50 border border-gray-200 rounded-xl">
                <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No Openings Currently</h3>
                <p className="text-gray-500 mt-1">Please check back later for new batches.</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && internships.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/internships" className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 text-sm font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              View All Programs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await retryWithBackoff(async () => {
          const { data } = await api.get("/testimonials");
          return data;
        });
        setTestimonials(result.data);
      } catch (error) {
        console.error("Could not fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const displayTestimonials = loading || testimonials.length === 0 ? staticTestimonials : testimonials;

  return (
    <div className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Hear from Our Students
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Real success stories from developers who built their careers here.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.message || testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full border border-gray-200 bg-gray-100 object-cover"
                  src={testimonial.image || testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f3f4f6&color=111827`}
                  alt={testimonial.name}
                />
                <div className="ml-3">
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.designation || testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="bg-white font-sans text-gray-900 border-t-0">
      <AnnouncementBar />
      <HeroSection />
      <CertifiedSection />
      <FeaturesSection />
      <LatestInternships />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;
