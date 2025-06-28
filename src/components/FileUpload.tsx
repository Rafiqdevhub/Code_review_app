
import React, { useCallback, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { CodeFile } from '@/pages/Index';

interface FileUploadProps {
  onFileUpload: (file: CodeFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift'];

  const getFileType = (fileName: string): string => {
    const extension = fileName.toLowerCase().split('.').pop();
    const typeMap: { [key: string]: string } = {
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'React TSX',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift'
    };
    return typeMap[extension || ''] || 'Text';
  };

  const isValidFile = (fileName: string): boolean => {
    return supportedExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!isValidFile(file.name)) {
      setError('Please upload a supported code file (.js, .jsx, .ts, .tsx, .py, etc.)');
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      setError('File size must be less than 1MB');
      return;
    }

    try {
      const content = await file.text();
      const codeFile: CodeFile = {
        name: file.name,
        content,
        type: getFileType(file.name)
      };
      onFileUpload(codeFile);
    } catch (err) {
      setError('Failed to read file content');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={supportedExtensions.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-3">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-6 w-6 ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drop your code file here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: JS, TS, Python, Java, C++, and more
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Supported file types:</p>
        <p>{supportedExtensions.join(', ')}</p>
      </div>
    </div>
  );
};
