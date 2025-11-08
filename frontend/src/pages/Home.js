import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import Header from "../components/Header";
import Footer from "../components/Footer";

import { Briefcase, ArrowRight, Server, Code, ShieldCheck, Megaphone, CheckCircle2 } from 'lucide-react';

const internshipCategories = [
  {
    title: "Web Development",
    desc: "Master modern web technologies while working on cutting-edge projects with industry experts.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    color: "blue",
  },
  {
    title: "Android Development",
    desc: "Build mobile applications using the latest Android frameworks and development tools.",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    color: "green",
  },
  {
    title: "Java Development",
    desc: "Develop enterprise-level applications using Java and popular frameworks like Spring.",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    color: "purple",
  },
  {
    title: "Python Development",
    desc: "Work with Python for web development, data analysis, automation, and more.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    color: "orange",
  },
  {
    title: "Graphics Design",
    desc: "Create visual concepts using industry-standard tools like Adobe Creative Suite.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    color: "red",
  },
  {
    title: "Data Analysis",
    desc: "Learn to analyze complex datasets and extract valuable business insights.",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    color: "teal",
  },
];

const features = [
  {
    icon: "⚡",
    title: "Innovative Approach",
    desc: "Modern strategies that foster critical thinking and problem-solving skills.",
    color: "blue-400",
  },
  {
    icon: "🤝",
    title: "Collaborative Learning",
    desc: "Teamwork-driven programs that enhance shared learning experiences.",
    color: "teal-400",
  },
  {
    icon: "🛠️",
    title: "Practical Experience",
    desc: "Hands-on learning that bridges theory with real-world application.",
    color: "purple-400",
  },
  {
    icon: "🎯",
    title: "Career Focused",
    desc: "Industry-aligned programs that prepare you for workplace success.",
    color: "indigo-400",
  },
];

const staticTestimonials = [
  {
    quote: "This was an amazing experience! I learned so much and built a real project that I could add to my portfolio. The mentorship was top-notch.",
    name: "Priya Sharma",
    role: "Full Stack Development Intern",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    quote: "The virtual internship was flexible and incredibly informative. I was able to land a job at a major tech company thanks to the skills I gained here.",
    name: "Rohan Gupta",
    role: "Data Science Intern",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    quote: "I highly recommend Student-Era to any student looking to get a head start in their tech career. The projects are challenging and relevant.",
    name: "Anjali Singh",
    role: "Cloud Computing Intern",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

// Helper to parse URLs in text and make them clickable
function parseMessageWithLinks(message) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = message.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-pink-200 hover:text-white font-semibold transition-colors duration-150"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

// Helper function for retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries || (error.code !== 'ECONNABORTED' && !error.message?.includes('timeout'))) {
                throw error;
            }
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

const AnnouncementBar = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const result = await retryWithBackoff(async () => {
                    const { data } = await api.get('/announcements');
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

    if (!show || announcements.length === 0) {
        return null;
    }

    // Join all announcement messages for a continuous marquee
    const marqueeText = announcements.map((a, i) =>
      i === 0
        ? (
            <span key={i} className="mr-8">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2 align-middle">NEW</span>
              {parseMessageWithLinks(a.message)}
            </span>
          )
        : (
            <span key={i} className="ml-8">
              {parseMessageWithLinks(a.message)}
            </span>
          )
    );

    return (
        <div className="bg-[#0A2463] shadow-lg">
            <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center overflow-hidden">
                        <span className="flex p-2 rounded-lg bg-white bg-opacity-10 mr-2 animate-pulse">
                            <Megaphone className="h-7 w-7 text-white" aria-hidden="true" />
                        </span>
                        <div className="ml-2 font-semibold text-lg whitespace-nowrap overflow-x-hidden w-full">
                            <span className="inline-block animate-marquee-smooth">
                                {marqueeText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes marquee-smooth {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-marquee-smooth {
                  display: inline-block;
                  min-width: 100%;
                  animation: marquee-smooth 18s linear infinite;
                }
            `}</style>
        </div>
    );
};

const HeroSection = () => (
  <div className="text-center py-24 px-4 sm:px-6 lg:px-8 bg-[#0A2463] text-white font-[Inter,sans-serif] shadow-2xl rounded-b-3xl relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463] via-[#1C1C1E] to-[#0A2463] opacity-50"></div>
    <div className="relative z-10">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
        Launch Your Tech Career with <span className="block text-[#28A745]">Student-Era</span>
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-xl sm:text-2xl text-[#F8F9FA] font-medium leading-relaxed">
        Gain real-world experience with our virtual internships. Work on live projects, get mentored by experts, and build a portfolio that stands out.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/internships" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-[#212529] bg-[#28A745] hover:bg-[#218838] shadow-lg transition-all duration-200 transform hover:scale-105">
          Browse Internships
        </Link>
        <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-[#212529] bg-[#FD7E14] hover:bg-[#E8680F] shadow-lg transition-all duration-200 transform hover:scale-105">
          Sign Up Now
        </Link>
      </div>
      <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-[#F8F9FA]">
        <div className="flex items-center">
          <CheckCircle2 className="w-5 h-5 text-[#28A745] mr-2" />
          <span>Verified Certificates</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-5 h-5 text-[#FD7E14] mr-2" />
          <span>Live Projects</span>
        </div>
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 text-[#0A84FF] mr-2" />
          <span>Expert Mentorship</span>
        </div>
      </div>
    </div>
  </div>
);

const CertifiedSection = () => (
  <div className="bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
    <div className="max-w-3xl w-full flex flex-col items-center text-center">
      <CheckCircle2 size={48} className="text-[#28A745] mb-2" />
      <h2 className="text-2xl sm:text-3xl font-bold text-[#212529] mb-2">Officially Certified & Recognized</h2>
      <p className="text-[#212529] text-lg max-w-2xl">
        Our accreditations reflect our commitment to quality education and compliance with national standards.
      </p>
    </div>
  </div>
);

const Feature = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 text-center">
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const FeaturesSection = () => (
  <div className="py-20 bg-[#F8F9FA] font-[Inter,sans-serif]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#0A2463] mb-2">Why Choose Us?</h2>
        <p className="mt-2 max-w-2xl mx-auto text-xl text-[#212529] font-semibold">We provide a structured path from learning to earning in the tech world.</p>
      </div>
      <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<div className="bg-[#0A2463] p-4 rounded-full shadow-lg"><Briefcase size={40} className="text-[#FFFFFF]" /></div>}
          title={<span className="font-bold text-[#212529]">Real-World Projects</span>}
          description={<span className="text-[#212529]">Work on industry-standard projects and gain hands-on experience that employers are looking for.</span>}
        />
        <Feature
          icon={<div className="bg-[#0A2463] p-4 rounded-full shadow-lg"><Server size={40} className="text-[#FFFFFF]" /></div>}
          title={<span className="font-bold text-[#212529]">Live Project Hosting</span>}
          description={<span className="text-[#212529]">We provide the hosting, so you can focus on building and showcasing your work to the world.</span>}
        />
        <Feature
          icon={<div className="bg-[#0A2463] p-4 rounded-full shadow-lg"><ShieldCheck size={40} className="text-[#FFFFFF]" /></div>}
          title={<span className="font-bold text-[#212529]">Verified Certificates</span>}
          description={<span className="text-[#212529]">Receive a verifiable certificate upon completion to boost your resume and LinkedIn profile.</span>}
        />
      </div>
    </div>
  </div>
);

const InternshipCard = ({ internship }) => (
    <div className="bg-[#F8F9FA] rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-[#0A2463] group flex flex-col">
        {internship.image && <img src={internship.image} alt={internship.title} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-extrabold text-[#0A2463] mb-2 font-sans">{internship.title}</h3>
            <p className="text-[#212529] mb-4 h-24 overflow-hidden flex-1 font-sans">{internship.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(internship.technologies) && internship.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="bg-[#0A2463] text-[#FFFFFF] text-xs font-semibold px-2.5 py-0.5 rounded-full">{tech}</span>
                ))}
            </div>
             <Link to={`/internships/${internship._id}`} className="font-semibold text-[#0A2463] hover:text-[#28A745] flex items-center mt-auto">
                View Details <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
        </div>
    </div>
);

const LatestInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const result = await retryWithBackoff(async () => {
                    const res = await api.get('/internships/public');
                    return res.data;
                });
                setInternships(result.data);
            } catch (err) {
                console.error('Error fetching internships:', err);
                setError('Failed to load internships.');
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    return (
        <div className="py-16 bg-[#FFFFFF] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-[#0A2463]">Latest Internships</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#212529]">
                        Apply now for our latest virtual internship programs.
                    </p>
                </div>

                {loading && <p className="text-center text-[#212529]">Loading internships...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {internships.length > 0 ? (
                            internships.map(internship => (
                                <InternshipCard key={internship._id} internship={internship} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-[#212529]">No open internships at the moment. Please check back later!</p>
                        )}
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
                    const { data } = await api.get('/testimonials');
                    return data;
                });
                setTestimonials(result.data);
                setLoading(false);
            } catch (error) {
                console.error("Could not fetch testimonials", error);
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const displayTestimonials = loading || testimonials.length === 0 ? staticTestimonials : testimonials;

    return (
        <div className="py-16 bg-[#F8F9FA] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-[#0A2463]">What Our Interns Say</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#212529]">
                        Real stories from students who have launched their careers with us.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {displayTestimonials.map((testimonial, index) => (
                        <div key={index} className="bg-[#FFFFFF] rounded-2xl shadow-xl p-8 group transition-transform duration-300 hover:scale-105 border border-[#0A2463]">
                            <p className="text-[#212529] mb-6 font-sans">"{testimonial.message || testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full mr-4" src={testimonial.image || testimonial.avatar || 'https://i.pravatar.cc/150'} alt={testimonial.name} />
                                <div>
                                    <p className="font-semibold text-[#0A2463] font-sans">{testimonial.name}</p>
                                    <p className="text-[#212529] text-sm font-sans">{testimonial.designation || testimonial.role}</p>
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
        <div className="bg-[#FFFFFF] font-sans">
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