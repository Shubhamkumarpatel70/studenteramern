import React, { useState, useMemo } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon, BriefcaseIcon, CurrencyDollarIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "How do I apply for an internship?",
    answer: "Register and fill out your profile, then browse and apply for available internships.",
    icon: BriefcaseIcon
  },
  {
    question: "Is there any fee?",
    answer: "No, Student Era is free for students.",
    icon: CurrencyDollarIcon
  },
  {
    question: "How do I verify my certificate?",
    answer: "Use the Verify Certificate link in the navbar and enter your certificate details.",
    icon: ShieldCheckIcon
  },
  {
    question: "How do I contact support?",
    answer: "Use the Contact Us link in the footer or email us at contact.studentera@gmail.com.",
    icon: ChatBubbleLeftRightIcon
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggle = idx => setOpenIndex(openIndex === idx ? null : idx);

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-indigo-800 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-xl transition-all duration-300"
            aria-label="Search FAQs"
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((faq, idx) => {
            const IconComponent = faq.icon;
            return (
              <div key={idx} className="border-2 border-indigo-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <button
                  className={`w-full text-left px-6 py-5 font-bold text-xl focus:outline-none flex justify-between items-center transition-all duration-300 ${
                    openIndex === idx ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800' : 'bg-white text-gray-800 hover:bg-indigo-50'
                  }`}
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="flex items-center space-x-4">
                    <IconComponent className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDownIcon className={`h-6 w-6 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 text-lg leading-relaxed animate-fade-in border-t border-indigo-100"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No FAQs found matching your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
