import React, { useState, useEffect } from "react";
import { FileUpload, CodeFile } from "@/components/FileUpload";
import { CodeAnalysis } from "@/components/CodeAnalysis";
import { BestPractices } from "@/components/BestPractices";
import { CodeEditor } from "@/components/CodeEditor";
import { ResultsDisplay, AnalysisResults } from "@/components/ResultsDisplay";
import { codeAnalysisApi, isApiError, isRateLimitError } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import {
  Code,
  Settings,
  Play,
  ArrowLeft,
  Save,
  Share,
  AlertTriangle,
  Mail,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuth } from "@/hooks/useAuth";

const CodeReview = () => {
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [fileName, setFileName] = useState("untitled");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);

  const { rateLimitStatus, checkRateLimit } = useRateLimit();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  // Error handling state
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    type: "rate_limit" | "network" | "server" | "unknown";
    title: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    type: "unknown",
    title: "",
    message: "",
  });

  const handleFileUpload = (files: CodeFile[]) => {
    setCodeFiles(files);
    if (files.length > 0) {
      setActiveFile(files[0]);
      setManualCode("");
    }
  };

  const handleCodeChange = (code: string) => {
    setManualCode(code);
    if (code.trim()) {
      setCodeFiles([]);
      setActiveFile(null);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);

    try {
      let results: AnalysisResults;

      if (codeFiles.length > 0) {
        const files = codeFiles.map((codeFile) => {
          const file = new File([codeFile.content], codeFile.name, {
            type: "text/plain",
          });
          return file;
        });

        results = await codeAnalysisApi.analyzeFiles(files);

        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${codeFiles.length} file(s).`,
        });
      } else if (manualCode.trim()) {
        results = await codeAnalysisApi.analyzeText({
          code: manualCode,
          filename: `${fileName}.${getFileExtension(selectedLanguage)}`,
        });

        toast({
          title: "Analysis Complete",
          description: "Successfully analyzed your code.",
        });
      } else {
        toast({
          title: "No Code to Analyze",
          description: "Please upload files or enter code manually.",
          variant: "destructive",
        });
        return;
      }

      setAnalysisResults(results);
    } catch (error) {
      console.error("Analysis failed:", error);

      // Handle different types of errors
      if (isRateLimitError(error)) {
        // Show modal for rate limit errors
        setErrorDialog({
          isOpen: true,
          type: "rate_limit",
          title: "Daily Limit Reached",
          message:
            "You have reached your daily limit for code analysis requests.",
          details:
            "If you need more requests, please contact us at: rafkhan9323@gmail.com",
        });
      } else if (isApiError(error)) {
        // Determine error type based on status code
        let errorType: "network" | "server" | "unknown" = "unknown";
        let title = "Analysis Failed";
        let message = "An error occurred while analyzing your code.";

        if (error.status === 503 || error.code === "SERVICE_UNAVAILABLE") {
          errorType = "server";
          title = "Service Unavailable";
          message =
            "The code analysis service is currently unavailable. Please try again later.";
        } else if (error.status === 408 || error.code === "TIMEOUT") {
          errorType = "network";
          title = "Connection Timeout";
          message =
            "The analysis request timed out. Please check your connection and try again.";
        } else if (error.status && error.status >= 500) {
          errorType = "server";
          title = "Server Error";
          message =
            "A server error occurred during analysis. Please try again later.";
        } else if (!error.status) {
          errorType = "network";
          title = "Network Error";
          message =
            "Unable to connect to the analysis service. Please check your internet connection.";
        }

        // For non-rate-limit errors, show a toast
        toast({
          title: title,
          description: error.message || message,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        // Unknown error
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze code. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
    };
    return extensions[language] || "txt";
  };

  const handleSave = () => {
    console.log("Saving code...");
  };

  const handleShare = () => {
    console.log("Sharing analysis...");
  };

  const currentCode = activeFile?.content || manualCode;
  const hasCode = Boolean(currentCode.trim());

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "cpp",
    "go",
    "rust",
    "php",
    "ruby",
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-xl shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-200 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg">
                  <img
                    src="/codify.png"
                    alt="Codify Logo"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Code Review</h1>
                  <p className="text-sm text-gray-200">
                    Analyze and improve your code
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link to="/chat">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Code className="h-5 w-5" />
                  <span>Code Input</span>
                </CardTitle>
                <CardDescription className="text-gray-200">
                  Upload files or enter code manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                    <TabsTrigger
                      value="upload"
                      className="text-gray-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                    >
                      File Upload
                    </TabsTrigger>
                    <TabsTrigger
                      value="editor"
                      className="text-gray-200 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                    >
                      Code Editor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload onFileUpload={handleFileUpload} multiple />

                    {codeFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-200">
                          Uploaded Files:
                        </p>
                        {codeFiles.map((file, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              activeFile?.name === file.name
                                ? "bg-blue-600/30 border-blue-400/60"
                                : "bg-white/10 border-white/20 hover:bg-white/15"
                            }`}
                            onClick={() => setActiveFile(file)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-300">
                                  {file.type}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-white/20 text-gray-200 border border-white/10"
                              >
                                {file.content.split("\n").length} lines
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="editor" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-3 py-2 border border-white/20 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/10 text-white placeholder:text-gray-400"
                        placeholder="Enter filename..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="language-select"
                        className="text-sm font-medium text-gray-200"
                      >
                        Language
                      </label>
                      <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-white/20 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/10 text-white [&>option]:bg-slate-800 [&>option]:text-white"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <CodeEditor
                      value={manualCode}
                      onChange={handleCodeChange}
                      language={selectedLanguage}
                      placeholder="Enter your code here..."
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {hasCode && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Analyzing Code...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-4">
            <CodeAnalysis
              code={currentCode}
              fileName={activeFile?.name || fileName}
              language={activeFile?.type || selectedLanguage}
              isAnalyzing={isAnalyzing}
            />
          </div>

          <div className="lg:col-span-4">
            {analysisResults ? (
              <ResultsDisplay results={analysisResults} />
            ) : (
              <BestPractices
                code={currentCode}
                language={activeFile?.type || selectedLanguage}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        </div>
      </div>

      {/* Error Dialog Modal */}
      <AlertDialog
        open={errorDialog.isOpen}
        onOpenChange={(open) =>
          setErrorDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="sm:max-w-md bg-slate-800/95 backdrop-blur-xl border border-white/20 text-white">
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              {errorDialog.type === "rate_limit" && (
                <div className="p-2 bg-orange-500/20 rounded-full">
                  <Clock className="h-5 w-5 text-orange-400" />
                </div>
              )}
              {errorDialog.type === "network" && (
                <div className="p-2 bg-red-500/20 rounded-full">
                  <RefreshCw className="h-5 w-5 text-red-400" />
                </div>
              )}
              {(errorDialog.type === "server" ||
                errorDialog.type === "unknown") && (
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
              )}
              <AlertDialogTitle className="text-lg font-semibold text-white">
                {errorDialog.title}
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-sm text-gray-300 space-y-3">
            <p>{errorDialog.message}</p>

            {errorDialog.details && (
              <div className="bg-orange-500/10 p-3 rounded-md border-l-4 border-orange-400">
                <p className="text-sm font-medium text-orange-300 mb-1">
                  Contact Information:
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {errorDialog.details}
                  </span>
                </div>
              </div>
            )}

            {errorDialog.type === "rate_limit" && (
              <div className="bg-blue-500/10 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-300 mb-1">
                  What can you do?
                </p>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>
                    • Wait for the daily limit to reset (resets at midnight UTC)
                  </li>
                  <li>
                    • Contact us for increased limits if you're a regular user
                  </li>
                  <li>• Try the AI chat feature which has separate limits</li>
                </ul>
              </div>
            )}

            {errorDialog.type === "network" && (
              <div className="bg-blue-500/10 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-300 mb-1">
                  Troubleshooting:
                </p>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Make sure your files aren't too large</li>
                </ul>
              </div>
            )}

            {(errorDialog.type === "server" ||
              errorDialog.type === "unknown") && (
              <div className="bg-blue-500/10 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-300 mb-1">
                  What to try:
                </p>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Wait a few minutes and try again</li>
                  <li>• Refresh the page</li>
                  <li>• Try with smaller code files</li>
                  <li>• If the problem persists, contact support</li>
                </ul>
              </div>
            )}
          </AlertDialogDescription>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            {errorDialog.type === "rate_limit" && errorDialog.details && (
              <AlertDialogAction
                onClick={() => {
                  window.open(
                    `mailto:${errorDialog.details?.replace(
                      "If you need more requests, please contact us at: ",
                      ""
                    )}?subject=Request for Increased Code Analysis Limits&body=Hello, I would like to request increased daily limits for the code analysis feature. Thank you!`,
                    "_blank"
                  );
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </AlertDialogAction>
            )}
            <AlertDialogCancel
              onClick={() =>
                setErrorDialog((prev) => ({ ...prev, isOpen: false }))
              }
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CodeReview;
