import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  Award,
  Clock,
  Rocket,
} from "lucide-react";
import { stats, features, gettingStartedSteps } from "@/data/home_data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { rateLimitStatus, checkRateLimit } = useRateLimit();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Animate elements on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cycle through features automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check rate limits when component mounts
  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  // Handle rate limit redirection for guests
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;

    // Skip rate limit redirection in development mode
    if (isDevelopment) {
      console.log("🚀 Development Mode: Skipping rate limit redirection");
      return;
    }

    if (!isAuthenticated && rateLimitStatus.isLimited) {
      navigate("/login", {
        state: {
          rateLimitExceeded: true,
          message:
            "Rate limit exceeded. Please login to continue with higher limits.",
        },
        replace: true,
      });
    }
  }, [isAuthenticated, rateLimitStatus.isLimited, navigate]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      {/* Hero Section with Advanced Design */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Platform
              </Badge>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Code with
              <span className="text-blue-400 block mt-2">AI Intelligence</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of code development with our AI-powered
              platform. Get instant reviews, security analysis, and intelligent
              suggestions that help you write{" "}
              <span className="font-semibold text-blue-400">better</span>,
              <span className="font-semibold text-green-400"> safer</span>, and
              <span className="font-semibold text-purple-400">
                {" "}
                more maintainable
              </span>{" "}
              code.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/review">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  Start Code Review
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/60 text-white hover:bg-white/20 hover:text-wh px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                >
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Chat with AI
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-white/20 hover:bg-white/15 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="flex justify-center mb-3 text-blue-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-900">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-purple-600 text-white px-6 py-3 shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                Powerful Features
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="text-purple-400 block mt-2">
                Code Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Comprehensive tools and AI-powered insights to elevate your
              development workflow
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 border border-white/20 bg-white/10 backdrop-blur-xl hover:scale-105 cursor-pointer overflow-hidden relative shadow-xl hover:bg-white/15 ${
                  activeFeature === index
                    ? "ring-4 ring-blue-400 ring-opacity-50"
                    : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`absolute inset-0 bg-${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-2xl bg-${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      {React.cloneElement(feature.icon, {
                        className: "h-8 w-8 text-white",
                      })}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-3 text-white group-hover:text-gray-100">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-200 leading-relaxed group-hover:text-gray-100">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-3">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div
                        key={capIndex}
                        className="flex items-center space-x-3 group/item"
                      >
                        <div className="p-1 rounded-full bg-green-500/20 group-hover:bg-green-400/30 transition-colors border border-green-400/50">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                        </div>
                        <span className="text-gray-200 font-medium group/item-hover:text-white transition-colors">
                          {capability}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="ghost"
                      className="w-full hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned Getting Started Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 text-sm font-medium shadow-lg">
                <Rocket className="w-4 h-4 mr-2" />
                Getting Started
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your Journey in
              <span className="text-yellow-400 block mt-2">
                Three Simple Steps
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transform your development workflow with our intuitive platform
              designed for developers of all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingStartedSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl group shadow-xl hover:border-white/30"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`relative p-6 ${step.bgColor} ${step.hoverColor} rounded-3xl transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}
                    >
                      {React.cloneElement(step.icon, {
                        className: `h-8 w-8 ${step.color}`,
                      })}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white mb-4 group-hover:text-yellow-200 transition-colors">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-200 leading-relaxed group-hover:text-gray-100">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/review">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-10 py-4 text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Target className="mr-3 h-6 w-6" />
                Start Your First Review
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-gray-200">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-colors">
                <Clock className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">Setup in 2 minutes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-colors">
                <Shield className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Enterprise secure</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-colors">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">
                  Trusted by 50K+ developers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
