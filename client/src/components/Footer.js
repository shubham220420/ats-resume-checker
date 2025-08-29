import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">ATS Resume Checker</h3>
                 <p className="text-sm text-gray-500">Resume Analysis Developed by <strong> Shubham Rakheja </strong></p>
              </div>
            </Link>
            <p className="text-gray-600 text-sm">
              Optimize your resume for ATS systems with our intelligent analysis tool. 
              Get detailed feedback and improvement suggestions powered by AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  View Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:b4mshubham@gmail.com" 
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Support</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Shubham220420/ats-resume-checker" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 ATS Resume Checker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 