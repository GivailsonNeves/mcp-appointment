"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SendHorizonal, X } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Spinner } from "../ui/spinner";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content: "Olá! Sou a assistente virtual do sistema de agendamento de consultas. Como posso ajudar você hoje?",
  },
];

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  interactiveMode: boolean;
  isPending: boolean;
  setInteractiveMode: (mode: boolean) => void;
  children?: React.ReactNode;
  conversation?: {
    role: "user" | "assistant";
    content: string;
  }[];
  onSubmitQuery?: (query: string) => void;
};

export function ChatSidebar({
  open,
  onSubmitQuery,
  conversation,
  setOpen,
  isPending,
  interactiveMode,
  setInteractiveMode,
  children,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handSubmit = () => {
    const query = inputRef.current?.value.trim();
    if (!query) return;
    inputRef.current!.value = "";
    onSubmitQuery?.(query);
  };

  const messages = React.useMemo(() => {
    return conversation?.length
      ? [...DEFAULT_MESSAGES, ...conversation]
      : DEFAULT_MESSAGES;
  }, [conversation]);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      style={
        {
          ["--sidebar-width" as string]: "26rem", // Adjust the width as needed
        } as React.CSSProperties
      }
    >
      {children}
      <Sidebar side="right">
        <SidebarHeader className="p-5 border-b bg-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Secretary</h2>
            <Button
              variant="secondary-outline"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col h-full">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((c, index) => (
                  <div
                    key={index}
                    className={cn("w-full flex", {
                      "justify-start": c.role === "assistant",
                      "justify-end": c.role === "user",
                    })}
                  >
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg max-w-[80%] text-sm",
                        {
                          "bg-gray-100 text-gray-900": c.role === "assistant",
                          "bg-blue-500 text-white": c.role === "user",
                        }
                      )}
                    >
                      {c.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1 {...props} className="text-xl font-bold" />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                {...props}
                                className="text-lg font-bold mt-2"
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                {...props}
                                className="text-base font-bold mt-2"
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul {...props} className="list-disc pl-5" />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol {...props} className="list-decimal pl-5" />
                            ),
                            p: ({ node, ...props }) => (
                              <p {...props} className="mb-2" />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                className="text-blue-500 hover:underline"
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong {...props} className="font-bold" />
                            ),
                          }}
                        >
                          {c.content}
                        </ReactMarkdown>
                      ) : (
                        c.content
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t bg-slate-50 p-4 mt-auto">
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    disabled={isPending}
                    id="interactive-mode"
                    checked={interactiveMode}
                    onCheckedChange={setInteractiveMode}
                  />
                  <Label htmlFor="interactive-mode" className="text-sm">Interactive Mode</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder={
                      isPending ? "Processing..." : "Type your message..."
                    }
                    disabled={isPending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handSubmit();
                      }
                    }}
                    className="flex-1"
                  />
                  <div className="flex items-center w-10 justify-center">
                    {isPending ? (
                      <Spinner className="text-blue-500 w-4 h-4" />
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handSubmit}
                        disabled={isPending}
                        className="h-10 w-10"
                      >
                        <SendHorizonal className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
