import { useContext } from "react";
import { RateLimitContext } from "@/contexts/RateLimitContextBase";
import type { RateLimitContextType } from "@/types/rateLimit";

// Custom hook to use rate limit context
export const useRateLimit = (): RateLimitContextType => {
  const context = useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error("useRateLimit must be used within a RateLimitProvider");
  }
  return context;
};
