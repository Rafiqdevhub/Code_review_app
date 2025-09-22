import {
  Code,
  Github,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  Zap,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative group">
                  <div className="p-2 sm:p-3 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Code className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Codify
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-400 font-medium">
                    AI-Powered Platform
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Empowering developers with AI-driven code analysis and
                improvement suggestions. Write better, safer, and more
                maintainable code.
              </p>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <a
                  href="https://github.com/Rafiqdevhub"
                  className="group p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-105"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <a
                  href="mailto:rafkhan9323@gmail.com"
                  className="group p-2 sm:p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-105"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                <button
                  onClick={scrollToTop}
                  className="group p-2 sm:p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-300 hover:scale-105"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 relative">
                  Features
                  <div className="absolute -bottom-2 left-0 w-6 sm:w-8 h-0.5 bg-blue-500"></div>
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  <li>
                    <Link
                      to="/review"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <div className="p-1 bg-slate-800 group-hover:bg-blue-600 rounded-md mr-2 sm:mr-3 transition-colors duration-300">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="flex-1">Code Analysis</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <div className="p-1 bg-slate-800 group-hover:bg-blue-600 rounded-md mr-2 sm:mr-3 transition-colors duration-300">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="flex-1">AI Chat</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <div className="p-1 bg-slate-800 group-hover:bg-blue-600 rounded-md mr-2 sm:mr-3 transition-colors duration-300">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="flex-1">Security Scan</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <div className="p-1 bg-slate-800 group-hover:bg-blue-600 rounded-md mr-2 sm:mr-3 transition-colors duration-300">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span className="flex-1">Performance</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 relative">
                  Resources
                  <div className="absolute -bottom-2 left-0 w-6 sm:w-8 h-0.5 bg-blue-500"></div>
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <span className="w-2 h-2 bg-slate-600 group-hover:bg-blue-500 rounded-full mr-2 sm:mr-3 transition-colors"></span>
                      <span className="flex-1">Documentation</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <span className="w-2 h-2 bg-slate-600 group-hover:bg-blue-500 rounded-full mr-2 sm:mr-3 transition-colors"></span>
                      <span className="flex-1">API Reference</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <span className="w-2 h-2 bg-slate-600 group-hover:bg-blue-500 rounded-full mr-2 sm:mr-3 transition-colors"></span>
                      <span className="flex-1">Best Practices</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                    >
                      <span className="w-2 h-2 bg-slate-600 group-hover:bg-blue-500 rounded-full mr-2 sm:mr-3 transition-colors"></span>
                      <span className="flex-1">Support</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 mb-2 sm:mb-0"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 mb-2 sm:mb-0"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 mb-2 sm:mb-0"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
