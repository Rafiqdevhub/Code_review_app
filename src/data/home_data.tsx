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
  Clock,
  Award,
  Sparkles,
  CheckCircle,
  Star,
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

export const stats = [
  {
    value: "10K+",
    label: "Developers",
    color: "text-blue-400",
  },
  {
    value: "1M+",
    label: "Code Reviews",
    color: "text-green-400",
  },
  {
    value: "99.9%",
    label: "Uptime",
    color: "text-purple-400",
  },
];

export const benefits = [
  {
    icon: <Clock className="h-8 w-8 text-blue-400" />,
    title: "50% Faster Reviews",
    description:
      "AI-powered code analysis completes reviews in minutes, not hours",
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-400/30",
  },
  {
    icon: <Shield className="h-8 w-8 text-green-400" />,
    title: "Enhanced Security",
    description:
      "Catch vulnerabilities and security issues before they reach production",
    color: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-400/30",
  },
  {
    icon: <Award className="h-8 w-8 text-purple-400" />,
    title: "Code Quality",
    description:
      "Maintain consistent coding standards and best practices automatically",
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-400/30",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
    title: "AI Learning",
    description:
      "Continuously improves recommendations based on your coding patterns",
    color: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-400/30",
  },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Full-Stack Developer",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
    review:
      "Codify has revolutionized our code review process. The AI suggestions are incredibly accurate and have helped us catch critical bugs before they reach production.",
    highlight: "Reduced our bug rate by 60%",
  },
  {
    name: "Marcus Rodriguez",
    role: "Lead Backend Engineer",
    company: "StartupXYZ",
    avatar: "MR",
    rating: 5,
    review:
      "The security analysis feature is a game-changer. It caught vulnerabilities that our entire security team missed. Absolutely essential for modern development.",
    highlight: "Found 15+ security vulnerabilities",
  },
  {
    name: "Emily Watson",
    role: "DevOps Engineer",
    company: "CloudTech",
    avatar: "EW",
    rating: 5,
    review:
      "Integration was seamless and the AI chat feature helps our junior developers learn best practices. The platform pays for itself in developer productivity.",
    highlight: "30% faster code reviews",
  },
];

export const ctaItems = [
  {
    value: "14-Day",
    subtitle: "Free Trial",
    color: "text-yellow-400",
  },
  {
    value: "No",
    subtitle: "Credit Card Required",
    color: "text-green-400",
  },
  {
    value: "24/7",
    subtitle: "AI Support",
    color: "text-blue-400",
  },
];
