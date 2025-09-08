import {
  Code,
  Github,
  Twitter,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Code Review Agent</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering developers with AI-driven code analysis and improvement
              suggestions. Write better, safer, and more maintainable code.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Rafiqdevhub"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>

              <a
                href="mailto:rafkhan9323@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/review"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Code Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Chat
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Performance
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Best Practices
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Have questions about our AI-powered code analysis?</p>
              <a
                href="mailto:support@codereviewagent.com"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 block"
              >
                rafkhan9323@gmail.com
              </a>
              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs">
                  © {currentYear} Code Review Agent. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <div className="flex space-x-6 mb-2 sm:mb-0">
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
            <div className="text-xs">Made with ❤️ for developers worldwide</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
