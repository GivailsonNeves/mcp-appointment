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
        <SidebarContent>
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-grow-1 flex items-end justify-end p-4 flex-col rounded-md overflow-y-auto">
              {messages.map((c, index) => (
                <div
                  key={index}
                  className={cn("w-full flex justify-end px-5", {
                    "justify-baseline": c.role === "assistant",
                  })}
                >
                  <div
                    className={cn(
                      "px-3 py-2 bg-blue-100 rounded-md mb-3 align-self-start w-[80%]",
                      {
                        "bg-gray-100": c.role === "assistant",
                      }
                    )}
                  >
                    {c.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 p-4 rounded-md">
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    disabled={isPending}
                    id="interactive-mode"
                    checked={interactiveMode}
                    onCheckedChange={setInteractiveMode}
                  />
                  <Label htmlFor="interactive-mode">Interactive Mode</Label>
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
                  />
                  <div className="flex items-center w-[40px] justify-center">
                    {isPending ? (
                      <Spinner className="text-blue-500" />
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handSubmit}
                        disabled={isPending}
                      >
                        <SendHorizonal />
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
