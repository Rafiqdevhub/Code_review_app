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
  Mail,
  Send,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative">
        {config.icon}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 ${config.color} rounded-full ${config.ringColor} ring-2 animate-pulse`}
        />
      </div>
      <div className="hidden sm:block">
        <span className="text-sm font-medium text-gray-200">{config.text}</span>
        {status === "online" && (
          <span className="text-xs text-gray-300 ml-1">({responseTime}ms)</span>
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
        icon: <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />,
        message: "Development Mode - Unlimited",
        bgColor: "bg-purple-500/10",
      };
    }

    if (rateLimitStatus.isLimited) {
      return {
        color: "bg-red-500",
        ringColor: "ring-red-200",
        text: "Limit Exceeded",
        icon: <Shield className="h-4 w-4 text-red-400" />,
        message: "Please login for more requests",
        bgColor: "bg-red-500/10",
      };
    }

    const percentage =
      (rateLimitStatus.remainingRequests / rateLimitStatus.totalRequests) * 100;

    if (percentage <= 20) {
      return {
        color: "bg-amber-500",
        ringColor: "ring-amber-200",
        text: `${rateLimitStatus.remainingRequests} left`,
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        message: "Running low on requests",
        bgColor: "bg-amber-500/10",
      };
    }

    return {
      color: "bg-emerald-500",
      ringColor: "ring-emerald-200",
      text: `${rateLimitStatus.remainingRequests}/${rateLimitStatus.totalRequests}`,
      icon: <Activity className="h-4 w-4 text-emerald-400" />,
      message: `${rateLimitStatus.userType} limits`,
      bgColor: "bg-emerald-500/10",
    };
  };

  const config = getRateLimitConfig();

  return (
    <div
      className={`flex items-center space-x-3 ${config.bgColor} backdrop-blur-sm rounded-full px-3 py-2 border border-white/10 shadow-sm hover:shadow-md transition-all duration-300`}
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
        <span className="text-sm font-medium text-gray-200">{config.text}</span>
        <span className="text-xs text-gray-300 ml-1">({config.message})</span>
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the contact form data to your backend
      console.log("Contact form submitted:", contactForm);

      // Reset form and close modal
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsContactModalOpen(false);

      // You could show a success toast here
      alert("Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
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
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
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
                <h1 className="text-3xl font-bold text-white hover:text-blue-300 transition-all duration-300">
                  Codify
                </h1>
                <p className="text-sm text-gray-300 font-medium">
                  AI-Powered Code Analysis Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog
                open={isContactModalOpen}
                onOpenChange={setIsContactModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-xl font-bold text-white">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <span>Contact Us</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Have questions or feedback? We'd love to hear from you!
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-gray-200">
                          Name
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="Your name"
                          value={contactForm.name}
                          onChange={(e) =>
                            handleContactInputChange("name", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="contact-email"
                          className="text-gray-200"
                        >
                          Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="your@email.com"
                          value={contactForm.email}
                          onChange={(e) =>
                            handleContactInputChange("email", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-subject"
                        className="text-gray-200"
                      >
                        Subject
                      </Label>
                      <Input
                        id="contact-subject"
                        type="text"
                        placeholder="What's this about?"
                        value={contactForm.subject}
                        onChange={(e) =>
                          handleContactInputChange("subject", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-message"
                        className="text-gray-200"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Tell us more..."
                        value={contactForm.message}
                        onChange={(e) =>
                          handleContactInputChange("message", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsContactModalOpen(false)}
                        className="bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <StatusIndicator
                status={apiStatus.status}
                responseTime={apiStatus.responseTime}
              />
              <RateLimitIndicator rateLimitStatus={rateLimitStatus} />

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden xl:block text-right">
                    <p className="text-sm font-medium text-gray-200">Welcome</p>
                    <p className="text-sm text-gray-300">{user.name}</p>
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
                      className="w-64 bg-gray-800 backdrop-blur-sm border-white/20 shadow-xl text-white"
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
                              <p className="text-sm font-medium leading-none text-white">
                                {user.name}
                              </p>
                              <p className="text-xs leading-none text-gray-300 mt-1">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-blue-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <User className="mr-3 h-4 w-4 text-blue-400" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/change-password")}
                        className="hover:bg-purple-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <Key className="mr-3 h-4 w-4 text-purple-400" />
                        <span>Change Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/review")}
                        className="hover:bg-indigo-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <Settings className="mr-3 h-4 w-4 text-indigo-400" />
                        <span>Code Review</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-700 transition-colors text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-400" />
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
                      className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
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
                  <h1 className="text-xl font-bold text-white">Codify</h1>
                </div>
              </div>{" "}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 pb-3 border-b border-white/20">
              <StatusIndicator
                status={apiStatus.status}
                responseTime={apiStatus.responseTime}
              />
              <RateLimitIndicator rateLimitStatus={rateLimitStatus} />
            </div>

            {isMobileMenuOpen && (
              <div className="border-t border-white/20 bg-gray-800/90 backdrop-blur-sm">
                <div className="px-4 py-4 space-y-4">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-300">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <User className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-200">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/change-password");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Key className="h-5 w-5 text-purple-400" />
                          <span className="text-gray-200">Change Password</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/review");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Settings className="h-5 w-5 text-indigo-400" />
                          <span className="text-gray-200">Code Review</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsContactModalOpen(true);
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-200">Contact</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-red-700 transition-colors text-red-400"
                        >
                          <LogOut className="h-5 w-5 text-red-400" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={closeMobileMenu}>
                        <Button
                          variant="ghost"
                          className="w-full text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          setIsContactModalOpen(true);
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center justify-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-gray-200"
                      >
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span>Contact</span>
                      </button>
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

        <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-400 opacity-50" />
      </div>
    </header>
  );
};

export default Header;
