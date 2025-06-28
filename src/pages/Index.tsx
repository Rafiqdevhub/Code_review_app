
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { CodeAnalysis } from '@/components/CodeAnalysis';
import { BestPractices } from '@/components/BestPractices';
import { FileText, Code, CheckCircle } from 'lucide-react';

export interface CodeFile {
  name: string;
  content: string;
  type: string;
}

const Index = () => {
  const [codeFile, setCodeFile] = useState<CodeFile | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (file: CodeFile) => {
    setCodeFile(file);
    setManualCode(''); // Clear manual input when file is uploaded
  };

  const handleManualCodeChange = (code: string) => {
    setManualCode(code);
    if (code.trim()) {
      setCodeFile(null); // Clear file when manual code is entered
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const currentCode = codeFile?.content || manualCode;
  const hasCode = Boolean(currentCode.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Code Review Agent</h1>
              <p className="text-sm text-gray-600">Upload code and get intelligent suggestions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Input Section */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* File Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Upload Code File</h2>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
              {codeFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">{codeFile.name}</p>
                  <p className="text-xs text-blue-700">{codeFile.type}</p>
                </div>
              )}
            </div>

            {/* Manual Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Or Enter Code Manually</h2>
              </div>
              <textarea
                value={manualCode}
                onChange={(e) => handleManualCodeChange(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Analyze Button */}
            {hasCode && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Analyze Code</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Middle Column - Code Display */}
          <div className="lg:col-span-1">
            <CodeAnalysis 
              code={currentCode} 
              fileName={codeFile?.name || 'manual-input'}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right Column - Best Practices */}
          <div className="lg:col-span-1">
            <BestPractices 
              code={currentCode}
              language={codeFile?.type || 'javascript'}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
