import React, { useEffect, useState } from "react";
import { FileText, Users, Shield, RefreshCw, Mail } from "lucide-react";
import Footer from "../components/Footer";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", icon: FileText },
  { id: "responsibilities", title: "2. User Responsibilities", icon: Users },
  { id: "privacy", title: "3. Privacy Policy", icon: Shield },
  { id: "changes", title: "4. Changes to Terms", icon: RefreshCw },
  { id: "contact", title: "5. Contact", icon: Mail }
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-indigo-800 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>

        {/* Table of Contents */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">Table of Contents</h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-300 hover:bg-indigo-100 hover:shadow-md ${
                  activeSection === id ? "bg-indigo-200 shadow-md" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span className="text-indigo-700 font-medium">{title}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-8">
          <section id="acceptance" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center space-x-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              By using <strong className="text-indigo-600">Student Era</strong>, you agree to these terms and conditions. Please read them carefully before using our services.
            </p>
          </section>

          <section id="responsibilities" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center space-x-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <span>2. User Responsibilities</span>
            </h2>
            <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
              <li>Provide <strong className="text-indigo-600">accurate and complete information</strong> during registration and application.</li>
              <li>Do not share your <strong className="text-indigo-600">account credentials</strong> with others.</li>
              <li>Respect <strong className="text-indigo-600">deadlines and guidelines</strong> for internships and tasks.</li>
            </ul>
          </section>

          <section id="privacy" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center space-x-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span>3. Privacy Policy</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We value your privacy. Your data will not be shared with third parties except as required by law or for service provision.
            </p>
          </section>

          <section id="changes" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center space-x-3">
              <RefreshCw className="h-8 w-8 text-indigo-600" />
              <span>4. Changes to Terms</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong className="text-indigo-600">Student Era</strong> reserves the right to update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.
            </p>
          </section>

          <section id="contact" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center space-x-3">
              <Mail className="h-8 w-8 text-indigo-600" />
              <span>5. Contact</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              For any questions, please <a href="/contact" className="text-indigo-600 underline hover:text-indigo-800 transition-colors duration-300 font-semibold">contact us</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
