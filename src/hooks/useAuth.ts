import { useContext } from "react";
import { AuthContext, AuthContextProps } from "@/context/AuthContext";

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
