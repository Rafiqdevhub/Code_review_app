import React, { useReducer, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { RateLimitStatus, RateLimitContextType } from "@/types/rateLimit";
import { RateLimitContext } from "./RateLimitContextBase";
import {
  ENV,
  getRateLimitConfig,
  shouldSkipRateLimit,
  log,
} from "@/config/environment";

// Rate limit reducer actions
type RateLimitAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_STATUS"; payload: Partial<RateLimitStatus> }
  | { type: "RESET_LIMITS" }
  | { type: "SET_LIMIT_EXCEEDED" };

// Rate limit reducer
const rateLimitReducer = (
  state: RateLimitStatus,
  action: RateLimitAction
): RateLimitStatus => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLimited: false };
    case "UPDATE_STATUS":
      return { ...state, ...action.payload };
    case "RESET_LIMITS":
      return {
        ...state,
        isLimited: false,
        remainingRequests: state.totalRequests,
        resetTime: null,
        message: undefined,
      };
    case "SET_LIMIT_EXCEEDED":
      return {
        ...state,
        isLimited: true,
        remainingRequests: 0,
        message: "Rate limit exceeded. Please login to continue.",
      };
    default:
      return state;
  }
};

// Initial state - with development mode check
const getInitialRateLimitStatus = (): RateLimitStatus => {
  const config = getRateLimitConfig(false); // Start with guest config

  return {
    isLimited: false,
    remainingRequests: config.requests,
    totalRequests: config.requests,
    resetTime: null,
    userType: "guest",
    message: ENV.isDevelopment ? config.message : undefined,
  };
};

// Rate limit provider component
export const RateLimitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(
    rateLimitReducer,
    getInitialRateLimitStatus()
  );

  // Update rate limits based on authentication status
  useEffect(() => {
    const config = getRateLimitConfig(isAuthenticated);

    dispatch({
      type: "UPDATE_STATUS",
      payload: {
        userType: isAuthenticated ? "authenticated" : "guest",
        remainingRequests: config.requests,
        totalRequests: config.requests,
        isLimited: false,
        message: ENV.isDevelopment ? config.message : undefined,
      },
    });

    log.dev(
      `Rate limits updated: ${
        isAuthenticated ? "authenticated" : "guest"
      } user - ${config.requests} requests`
    );
  }, [isAuthenticated, user]);

  // Check rate limit function
  const checkRateLimit = useCallback(async () => {
    // Skip rate limiting in development mode
    if (shouldSkipRateLimit()) {
      log.dev("Rate limiting disabled - skipping check");
      return;
    }

    try {
      // This would typically call an API endpoint to check current rate limit status
      // For now, we'll simulate this with local state management
      // In a real implementation, you'd call something like:
      // const response = await apiClient.get('/api/rate-limit/status');

      // For demonstration, we'll just check if we need to show the limit exceeded state
      // but avoid infinite loops by not dispatching if already in the correct state
      if (state.remainingRequests <= 0 && !state.isLimited) {
        dispatch({ type: "SET_LIMIT_EXCEEDED" });
        toast.error(
          "Rate limit exceeded. Please login to continue with higher limits."
        );
      }
    } catch (error) {
      log.error("Rate limit check failed:", error);
    }
  }, [state.remainingRequests, state.isLimited]); // Stable dependencies

  // Update rate limit status function
  const updateRateLimitStatus = useCallback(
    (status: Partial<RateLimitStatus>) => {
      dispatch({ type: "UPDATE_STATUS", payload: status });
    },
    []
  );

  // Decrement remaining requests (call this after successful API calls)
  const decrementRequests = useCallback(() => {
    // Skip decrementing in development mode
    if (shouldSkipRateLimit()) {
      log.dev("Rate limiting disabled - skipping request decrement");
      return;
    }

    if (state.remainingRequests > 0) {
      dispatch({
        type: "UPDATE_STATUS",
        payload: {
          remainingRequests: state.remainingRequests - 1,
        },
      });
      log.dev(`Request decremented: ${state.remainingRequests - 1} remaining`);
    } else {
      dispatch({ type: "SET_LIMIT_EXCEEDED" });
    }
  }, [state.remainingRequests]);

  const value: RateLimitContextType = {
    rateLimitStatus: state,
    checkRateLimit,
    isLoading: false, // We don't need loading state for this simple implementation
    updateRateLimitStatus,
    decrementRequests,
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};
