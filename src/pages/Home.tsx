import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Shield,
  Brain,
  Zap,
  FileText,
  MessageSquare,
  CheckCircle,
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Home = () => {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Code with
            <span className="text-blue-600"> AI Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant code reviews, security analysis, and intelligent
            suggestions. Our AI-powered platform helps you write better, safer,
            and more maintainable code.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/review">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Your First Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
