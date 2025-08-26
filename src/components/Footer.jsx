import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">ShopEase</h2>
          <p className="text-sm">© 2025 ShopEase. All rights reserved.</p>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/about" className="hover:text-white">
            About Us
          </a>
          <a href="/services" className="hover:text-white">
            Services
          </a>
          <a href="/contact" className="hover:text-white">
            Contact
          </a>
          <a href="/privacy" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
        <div className="flex space-x-6">
          <a
            href="https://www.instagram.com/the_grrrls_club?igsh=YWFybzVzNWtrZTB0"
            className="text-gray-400 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://facebook.com"
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <FaFacebook size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
