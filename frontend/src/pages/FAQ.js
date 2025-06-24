import React, { useState } from "react";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "How do I apply for an internship?",
    answer: "Register and fill out your profile, then browse and apply for available internships."
  },
  {
    question: "Is there any fee?",
    answer: "No, Student Era is free for students."
  },
  {
    question: "How do I verify my certificate?",
    answer: "Use the Verify Certificate link in the navbar and enter your certificate details."
  },
  {
    question: "How do I contact support?",
    answer: "Use the Contact Us link in the footer or email us at contact.studentera@gmail.com."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-2xl w-full mt-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-700 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-lg overflow-hidden">
              <button
                className={`w-full text-left px-4 py-3 font-semibold text-lg focus:outline-none flex justify-between items-center ${openIndex === idx ? 'bg-indigo-100' : 'bg-white'}`}
                onClick={() => toggle(idx)}
                aria-expanded={openIndex === idx}
              >
                {faq.question}
                <span className={`ml-2 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === idx && (
                <div className="px-4 py-3 bg-indigo-50 text-gray-700 text-base animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ; 