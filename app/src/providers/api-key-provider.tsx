"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("anthropic-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSetApiKey = (key: string | null) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("anthropic-api-key", key);
    } else {
      localStorage.removeItem("anthropic-api-key");
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey: handleSetApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}