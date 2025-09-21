import React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = "Enter your code here...",
  className,
  readOnly = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value);
    }
  };

  // Simple syntax highlighting for demonstration
  const getLanguageHint = (lang: string) => {
    const hints: Record<string, string> = {
      javascript: "// JavaScript code",
      typescript: "// TypeScript code",
      python: "# Python code",
      java: "// Java code",
      csharp: "// C# code",
      cpp: "// C++ code",
      go: "// Go code",
      rust: "// Rust code",
      php: "<?php // PHP code",
      ruby: "# Ruby code",
    };
    return hints[lang] || "// Code";
  };

  const lineCount = value.split("\n").length;
  const maxVisibleLines = 20;
  const height = Math.min(lineCount + 2, maxVisibleLines) * 24; // 24px per line

  return (
    <div
      className={cn(
        "relative border border-white/20 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-white/10 border-b border-white/20">
        <span className="text-xs font-medium text-gray-200 uppercase tracking-wide">
          {language}
        </span>
        <span className="text-xs text-gray-400">
          {lineCount} line{lineCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 p-3 bg-white/10 border-r border-white/20 text-xs text-gray-500 font-mono select-none">
          {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "w-full pl-14 pr-3 py-3 font-mono text-sm resize-none outline-none",
            "placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
            "min-h-[120px] max-h-[480px] bg-white/5 text-white",
            readOnly ? "bg-white/5 text-gray-300" : "bg-white/5 text-white"
          )}
          style={{ height: `${height}px` }}
          spellCheck={false}
        />

        {!value && (
          <div className="absolute top-3 left-14 text-gray-500 text-sm font-mono pointer-events-none">
            {getLanguageHint(language)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-white/10 border-t border-white/20 text-xs text-gray-400">
        <span>
          {value.length} character{value.length !== 1 ? "s" : ""}
        </span>
        <span>
          {value.split(/\s+/).filter((word) => word.length > 0).length} word
          {value.split(/\s+/).filter((word) => word.length > 0).length !== 1
            ? "s"
            : ""}
        </span>
      </div>
    </div>
  );
};
