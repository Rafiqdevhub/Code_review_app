import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { healthApi } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRateLimit } from "@/hooks/useRateLimit";
import {
  Code,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
  LogOut,
  Settings,
  Key,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RateLimitStatus } from "@/types/rateLimit";
import { ENV } from "@/config/environment";

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

const RateLimitIndicator = ({
  rateLimitStatus,
}: {
  rateLimitStatus: RateLimitStatus;
}) => {
  const getRateLimitConfig = () => {
    // Development mode indicator
    if (ENV.isDevelopment) {
      return {
        color: "bg-purple-500",
        text: "DEV",
        icon: <Zap className="h-4 w-4 text-purple-600" />,
        message: "Development Mode - Unlimited",
      };
    }

    if (rateLimitStatus.isLimited) {
      return {
        color: "bg-red-500",
        text: "Limit Exceeded",
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        message: "Please login for more requests",
      };
    }

    const percentage =
      (rateLimitStatus.remainingRequests / rateLimitStatus.totalRequests) * 100;

    if (percentage <= 20) {
      return {
        color: "bg-yellow-500",
        text: `${rateLimitStatus.remainingRequests} left`,
        icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
        message: "Running low on requests",
      };
    }

    return {
      color: "bg-green-500",
      text: `${rateLimitStatus.remainingRequests}/${rateLimitStatus.totalRequests}`,
      icon: <Zap className="h-4 w-4 text-green-600" />,
      message: `${rateLimitStatus.userType} limits`,
    };
  };

  const config = getRateLimitConfig();

  return (
    <div className="flex items-center space-x-2">
      {config.icon}
      <div className="hidden sm:block">
        <span className="text-sm font-medium">{config.text}</span>
        <span className="text-xs text-gray-500 ml-1">({config.message})</span>
      </div>
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
  const { user, isAuthenticated, logout } = useAuth();
  const { rateLimitStatus } = useRateLimit();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
            <RateLimitIndicator rateLimitStatus={rateLimitStatus} />

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/change-password")}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/review")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Code Review</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
