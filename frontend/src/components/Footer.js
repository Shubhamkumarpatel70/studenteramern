import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaLinkedin, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import api from '../config/api';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: null,
    instagram: null,
    linkedin: null
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await api.get('/social-links', config);
      const links = res.data.data;

      const linksState = { whatsapp: null, instagram: null, linkedin: null };

      links.forEach(link => {
        if (link.isActive) {
          linksState[link.platform] = link.url;
        }
      });

      setSocialLinks(linksState);
    } catch (err) {
      console.error('Failed to fetch social links', err);
      setSocialLinks({
        instagram: 'https://www.instagram.com/officialstudentera',
        linkedin: 'https://www.linkedin.com/in/studentera'
      });
    }
  };

  const getWhatsAppUrl = () => {
    if (socialLinks.whatsapp) {
      if (socialLinks.whatsapp.includes('?text=')) return socialLinks.whatsapp;
      return `${socialLinks.whatsapp}${socialLinks.whatsapp.includes('?') ? '&' : '?'}text=Hi, I came across your website STUDENT ERA`;
    }
    return 'https://wa.me/919027880288?text=Hi, I came across your website STUDENT ERA';
  };

  return (
    <footer className="w-full bg-slate-900 text-gray-300 pt-16 pb-8 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800">

        {/* Brand & Mission */}
        <div>
          <div className="flex items-center mb-5 gap-3">
            <img src="/logo192.png" alt="Student Era Logo" className="w-10 h-10 rounded-full bg-white p-0.5" />
            <span className="text-xl font-extrabold text-white tracking-tight">Student Era</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Empowering students to bridge the gap between academic theory and real-world execution through verified virtual internships and professional training.
          </p>
          <div className="flex space-x-4">
            {socialLinks.whatsapp && (
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-400 transition-colors bg-slate-800 p-2.5 rounded-full hover:bg-slate-700">
                <FaWhatsapp className="h-5 w-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors bg-slate-800 p-2.5 rounded-full hover:bg-slate-700">
                <FaLinkedin className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors bg-slate-800 p-2.5 rounded-full hover:bg-slate-700">
                <FaInstagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-bold text-white text-base tracking-wide uppercase mb-5">Resources</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link to="/internships" className="hover:text-blue-400 transition-colors">Browse Internships</Link></li>
            <li><Link to="/verify-certificate" className="hover:text-blue-400 transition-colors">Verify Certificate</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ & Support</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold text-white text-base tracking-wide uppercase mb-5">Legal</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact info grid */}
        <div>
          <h3 className="font-bold text-white text-base tracking-wide uppercase mb-5">Get in Touch</h3>
          <p className="text-slate-400 text-sm mb-4">Have questions? Reach out to our support team.</p>
          <div className="space-y-4 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="h-4 w-4 text-slate-500 mt-1 shrink-0" />
              <span>
                +91- 90278 80288<br />
                <span className="text-slate-500 text-xs">Mon - Sat: 10 AM - 4 PM</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="h-4 w-4 text-slate-500 shrink-0" />
              <a href="mailto:contact.studentera@gmail.com" className="hover:text-white transition-colors truncate">
                contact.studentera@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} <span className="font-bold text-slate-300">Student Era</span>. All rights reserved.</p>
        <p>Verified Training & Internship Partner</p>
      </div>
    </footer>
  );
};

export default Footer;