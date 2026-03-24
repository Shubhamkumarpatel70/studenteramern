import React, { useEffect, useState } from "react";
import { FileText, Users, Shield, RefreshCw, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
  { id: "responsibilities", title: "User Responsibilities", icon: Users },
  { id: "privacy", title: "Privacy Policy", icon: Shield },
  { id: "changes", title: "Changes to Terms", icon: RefreshCw },
  { id: "contact", title: "Contact", icon: Mail }
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
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
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8">

        {/* Sidebar Navigation */}
        <div className="lg:w-1/3 hidden lg:block">
          <div className="sticky top-24 bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map(({ id, title, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${activeSection === id
                      ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 mr-3 ${activeSection === id ? "text-primary" : "text-gray-400"}`} />
                    <span>{title}</span>
                  </div>
                  {activeSection === id && <ChevronRight className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden w-full bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map(({ id, title }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${activeSection === id
                    ? "bg-primary text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-2/3 bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-8 md:p-10">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600">
              Please read these terms and conditions carefully before using our platform. Your use of Student Era indicates your acceptance of these terms.
            </p>
          </div>

          <div className="space-y-12">
            <section id="acceptance" className="scroll-mt-28">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-11">
                By using <strong className="text-gray-900">Student Era</strong>, you agree to these terms and conditions. If you do not agree with any part of these terms, please refrain from using our services.
              </p>
            </section>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <section id="responsibilities" className="scroll-mt-28">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. User Responsibilities</h2>
              </div>
              <ul className="list-disc pl-16 text-gray-600 leading-relaxed space-y-3 marker:text-primary">
                <li>Provide <strong className="text-gray-900">accurate and complete information</strong> during registration and application.</li>
                <li>Maintain the confidentiality and do not share your <strong className="text-gray-900">account credentials</strong> with others.</li>
                <li>Respect and adhere to the <strong className="text-gray-900">deadlines and guidelines</strong> provided for internships and associated tasks.</li>
                <li>Engage professionally with other users, administrators, and provided resources.</li>
              </ul>
            </section>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <section id="privacy" className="scroll-mt-28">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Privacy Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-11">
                We deeply value your privacy. Your data will not be shared with third parties except as required by law or to directly facilitate the services you request. For detailed information, please review our comprehensive <Link to="/privacy" className="text-primary hover:text-primary-dark font-medium underline underline-offset-4">Privacy Policy</Link>.
              </p>
            </section>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <section id="changes" className="scroll-mt-28">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Changes to Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-11">
                <strong className="text-gray-900">Student Era</strong> reserves the right to consistently update and modify these terms at any time. We will notify users of significant changes, but your continued use of the platform constitutes your full acceptance of the new terms.
              </p>
            </section>

            <div className="w-full h-[1px] bg-gray-100"></div>

            <section id="contact" className="scroll-mt-28">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Contact</h2>
              </div>
              <p className="text-gray-600 leading-relaxed pl-11">
                For any questions or clarification regarding these Terms & Conditions, please <Link to="/contact" className="text-primary hover:text-primary-dark font-medium underline underline-offset-4">contact us</Link>. We are here to help and ensure you have a transparent experience on our platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
