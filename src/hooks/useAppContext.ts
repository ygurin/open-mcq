import { useContext } from "react";
import { AppContext, AppContextType } from "../context/AppContext";

// Custom hook for using this context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
