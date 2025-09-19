import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRateLimit } from "@/hooks/useRateLimit";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { rateLimitStatus, checkRateLimit } = useRateLimit();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check rate limits for unauthenticated users
  if (!isAuthenticated && rateLimitStatus.isLimited) {
    // Redirect to login page with rate limit message
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          rateLimitExceeded: true,
          message:
            "Rate limit exceeded. Please login to continue with higher limits.",
        }}
        replace
      />
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Check rate limit status first
    checkRateLimit();

    // Redirect to login page with return url
    const loginUrl = redirectTo || "/login";
    return <Navigate to={loginUrl} state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated
  // (useful for login/register pages that should redirect authenticated users)
  if (!requireAuth && isAuthenticated) {
    // Redirect to home or the intended page
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
