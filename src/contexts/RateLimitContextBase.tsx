import { createContext } from "react";
import type { RateLimitContextType } from "@/types/rateLimit";

// Create context
export const RateLimitContext = createContext<RateLimitContextType | undefined>(
  undefined
);
