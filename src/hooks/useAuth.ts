import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContextBase";
import type { AuthContextType } from "@/types/auth";

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
