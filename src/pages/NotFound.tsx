import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft, FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <FileX className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-white mb-3">
            Page Not Found
          </h2>

          <p className="text-gray-200 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>

          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-gray-300 mb-3">
              Looking for something specific?
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
            >
              <Search className="w-4 h-4 mr-1" />
              Browse our features
            </Link>
          </div>
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500/20 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default NotFound;
