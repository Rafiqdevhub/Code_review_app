// Rate limiting types and interfaces
export interface RateLimitStatus {
  isLimited: boolean;
  remainingRequests: number;
  totalRequests: number;
  resetTime: Date | null;
  userType: "guest" | "authenticated";
  message?: string;
}

export interface RateLimitContextType {
  rateLimitStatus: RateLimitStatus;
  checkRateLimit: () => Promise<void>;
  isLoading: boolean;
  updateRateLimitStatus: (status: Partial<RateLimitStatus>) => void;
  decrementRequests: () => void;
}
