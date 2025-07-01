import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { healthApi } from "@/services/api";
import {
  Code,
  Shield,
  Brain,
  Zap,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Upload,
  Play,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiStatus {
  status: "online" | "offline" | "loading";
  responseTime: number;
  lastCheck: Date;
  version?: string;
  endpoints?: string[];
}

const Home = () => {
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

  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Smart Code Analysis",
      description:
        "Advanced static analysis with AI-powered insights for multiple programming languages",
      capabilities: [
        "Syntax validation",
        "Performance optimization",
        "Code complexity analysis",
      ],
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Security Scanning",
      description:
        "Comprehensive security vulnerability detection and mitigation suggestions",
      capabilities: [
        "CVE detection",
        "OWASP compliance",
        "Dependency scanning",
      ],
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI Chat Assistant",
      description:
        "Interactive AI assistant for code explanations and improvement suggestions",
      capabilities: [
        "Code explanations",
        "Best practices",
        "Refactoring suggestions",
      ],
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Real-time Feedback",
      description:
        "Instant code quality metrics and actionable improvement recommendations",
      capabilities: [
        "Quality metrics",
        "Issue prioritization",
        "Progress tracking",
      ],
    },
  ];

  const gettingStartedSteps = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Your Code",
      description: "Drag & drop files or paste code directly into our editor",
    },
    {
      icon: <Play className="h-6 w-6" />,
      title: "Run Analysis",
      description:
        "Our AI analyzes your code for quality, security, and performance",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Chat & Improve",
      description:
        "Discuss findings with our AI assistant and implement suggestions",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Code with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant code reviews, security analysis, and intelligent
            suggestions. Our AI-powered platform helps you write better, safer,
            and more maintainable code.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/review">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <FileText className="mr-2 h-5 w-5" />
                Start Code Review
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                Real-time status of our AI analysis services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Code Analysis API
                    </span>
                    <StatusIndicator
                      status={apiStatus.status}
                      responseTime={apiStatus.responseTime}
                    />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        apiStatus.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } w-full`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Security Scanner
                    </span>
                    <StatusIndicator
                      status={apiStatus.status}
                      responseTime={apiStatus.responseTime + 50}
                    />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        apiStatus.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } w-full`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Chat Service</span>
                    <StatusIndicator
                      status={apiStatus.status}
                      responseTime={apiStatus.responseTime + 100}
                    />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        apiStatus.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } w-full`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Last updated: {apiStatus.lastCheck.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need for comprehensive code analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div
                        key={capIndex}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">
                          {capability}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started
            </h3>
            <p className="text-lg text-gray-600">
              Start improving your code in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingStartedSteps.map((step, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex justify-center mb-2">
                    <Badge
                      variant="secondary"
                      className="text-lg font-semibold"
                    >
                      Step {index + 1}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/review">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Start Your First Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold">Code Review Agent</h4>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering developers with AI-driven code analysis and improvement
            suggestions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
