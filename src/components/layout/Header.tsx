import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { healthApi } from "@/services/api";
import {
  Code,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiStatus {
  status: "online" | "offline" | "loading";
  responseTime: number;
  lastCheck: Date;
  version?: string;
  endpoints?: string[];
}

const StatusIndicator = ({
  status,
  responseTime,
}: {
  status: ApiStatus["status"];
  responseTime: number;
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          color: "bg-green-500",
          text: "Online",
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        };
      case "offline":
        return {
          color: "bg-red-500",
          text: "Offline",
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        };
      default:
        return {
          color: "bg-yellow-500",
          text: "Checking...",
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
      {status === "online" && (
        <span className="text-xs text-gray-500">({responseTime}ms)</span>
      )}
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
    </div>
  );
};

const Header = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: "loading",
    responseTime: 0,
    lastCheck: new Date(),
  });

  useEffect(() => {
    // Check API status on component mount
    const checkApiStatus = async () => {
      const start = Date.now();
      try {
        const response = await healthApi.checkStatus();
        const responseTime = Date.now() - start;

        setApiStatus({
          status: "online",
          responseTime,
          lastCheck: new Date(),
          version: response.version,
          endpoints: response.endpoints,
        });
      } catch (error) {
        console.error("API status check failed:", error);
        const responseTime = Date.now() - start;

        setApiStatus({
          status: "offline",
          responseTime,
          lastCheck: new Date(),
        });
      }
    };

    checkApiStatus();

    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                Code Review Agent
              </h1>
              <p className="text-sm text-gray-600">
                AI-Powered Code Analysis Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <StatusIndicator
              status={apiStatus.status}
              responseTime={apiStatus.responseTime}
            />
            <Link to="/review">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
