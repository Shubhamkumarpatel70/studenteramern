import React, { useState } from "react";
import { UserIcon, EnvelopeIcon, ChatBubbleLeftIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch('/api/contact-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-6xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-indigo-800 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <p className="text-center text-gray-600 text-xl mb-8">
              Have a question or need help? Fill out the form below and our team will get back to you soon.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg transition-all duration-300"
                  required
                  aria-label="Your Name"
                />
              </div>

              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg transition-all duration-300"
                  required
                  aria-label="Your Email"
                />
              </div>

              <div className="relative">
                <ChatBubbleLeftIcon className="absolute left-4 top-4 h-6 w-6 text-indigo-400" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-lg min-h-[140px] transition-all duration-300 resize-none"
                  required
                  aria-label="Your Message"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl shadow-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>

            {status === "success" && (
              <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-800 text-center font-bold text-lg animate-pulse">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {status === "error" && (
              <div className="mt-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-800 text-center font-bold text-lg animate-pulse">
                Something went wrong. Please try again later.
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg">
                <EnvelopeIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-1">Email</h3>
                  <p className="text-gray-700 text-lg">contact.studentera@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg">
                <PhoneIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-1">Phone</h3>
                  <p className="text-gray-700 text-lg">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg">
                <MapPinIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-1">Address</h3>
                  <p className="text-gray-700 text-lg">123 Student Street<br />Education City, EC 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg">
                <ClockIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-1">Business Hours</h3>
                  <p className="text-gray-700 text-lg">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
