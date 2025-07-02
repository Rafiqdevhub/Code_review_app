import { AnalysisResults } from "@/components/ResultsDisplay";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface CodeIssue {
  type: "bug" | "warning" | "suggestion" | "security";
  severity: "low" | "medium" | "high" | "critical";
  line?: number;
  description: string;
  suggestion?: string;
}

export interface CodeQuality {
  readability: number; // 1-10 scale
  maintainability: number; // 1-10 scale
  complexity: string; // Low, Medium, High
}

export interface CodeReviewResult {
  summary: string;
  issues: CodeIssue[];
  suggestions: string[];
  securityConcerns: string[];
  codeQuality: CodeQuality;
  threadId: string;
  filesAnalyzed?: Array<{
    filename: string;
    language: string;
    size: number;
  }>;
}

export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface CodeAnalysisRequest {
  code: string;
  filename?: string;
  threadId?: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  threadId?: string;
}

export interface ChatResponse {
  message: string;
  threadId: string;
}

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(options: { message: string; code?: string; status?: number }) {
    super(options.message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message:
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: errorData.code,
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        message:
          error instanceof Error ? error.message : "Network error occurred",
      });
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export const healthApi = {
  async checkStatus(): Promise<{
    status: string;
    version: string;
    endpoints: string[];
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(API_BASE_URL, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        status: "online",
        version: "1.0.0",
        endpoints: ["/chat", "/analyze", "/analyze-files"],
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError({
          message: "API health check timed out",
          status: 408,
          code: "TIMEOUT",
        });
      }

      throw new ApiError({
        message: "Backend API is not reachable",
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      });
    }
  },

  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }> {
    return apiClient.get<{ status: string; timestamp: string; uptime: number }>(
      "/health"
    );
  },
};

export const codeAnalysisApi = {
  async analyzeText(request: CodeAnalysisRequest): Promise<AnalysisResults> {
    const response = await apiClient.post<BackendApiResponse<CodeReviewResult>>(
      "/review-text",
      request
    );

    return transformCodeReviewToAnalysis(response.data);
  },

  async analyzeFiles(
    files: File[],
    threadId?: string
  ): Promise<AnalysisResults> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (threadId) {
      formData.append("threadId", threadId);
    }

    const response = await fetch(`${API_BASE_URL}/review-files`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message:
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.error,
      });
    }

    const result =
      (await response.json()) as BackendApiResponse<CodeReviewResult>;
    return transformCodeReviewToAnalysis(result.data);
  },

  async getSupportedLanguages(): Promise<{
    supportedExtensions: string[];
    languages: Array<{ extension: string; language: string }>;
    maxFileSize: string;
    maxFiles: number;
  }> {
    const response = await apiClient.get<
      BackendApiResponse<{
        supportedExtensions: string[];
        languages: Array<{ extension: string; language: string }>;
        maxFileSize: string;
        maxFiles: number;
      }>
    >("/languages");
    return response.data;
  },

  async getGuidelines(): Promise<{
    reviewCriteria: string[];
    severityLevels: Record<string, string>;
    issueTypes: Record<string, string>;
    tips: string[];
  }> {
    const response = await apiClient.get<
      BackendApiResponse<{
        reviewCriteria: string[];
        severityLevels: Record<string, string>;
        issueTypes: Record<string, string>;
        tips: string[];
      }>
    >("/guidelines");
    return response.data;
  },
};

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>("/chat", request);
    return response;
  },

  async getChatHistory(threadId?: string): Promise<ChatMessage[]> {
    return [];
  },

  async createThread(): Promise<{ threadId: string }> {
    return { threadId: crypto.randomUUID() };
  },

  async deleteThread(threadId: string): Promise<void> {
    return Promise.resolve();
  },
};

function transformCodeReviewToAnalysis(
  data: CodeReviewResult
): AnalysisResults {
  const securityIssues = data.issues.filter(
    (issue) => issue.type === "security"
  );
  const totalIssues = data.issues.length;
  const highSeverityIssues = data.issues.filter(
    (issue) => issue.severity === "high" || issue.severity === "critical"
  ).length;

  const qualityScore = Math.round(
    (data.codeQuality.readability + data.codeQuality.maintainability) / 2
  );
  const issuesPenalty = Math.min(highSeverityIssues * 10, 50);
  const overallScore = Math.max(0, qualityScore * 10 - issuesPenalty);

  return {
    summary: {
      score: overallScore,
      issues: totalIssues,
      suggestions: data.suggestions.length,
      securityIssues: securityIssues.length + data.securityConcerns.length,
    },
    issues: data.issues.map((issue) => ({
      id: crypto.randomUUID(),
      severity:
        issue.severity === "critical"
          ? "high"
          : (issue.severity as "high" | "medium" | "low"),
      type:
        issue.type === "warning"
          ? "style"
          : issue.type === "suggestion"
          ? "style"
          : (issue.type as "security" | "performance" | "style" | "bug"),
      title: issue.description,
      description: issue.description,
      line: issue.line || 0,
      suggestion: issue.suggestion || "No specific suggestion provided.",
    })),
    metrics: {
      complexity:
        data.codeQuality.complexity === "Low"
          ? 1
          : data.codeQuality.complexity === "Medium"
          ? 5
          : 9,
      maintainability: data.codeQuality.maintainability,
      testCoverage: 0,
      performance: 5,
    },
    security: {
      vulnerabilities: [
        ...securityIssues.map((issue) => ({
          id: crypto.randomUUID(),
          severity: issue.severity as "critical" | "high" | "medium" | "low",
          title: issue.description,
          description: issue.description,
          recommendation:
            issue.suggestion ||
            "Please review and address this security issue.",
        })),
        ...data.securityConcerns.map((concern) => ({
          id: crypto.randomUUID(),
          severity: "medium" as const,
          title: concern,
          description: concern,
          recommendation: "Please review and address this security concern.",
        })),
      ],
      score:
        data.securityConcerns.length === 0 && securityIssues.length === 0
          ? 95
          : Math.max(
              10,
              95 - (data.securityConcerns.length + securityIssues.length) * 15
            ),
    },
  };
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export { apiClient };
