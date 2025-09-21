import React from "react";
import {
  AlertTriangle,
  Shield,
  Bug,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface AnalysisResults {
  summary: {
    score: number;
    issues: number;
    suggestions: number;
    securityIssues: number;
  };
  issues: Array<{
    id: string;
    severity: "high" | "medium" | "low";
    type: "security" | "performance" | "style" | "bug";
    title: string;
    description: string;
    line: number;
    suggestion: string;
  }>;
  metrics: {
    complexity: number;
    maintainability: number;
    testCoverage: number;
    performance: number;
  };
  security: {
    vulnerabilities: Array<{
      id: string;
      severity: "critical" | "high" | "medium" | "low";
      title: string;
      description: string;
      recommendation: string;
    }>;
    score: number;
  };
}

interface ResultsDisplayProps {
  results: AnalysisResults;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <AlertCircle className="h-4 w-4" />;
      case "low":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />;
      case "performance":
        return <Zap className="h-4 w-4" />;
      case "style":
        return <Target className="h-4 w-4" />;
      case "bug":
        return <Bug className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-400";
    if (score >= 60) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Analysis Summary</span>
          </CardTitle>
          <CardDescription className="text-gray-200">
            Overall code quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.summary.score
                )}`}
              >
                {results.summary.score}
              </div>
              <div className="text-sm text-gray-300">Overall Score</div>
              <Progress value={results.summary.score} className="mt-2" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-white">
                  {results.summary.issues}
                </div>
                <div className="text-sm text-gray-300">Issues Found</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-2xl font-bold text-white">
                  {results.summary.suggestions}
                </div>
                <div className="text-sm text-gray-300">Suggestions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardContent className="p-0">
          <Tabs defaultValue="issues" className="w-full">
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
                <TabsTrigger
                  value="issues"
                  className="text-gray-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="metrics"
                  className="text-gray-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Metrics
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="text-gray-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Issues Tab */}
            <TabsContent value="issues" className="p-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Code Issues
                  </h3>
                  <Badge variant="secondary">
                    {results.issues.length} total
                  </Badge>
                </div>

                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {results.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(issue.type)}
                            <h4 className="font-medium text-white">
                              {issue.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={getSeverityColor(issue.severity)}
                              className="text-xs"
                            >
                              {getSeverityIcon(issue.severity)}
                              <span className="ml-1">{issue.severity}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Line {issue.line}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-2">
                          {issue.description}
                        </p>

                        <div className="p-2 bg-blue-900/20 border border-blue-800/50 rounded text-xs">
                          <strong className="text-blue-300">Suggestion:</strong>
                          <span className="text-blue-200 ml-1">
                            {issue.suggestion}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="p-6 pt-4">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Code Quality Metrics
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-200">
                        Complexity
                      </span>
                      <span className="text-sm text-gray-300">
                        {results.metrics.complexity}/10
                      </span>
                    </div>
                    <Progress value={results.metrics.complexity * 10} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-200">
                        Maintainability
                      </span>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          results.metrics.maintainability
                        )}`}
                      >
                        {results.metrics.maintainability}%
                      </span>
                    </div>
                    <Progress value={results.metrics.maintainability} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-200">
                        Test Coverage
                      </span>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          results.metrics.testCoverage
                        )}`}
                      >
                        {results.metrics.testCoverage}%
                      </span>
                    </div>
                    <Progress value={results.metrics.testCoverage} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-200">
                        Performance
                      </span>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          results.metrics.performance
                        )}`}
                      >
                        {results.metrics.performance}%
                      </span>
                    </div>
                    <Progress value={results.metrics.performance} />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <h4 className="font-medium text-white mb-2">
                    Recommendations
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {results.metrics.testCoverage < 70 && (
                      <li>• Increase test coverage to at least 70%</li>
                    )}
                    {results.metrics.complexity > 7 && (
                      <li>• Consider breaking down complex functions</li>
                    )}
                    {results.metrics.maintainability < 80 && (
                      <li>• Improve code documentation and structure</li>
                    )}
                    {results.metrics.performance < 80 && (
                      <li>• Optimize performance bottlenecks</li>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-6 pt-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Security Analysis
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span
                      className={`font-bold ${getScoreColor(
                        results.security.score
                      )}`}
                    >
                      {results.security.score}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-200">
                      Security Score
                    </span>
                    <span
                      className={`text-sm font-semibold ${getScoreColor(
                        results.security.score
                      )}`}
                    >
                      {results.security.score}%
                    </span>
                  </div>
                  <Progress value={results.security.score} />
                </div>

                {results.security.vulnerabilities.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">
                      Vulnerabilities Found
                    </h4>
                    <ScrollArea className="h-60">
                      <div className="space-y-3">
                        {results.security.vulnerabilities.map((vuln) => (
                          <div
                            key={vuln.id}
                            className="p-4 border border-red-800/50 bg-red-900/20 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-red-300">
                                {vuln.title}
                              </h5>
                              <Badge
                                variant={getSeverityColor(vuln.severity)}
                                className="text-xs"
                              >
                                {getSeverityIcon(vuln.severity)}
                                <span className="ml-1">{vuln.severity}</span>
                              </Badge>
                            </div>

                            <p className="text-sm text-red-300 mb-2">
                              {vuln.description}
                            </p>

                            <div className="p-2 bg-white/10 border border-red-800/50 rounded text-xs">
                              <strong className="text-red-300">
                                Recommendation:
                              </strong>
                              <span className="text-red-200 ml-1">
                                {vuln.recommendation}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h4 className="font-medium text-white mb-2">
                      No Security Issues Found
                    </h4>
                    <p className="text-sm text-gray-300">
                      Your code appears to be secure!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
