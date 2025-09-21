import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
} from "lucide-react";

interface BestPracticesProps {
  code: string;
  language: string;
  isAnalyzing: boolean;
}

interface Suggestion {
  type: "good" | "warning" | "info" | "tip";
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const BestPractices: React.FC<BestPracticesProps> = ({
  code,
  language,
  isAnalyzing,
}) => {
  const generateSuggestions = (): Suggestion[] => {
    if (!code.trim()) return [];

    const suggestions: Suggestion[] = [];

    // Code structure analysis
    if (
      code.includes("function") ||
      code.includes("const") ||
      code.includes("let")
    ) {
      suggestions.push({
        type: "good",
        title: "Good Function Usage",
        description:
          "Functions are properly defined. Consider using const for function expressions.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }

    // Variable naming
    if (/[a-zA-Z_][a-zA-Z0-9_]*/.test(code)) {
      suggestions.push({
        type: "tip",
        title: "Naming Convention",
        description:
          "Use descriptive variable names and follow camelCase convention for JavaScript.",
        icon: <Lightbulb className="h-4 w-4" />,
      });
    }

    // Comments
    if (code.includes("//") || code.includes("/*")) {
      suggestions.push({
        type: "good",
        title: "Documentation Present",
        description: "Great! Comments help explain complex logic.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } else if (code.length > 200) {
      suggestions.push({
        type: "warning",
        title: "Missing Comments",
        description:
          "Consider adding comments to explain complex logic or business rules.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    // Error handling
    if (code.includes("try") && code.includes("catch")) {
      suggestions.push({
        type: "good",
        title: "Error Handling",
        description: "Excellent error handling with try-catch blocks.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } else if (code.includes("fetch") || code.includes("async")) {
      suggestions.push({
        type: "warning",
        title: "Consider Error Handling",
        description: "Async operations should include proper error handling.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    // Security considerations
    if (code.includes("eval(") || code.includes("innerHTML")) {
      suggestions.push({
        type: "warning",
        title: "Security Concern",
        description:
          "Avoid using eval() or innerHTML with user input to prevent XSS attacks.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    // Performance tips
    if (code.includes("for") && code.includes("length")) {
      suggestions.push({
        type: "tip",
        title: "Performance Tip",
        description:
          "Cache array length in loops: for(let i=0, len=arr.length; i<len; i++)",
        icon: <Target className="h-4 w-4" />,
      });
    }

    // React specific
    if (code.includes("useState") || code.includes("useEffect")) {
      suggestions.push({
        type: "good",
        title: "React Hooks Usage",
        description:
          "Using React hooks properly. Remember dependency arrays in useEffect.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }

    // TypeScript specific
    if (
      code.includes("interface") ||
      code.includes(": string") ||
      code.includes(": number")
    ) {
      suggestions.push({
        type: "good",
        title: "TypeScript Types",
        description:
          "Great use of TypeScript types for better code reliability.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }

    // General best practices
    suggestions.push({
      type: "info",
      title: "Code Organization",
      description:
        "Consider breaking large functions into smaller, reusable components.",
      icon: <Info className="h-4 w-4" />,
    });

    return suggestions;
  };

  const suggestions = generateSuggestions();

  const getSuggestionStyles = (type: string) => {
    const styles = {
      good: "bg-green-900/20 border-green-800/50 text-green-300",
      warning: "bg-yellow-900/20 border-yellow-800/50 text-yellow-300",
      info: "bg-blue-900/20 border-blue-800/50 text-blue-300",
      tip: "bg-purple-900/20 border-purple-800/50 text-purple-300",
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  const getIconColor = (type: string) => {
    const colors = {
      good: "text-green-400",
      warning: "text-yellow-400",
      info: "text-blue-400",
      tip: "text-purple-400",
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Best Practices</h2>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-full mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-semibold text-white">Best Practices</h2>
      </div>

      {!code.trim() ? (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">
            Enter code to receive personalized suggestions
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSuggestionStyles(
                suggestion.type
              )}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 ${getIconColor(suggestion.type)}`}>
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm opacity-90">{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* General Tips */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h3 className="text-sm font-medium text-gray-200 mb-3">
              General Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Keep functions small and focused on a single task</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Use consistent indentation and formatting</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Write tests for critical functionality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>Follow the DRY principle (Don't Repeat Yourself)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
