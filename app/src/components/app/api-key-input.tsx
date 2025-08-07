"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/providers/api-key-provider";
import { useEffect, useState } from "react";

export function ApiKeyInput() {
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey || "");
  const handleSave = () => {
    setApiKey(inputValue);
  };

  useEffect(() => {
    setInputValue(apiKey || "");
  }, [apiKey]);

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Anthropic API Key"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}