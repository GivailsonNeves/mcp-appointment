"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Send, SendHorizonal, X } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";

type ChatContextType = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProviderProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <ChatContext.Provider
      value={{
        show: () => setOpen(true),
        hide: () => setOpen(false),
        toggle: () => setOpen((prev) => !prev),
      }}
    >
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
              <div className="flex-grow-1 flex items-end justify-between p-4 flex-col-reverse rounded-md overflow-y-auto">
                {new Array(20).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className={cn("w-full flex justify-end px-5", {
                      "justify-baseline": index % 2 !== 0,
                    })}
                  >
                    <div
                      className={cn(
                        "px-3 py-2 bg-gray-100 rounded-md mb-3 align-self-start w-[80%]",
                        {
                          "bg-blue-100": index % 2 !== 0,
                        }
                      )}
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Omnis, quaerat laboriosam. {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-100 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <Input placeholder="Command..." />
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <SendHorizonal />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
