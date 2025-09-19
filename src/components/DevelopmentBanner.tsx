import React from "react";
import { Code2, Settings } from "lucide-react";
import { ENV } from "@/config/environment";

const DevelopmentBanner: React.FC = () => {
  // Only show in development mode
  if (!ENV.isDevelopment) {
    return null;
  }

  const isMockMode = import.meta.env.VITE_MOCK_API === "true";

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-sm">
        <Code2 className="h-4 w-4" />
        <span className="font-medium">Development Mode</span>
        <span className="opacity-80">•</span>
        <span className="opacity-90">Rate limiting disabled</span>
        {isMockMode ? (
          <>
            <span className="opacity-80">•</span>
            <span className="opacity-90">Mock API enabled</span>
          </>
        ) : (
          <>
            <span className="opacity-80">•</span>
            <span className="opacity-90">Real backend connected</span>
          </>
        )}
        <span className="opacity-80">•</span>
        <span className="opacity-90">Debug logging enabled</span>
        <Settings className="h-4 w-4 ml-2" />
      </div>
    </div>
  );
};

export default DevelopmentBanner;
