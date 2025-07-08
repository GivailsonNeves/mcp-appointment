// Express
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MCPClient } from "./lib/mcp-client";
import { HealthCheckController } from "./controllers/healthcheck.controller";
import { ChatController } from "./controllers/chat.controller";

dotenv.config();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function main() {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  if (process.argv.length < 3 || !process.env.MCP_SERVER_PATH) {
    console.log("Usage: node index.ts <path_to_server_script>");
    return;
  }

  const app = express();
  const port = process.env.PORT || 3005;

  // Middleware
  app.use(cors());
  app.use(express.json());

  const mcpClient = new MCPClient(ANTHROPIC_API_KEY);

  try {
    await mcpClient.connectToServer(
      process.argv[2] ||
        process.env.MCP_SERVER_PATH
    );

    app.get("/health", new HealthCheckController(mcpClient).handler);
    app.post("/chat", new ChatController(mcpClient).handler);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`Chat endpoint: http://localhost:${port}/chat`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      await mcpClient.cleanup();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
