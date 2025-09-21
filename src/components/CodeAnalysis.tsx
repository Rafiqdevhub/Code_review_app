import React from "react";
import { Code2, FileText, Loader2 } from "lucide-react";

interface CodeAnalysisProps {
  code: string;
  fileName: string;
  isAnalyzing: boolean;
  language?: string;
}

export const CodeAnalysis: React.FC<CodeAnalysisProps> = ({
  code,
  fileName,
  isAnalyzing,
  language = "javascript",
}) => {
  const lineCount = code.split("\n").length;
  const charCount = code.length;
  const wordCount = code.split(/\s+/).filter((word) => word.length > 0).length;

  if (!code.trim()) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code2 className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Code Analysis</h2>
        </div>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">
            Upload a file or enter code to see analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Code2 className="h-5 w-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Code Analysis</h2>
        {isAnalyzing && (
          <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
        )}
      </div>

      {/* Code Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="text-lg font-semibold text-white">{lineCount}</div>
          <div className="text-xs text-gray-300">Lines</div>
        </div>
        <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="text-lg font-semibold text-white">{wordCount}</div>
          <div className="text-xs text-gray-300">Words</div>
        </div>
        <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="text-lg font-semibold text-white">{charCount}</div>
          <div className="text-xs text-gray-300">Characters</div>
        </div>
      </div>

      {/* Code Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-200">Code Preview</h3>
          <span className="text-xs text-gray-400 bg-white/10 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
            {fileName}
          </span>
        </div>

        <div className="relative">
          <pre className="bg-white/5 text-white p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto border border-white/20">
            <code>{code}</code>
          </pre>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg border border-white/20">
              <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-lg flex items-center space-x-2 border border-white/20">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-sm font-medium text-white">
                  Analyzing code...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Analysis */}
      {code.trim() && !isAnalyzing && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-200">Quick Insights</h3>
          <div className="space-y-2">
            {code.includes("function") && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-300">Functions detected</span>
              </div>
            )}
            {code.includes("class") && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-300">Classes found</span>
              </div>
            )}
            {code.includes("import") ||
              (code.includes("require") && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-300">Dependencies imported</span>
                </div>
              ))}
            {lineCount > 100 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-300">
                  Large file - consider splitting
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
