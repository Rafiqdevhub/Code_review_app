import {
  Upload,
  BarChart3,
  Rocket,
  Users,
  FileText,
  Shield,
  TrendingUp,
  Code,
  Brain,
  Zap,
} from "lucide-react";
export const gettingStartedSteps = [
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Upload Your Code",
    description:
      "Drag & drop files or paste code directly into our advanced editor with syntax highlighting",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    hoverColor: "hover:bg-blue-200",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes your code for quality, security, performance, and maintainability",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    hoverColor: "hover:bg-purple-200",
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Implement & Deploy",
    description:
      "Get actionable insights, chat with AI assistant, and ship better code faster than ever",
    color: "text-green-600",
    bgColor: "bg-green-100",
    hoverColor: "hover:bg-green-200",
  },
];

export const stats = [
  { icon: <Users className="h-6 w-6" />, value: "50K+", label: "Developers" },
  {
    icon: <FileText className="h-6 w-6" />,
    value: "1M+",
    label: "Code Reviews",
  },
  { icon: <Shield className="h-6 w-6" />, value: "99.9%", label: "Accuracy" },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    value: "40%",
    label: "Faster Development",
  },
];

export const features = [
  {
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    title: "AI Chat Assistant",
    description:
      "Interactive AI assistant for code explanations and improvement suggestions",
    capabilities: [
      "Natural language code explanations",
      "Personalized best practices",
      "Intelligent refactoring suggestions",
      "Learning-based recommendations",
    ],
    color: "purple-500",
    bgColor: "purple-50",
  },
  {
    icon: <Code className="h-8 w-8 text-blue-600" />,
    title: "Smart Code Analysis",
    description:
      "Advanced static analysis with AI-powered insights for multiple programming languages",
    capabilities: [
      "Multi-language syntax validation",
      "Performance optimization suggestions",
      "Code complexity analysis",
      "Real-time error detection",
    ],
    color: "blue-500",
    bgColor: "blue-50",
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Security Scanning",
    description:
      "Comprehensive security vulnerability detection and mitigation suggestions",
    capabilities: [
      "CVE database integration",
      "OWASP compliance checking",
      "Dependency vulnerability scanning",
      "Security best practices enforcement",
    ],
    color: "green-500",
    bgColor: "green-50",
  },

  {
    icon: <Zap className="h-8 w-8 text-yellow-600" />,
    title: "Real-time Feedback",
    description:
      "Instant code quality metrics and actionable improvement recommendations",
    capabilities: [
      "Live quality metrics",
      "Priority-based issue ranking",
      "Progress tracking dashboard",
      "Team collaboration insights",
    ],
    color: "yellow-500",
    bgColor: "yellow-50",
  },
];
