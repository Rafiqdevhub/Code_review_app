import React, { useState } from "react";
import { FileUpload, CodeFile } from "@/components/FileUpload";
import { CodeAnalysis } from "@/components/CodeAnalysis";
import { BestPractices } from "@/components/BestPractices";
import { CodeEditor } from "@/components/CodeEditor";
import { ResultsDisplay, AnalysisResults } from "@/components/ResultsDisplay";
import { codeAnalysisApi, isApiError } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Code, Settings, Play, ArrowLeft, Save, Share } from "lucide-react";
import { Link } from "react-router-dom";
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

const CodeReview = () => {
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [fileName, setFileName] = useState("untitled");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);

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

      let errorMessage = "Failed to analyze code. Please try again.";
      if (isApiError(error)) {
        errorMessage = error.message;
      }

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Code Review
                  </h1>
                  <p className="text-sm text-gray-600">
                    Analyze and improve your code
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link to="/chat">
                <Button variant="outline" size="sm">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Code Input</span>
                </CardTitle>
                <CardDescription>
                  Upload files or enter code manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">File Upload</TabsTrigger>
                    <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <FileUpload onFileUpload={handleFileUpload} multiple />

                    {codeFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded Files:
                        </p>
                        {codeFiles.map((file, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              activeFile?.name === file.name
                                ? "bg-blue-50 border-blue-200"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveFile(file)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.type}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
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
                      <label className="text-sm font-medium text-gray-700">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter filename..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="language-select"
                        className="text-sm font-medium text-gray-700"
                      >
                        Language
                      </label>
                      <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full"
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
    </div>
  );
};

export default CodeReview;
