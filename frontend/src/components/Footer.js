import React from "react";
import { FaWhatsapp, FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';

const Footer = () => (
  <footer className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-gray-200 pt-12 pb-4 px-4 md:px-16 font-sans transition-all duration-300">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-300 dark:border-gray-700">
      {/* About */}
      <div>
        <div className="flex items-center mb-4">
          <img src="/logo192.png" alt="Student Era Logo" className="w-12 h-12 rounded-full bg-white mr-3 shadow-md" />
          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">Student Era</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Student Era is dedicated to helping students find internships, job opportunities, and career growth paths. We provide internships along with professional training to equip students with the necessary skills for their career journey. Join us and start your journey today.</p>
      </div>
      {/* Useful Links */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-indigo-700">Useful Links</h3>
        <ul className="space-y-2">
          <li><a href="/about" className="hover:underline hover:text-indigo-500 transition-colors">Know About Us</a></li>
          <li><a href="/faq" className="hover:underline hover:text-indigo-500 transition-colors">FAQ & Help</a></li>
          <li><a href="/terms" className="hover:underline hover:text-indigo-500 transition-colors">Terms & Conditions</a></li>
          <li><a href="/contact" className="hover:underline hover:text-indigo-500 transition-colors">Contact Us</a></li>
        </ul>
      </div>
      {/* Connect with Us */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-indigo-700">Connect with Us</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Follow us on social media for updates and news.</p>
        <div className="flex space-x-4 text-2xl">
          <a href="#" aria-label="WhatsApp" className="hover:text-green-400 transition-transform duration-200 hover:scale-110"><FaWhatsapp /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition-transform duration-200 hover:scale-110"><FaLinkedin /></a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition-transform duration-200 hover:scale-110"><FaInstagram /></a>
          <a href="#" aria-label="Telegram" className="hover:text-blue-300 transition-transform duration-200 hover:scale-110"><FaTelegram /></a>
        </div>
      </div>
      {/* Contact Us */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-indigo-700">Contact Us</h3>
        <p className="mb-2 text-gray-600 dark:text-gray-300">Have any questions? Feel free to reach out to us for more information.</p>
        <div className="flex items-center mb-2"><span className="text-2xl mr-2">📞</span> <span>+91- 90278 80288<br/>(Monday - Saturday) 10 AM - 6 PM</span></div>
        <div className="flex items-center"><span className="text-2xl mr-2">✉️</span> <span>contact.studentera@gmail.com</span></div>
      </div>
    </div>
    <div className="text-center text-gray-400 text-sm pt-4">
      © {new Date().getFullYear()} <span className="font-semibold text-indigo-700">Student Era</span>. All rights reserved.
    </div>
  </footer>
);

export default Footer; 