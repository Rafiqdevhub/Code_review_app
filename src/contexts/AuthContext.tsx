import React, { useReducer, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import {
  AuthState,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
} from "@/types/auth";
import { authApi, isApiError } from "@/services/api";
import { AuthContext } from "./AuthContextBase";

// Auth reducer actions
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to check for existing token
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const profileResponse = await authApi.getProfile();
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: profileResponse.user, token },
          });
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem("auth_token");
          dispatch({ type: "AUTH_FAILURE" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("auth_token", response.token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
      toast.success("Login successful!");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      if (isApiError(error)) {
        if (error.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (error.status === 401) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authApi.register(userData);
      localStorage.setItem("auth_token", response.token);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
      toast.success("Registration successful!");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      if (isApiError(error)) {
        if (error.status === 409) {
          toast.error("User with this email already exists");
        } else if (error.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails on server, we should clear local state
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
    }
  };

  // Update profile function
  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const response = await authApi.updateProfile(data);
      dispatch({ type: "UPDATE_PROFILE", payload: response.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 401) {
          // Token expired, logout user
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to update profile");
      }
      throw error;
    }
  };

  // Change password function
  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      await authApi.changePassword(data);
      toast.success("Password changed successfully!");
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 401) {
          logout();
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to change password");
      }
      throw error;
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile();
      dispatch({ type: "UPDATE_PROFILE", payload: response.user });
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
