import React, { useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-lg w-full mt-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-6">Have a question or need help? Fill out the form below and our team will get back to you soon.</p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg min-h-[120px]"
            required
          />
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-lg shadow-lg font-semibold hover:scale-105 transition text-lg" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
        {status === "success" && (
          <div className="mt-4 text-green-700 text-center font-semibold">Thank you! Your message has been sent.</div>
        )}
        {status === "error" && (
          <div className="mt-4 text-red-600 text-center font-semibold">Something went wrong. Please try again later.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Contact; 