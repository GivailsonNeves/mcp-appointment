import { RequestHandler } from "express";
import { MCPClient } from "../lib/mcp-client";

export class ChatController {
  constructor(private mcpClient: MCPClient) {}
  handler: RequestHandler = async (req, res) => {
    try {
      const { query, history } = req.body;
      const apiKey = req.headers["x-anthropic-api-key"] as string;

      if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
      }

      const response = await this.mcpClient.processQuery(query, history, apiKey);
      res.json(response);
    } catch (error) {
      console.error("Error processing query:", error);
      res.status(500).json({ error: "Failed to process query" });
    }
  };
}
