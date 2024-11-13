import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Car } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', tooltip: 'Demo Facebook Link' },
    { icon: Twitter, href: '#', label: 'Twitter', tooltip: 'Demo Twitter Link' },
    { icon: Instagram, href: '#', label: 'Instagram', tooltip: 'Demo Instagram Link' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', tooltip: 'Demo LinkedIn Link' },
    { icon: Youtube, href: '#', label: 'YouTube', tooltip: 'Demo YouTube Link' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">CasaDrive</span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium ride service in Luxembourg, connecting passengers with professional drivers for safe and comfortable journeys.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  onClick={() => alert('This is a demo link')}
                  className="text-gray-400 hover:text-white transition-colors group relative"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {social.tooltip}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <button 
                  onClick={() => alert('Demo: Privacy Policy page')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Demo: Terms of Service page')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>2 Rue du Fort Thüngen</li>
              <li>L-1499 Luxembourg</li>
              <li>Phone: +352 123 456 789</li>
              <li>Email: info@casadrive.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} CasaDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}