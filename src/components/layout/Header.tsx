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
  Sparkles,
  Activity,
  Shield,
  Menu,
  X,
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
          color: "bg-emerald-500",
          ringColor: "ring-emerald-200",
          text: "Online",
          icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
        };
      case "offline":
        return {
          color: "bg-red-500",
          ringColor: "ring-red-200",
          text: "Offline",
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        };
      default:
        return {
          color: "bg-amber-500",
          ringColor: "ring-amber-200",
          text: "Checking...",
          icon: <Clock className="h-4 w-4 text-amber-600" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative">
        {config.icon}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 ${config.color} rounded-full ${config.ringColor} ring-2 animate-pulse`}
        />
      </div>
      <div className="hidden sm:block">
        <span className="text-sm font-medium text-gray-700">{config.text}</span>
        {status === "online" && (
          <span className="text-xs text-gray-500 ml-1">({responseTime}ms)</span>
        )}
      </div>
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
        ringColor: "ring-purple-200",
        text: "DEV",
        icon: <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />,
        message: "Development Mode - Unlimited",
        bgColor: "bg-purple-50",
      };
    }

    if (rateLimitStatus.isLimited) {
      return {
        color: "bg-red-500",
        ringColor: "ring-red-200",
        text: "Limit Exceeded",
        icon: <Shield className="h-4 w-4 text-red-600" />,
        message: "Please login for more requests",
        bgColor: "bg-red-50",
      };
    }

    const percentage =
      (rateLimitStatus.remainingRequests / rateLimitStatus.totalRequests) * 100;

    if (percentage <= 20) {
      return {
        color: "bg-amber-500",
        ringColor: "ring-amber-200",
        text: `${rateLimitStatus.remainingRequests} left`,
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        message: "Running low on requests",
        bgColor: "bg-amber-50",
      };
    }

    return {
      color: "bg-emerald-500",
      ringColor: "ring-emerald-200",
      text: `${rateLimitStatus.remainingRequests}/${rateLimitStatus.totalRequests}`,
      icon: <Activity className="h-4 w-4 text-emerald-600" />,
      message: `${rateLimitStatus.userType} limits`,
      bgColor: "bg-emerald-50",
    };
  };

  const config = getRateLimitConfig();

  return (
    <div
      className={`flex items-center space-x-3 ${config.bgColor} backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="relative">
        {config.icon}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 ${
            config.color
          } rounded-full ${config.ringColor} ring-2 ${
            ENV.isDevelopment ? "animate-pulse" : ""
          }`}
        />
      </div>
      <div className="hidden sm:block">
        <span className="text-sm font-medium text-gray-700">{config.text}</span>
        <span className="text-xs text-gray-500 ml-1">({config.message})</span>
      </div>
    </div>
  );
};

const Header = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: "loading",
    responseTime: 0,
    lastCheck: new Date(),
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { rateLimitStatus } = useRateLimit();
  const navigate = useNavigate();

  useEffect(() => {
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

    // Check API status every 1 minute
    const interval = setInterval(checkApiStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
    <header className="relative">
      <div className="bg-white backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img
                    src="/codify.png"
                    alt="Codify Logo - AI-Powered Code Analysis Platform"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
              <div className="group">
                <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300">
                  Codify
                </h1>
                <p className="text-sm text-gray-600 font-medium">
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
                <div className="flex items-center space-x-4">
                  <div className="hidden xl:block text-right">
                    <p className="text-sm font-medium text-gray-700">Welcome</p>
                    <p className="text-sm text-gray-500">{user.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-transparent text-white font-bold">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-white backdrop-blur-sm border-gray-200 shadow-xl"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs leading-none text-gray-500 mt-1">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200" />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <User className="mr-3 h-4 w-4 text-blue-600" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/change-password")}
                        className="hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <Key className="mr-3 h-4 w-4 text-purple-600" />
                        <span>Change Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/review")}
                        className="hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <Settings className="mr-3 h-4 w-4 text-indigo-600" />
                        <span>Code Review</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-50 transition-colors text-red-700 cursor-pointer"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-600 " />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img
                      src="/codify.png"
                      alt="Codify Logo"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-600">Codify</h1>
                </div>
              </div>{" "}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 pb-3 border-b border-gray-100">
              <StatusIndicator
                status={apiStatus.status}
                responseTime={apiStatus.responseTime}
              />
              <RateLimitIndicator rateLimitStatus={rateLimitStatus} />
            </div>

            {isMobileMenuOpen && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="px-4 py-4 space-y-4">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/change-password");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <Key className="h-5 w-5 text-purple-600" />
                          <span className="text-gray-700">Change Password</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/review");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <Settings className="h-5 w-5 text-indigo-600" />
                          <span className="text-gray-700">Code Review</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-red-50 transition-colors text-red-700"
                        >
                          <LogOut className="h-5 w-5 text-red-600" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={closeMobileMenu}>
                        <Button
                          variant="ghost"
                          className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link to="/register" onClick={closeMobileMenu}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 opacity-50" />
      </div>
    </header>
  );
};

export default Header;
