import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';
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
      // Try to get token for admin view, but also allow public access
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {};
      
      const res = await api.get('/social-links', config);
      const links = res.data.data;
      
      const linksState = {
        whatsapp: null,
        instagram: null,
        linkedin: null
      };
      
      links.forEach(link => {
        if (link.isActive) {
          linksState[link.platform] = link.url;
        }
      });
      
      setSocialLinks(linksState);
    } catch (err) {
      console.error('Failed to fetch social links', err);
      // Fallback to default links if API fails
      setSocialLinks({
        instagram: 'https://www.instagram.com/officialstudentera',
        linkedin: 'https://www.linkedin.com/in/studentera?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
      });
    }
  };

  const getWhatsAppUrl = () => {
    if (socialLinks.whatsapp) {
      // If URL already has text parameter, use it; otherwise add the message
      if (socialLinks.whatsapp.includes('?text=')) {
        return socialLinks.whatsapp;
      }
      return `${socialLinks.whatsapp}${socialLinks.whatsapp.includes('?') ? '&' : '?'}text=Hi, I am come across your website`;
    }
    // Fallback
    return 'https://wa.me/919027880288?text=Hi, I am come across your website';
  };

  return (
  <footer className="w-full bg-[#0A2463] text-[#FFFFFF] pt-12 pb-4 font-[Inter,sans-serif] font-semibold transition-all duration-300">
    <div className="max-w-7xl mx-auto px-4 md:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#F8F9FA]">
      {/* About */}
      <div>
        <div className="flex items-center mb-4">
          <img src="/logo192.png" alt="Student Era Logo" className="w-12 h-12 rounded-full bg-[#FFFFFF] mr-3 shadow-md" />
          <span className="text-2xl font-extrabold text-[#FFFFFF] tracking-tight">Student Era</span>
        </div>
        <p className="text-[#F8F9FA]">Student Era is dedicated to helping students find internships, job opportunities, and career growth paths. We provide internships along with professional training to equip students with the necessary skills for their career journey. Join us and start your journey today.</p>
      </div>
      {/* Useful Links */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-[#FFFFFF]">Useful Links</h3>
        <ul className="space-y-2">
          <li><Link to="/about" className="hover:underline hover:text-[#28A745] transition-colors">Know About Us</Link></li>
          <li><Link to="/faq" className="hover:underline hover:text-[#28A745] transition-colors">FAQ & Help</Link></li>
          <li><Link to="/terms" className="hover:underline hover:text-[#28A745] transition-colors">Terms & Conditions</Link></li>
          <li><Link to="/privacy" className="hover:underline hover:text-[#28A745] transition-colors">Privacy Policy</Link></li>
          <li><Link to="/refund" className="hover:underline hover:text-[#28A745] transition-colors">Refund Policy</Link></li>
          <li><Link to="/contact" className="hover:underline hover:text-[#28A745] transition-colors">Contact Us</Link></li>
          <li><Link to="/dashboard/feedback" className="hover:underline hover:text-[#28A745] transition-colors">Feedback</Link></li>
        </ul>
      </div>
      {/* Connect with Us */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-[#FFFFFF]">Connect with Us</h3>
        <p className="mb-4 text-[#F8F9FA]">Follow us on social media for updates and news.</p>
        <div className="flex space-x-4 text-2xl">
          {socialLinks.whatsapp && (
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-[#25D366] transition-transform duration-200 hover:scale-110"><FaWhatsapp /></a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#0A66C2] transition-transform duration-200 hover:scale-110"><FaLinkedin /></a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E4405F] transition-transform duration-200 hover:scale-110"><FaInstagram /></a>
          )}
        </div>
      </div>
      {/* Contact Us */}
      <div>
        <h3 className="font-bold text-xl mb-4 text-[#FFFFFF]">Contact Us</h3>
        <p className="mb-2 text-[#F8F9FA]">Have any questions? Feel free to reach out to us for more information.</p>
        <div className="flex items-center mb-2"><span className="text-2xl mr-2">📞</span> <span>+91- 90278 80288<br/>(Monday - Saturday) 10 AM - 4 PM</span></div>
        <div className="flex items-center"><span className="text-2xl mr-2">✉️</span> <span>contact.studentera@gmail.com</span></div>
      </div>
    </div>
    <div className="text-center text-[#F8F9FA] text-sm pt-4 px-4 md:px-16">
      © {new Date().getFullYear()} <span className="font-semibold text-[#FFFFFF]">Student Era</span>. All rights reserved. Made with ❤️ for <span className="font-semibold text-[#FFFFFF]">Students</span>
    </div>
  </footer>
  );
};

export default Footer; 