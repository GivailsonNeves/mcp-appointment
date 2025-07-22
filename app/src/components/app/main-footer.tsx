"use client";
import { MessageSquareMore } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "@/providers/chat-provider";

export function MainFooter() {
  const { toggle } = useChat();
  return (
    <footer
      className="position-fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 z-10"
      style={{ position: "fixed" }}
    >
      <div
        className="text-center text-gray-500 text-sm"
        style={{ position: "relative" }}
      >
        © {new Date().getFullYear()} My App. All rights reserved.
        <div
          className="position-absolute top-0  right-0"
          style={{ position: "absolute", top: -6, right: 0 }}
        >
          <Button variant="outline" size="icon" onClick={toggle}>
            <MessageSquareMore />
          </Button>
        </div>
      </div>
    </footer>
  );
}
