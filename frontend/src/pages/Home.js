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

const AnnouncementBar = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/announcements');
                if (data.data && data.data.length > 0) {
                    setAnnouncements(data.data);
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
              <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2 align-middle">NEW</span>
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
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-700 shadow-lg">
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
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600 text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Launch Your Tech Career with <span className="block text-indigo-200">Student-Era</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100">
            Gain real-world experience with our virtual internships. Work on live projects, get mentored by experts, and build a portfolio that stands out.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Link to="/internships" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Browse Internships
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400">
                Sign Up Now
            </Link>
        </div>
    </div>
);

const CertifiedSection = () => (
  <div className="bg-green-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
    <div className="max-w-3xl w-full flex flex-col items-center text-center">
      <CheckCircle2 size={48} className="text-green-600 mb-2" />
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Officially Certified & Recognized</h2>
      <p className="text-gray-700 text-lg max-w-2xl">
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
    <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                    We provide a structured path from learning to earning in the tech world.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Feature
                    icon={<Briefcase size={32} />}
                    title="Real-World Projects"
                    description="Work on industry-standard projects and gain hands-on experience that employers are looking for."
                />
                <Feature
                    icon={<Server size={32} />}
                    title="Live Project Hosting"
                    description="We provide the hosting, so you can focus on building and showcasing your work to the world."
                />
                <Feature
                    icon={<ShieldCheck size={32} />}
                    title="Verified Certificates"
                    description="Receive a verifiable certificate upon completion to boost your resume and LinkedIn profile."
                />
            </div>
        </div>
    </div>
);

const InternshipCard = ({ internship }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
        {internship.image && <img src={internship.image} alt={internship.title} className="h-40 w-full object-cover" />}
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{internship.title}</h3>
            <p className="text-gray-600 mb-4 h-24 overflow-hidden flex-1">{internship.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(internship.technologies) && internship.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tech}</span>
                ))}
            </div>
             <Link to={`/internships/${internship._id}`} className="font-semibold text-indigo-600 hover:text-indigo-500 flex items-center mt-auto">
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
                const res = await api.get('/internships/public');
                setInternships(res.data.data);
            } catch (err) {
                setError('Could not fetch internships at the moment. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);
    
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Latest Internships</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Apply now for our latest virtual internship programs.
                    </p>
                </div>

                {loading && <p className="text-center">Loading internships...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                {!loading && !error && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {internships.length > 0 ? (
                            internships.map(internship => (
                                <InternshipCard key={internship._id} internship={internship} />
                            ))
                        ) : (
                            <p className="text-center col-span-full">No open internships at the moment. Please check back later!</p>
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
                const { data } = await api.get('/testimonials');
                setTestimonials(data.data);
            } catch (error) {
                console.error("Could not fetch testimonials", error);
                // Keep the static testimonials as a fallback
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const displayTestimonials = loading || testimonials.length === 0 ? staticTestimonials : testimonials;

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">What Our Interns Say</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Real stories from students who have launched their careers with us.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {displayTestimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-8">
                            <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full mr-4" src={testimonial.avatar || 'https://i.pravatar.cc/150'} alt={testimonial.name} />
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-indigo-600 text-sm">{testimonial.role}</p>
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
        <div className="bg-white">
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