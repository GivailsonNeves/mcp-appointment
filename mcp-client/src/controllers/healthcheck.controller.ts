import { RequestHandler } from "express";
import { MCPClient } from "../lib/mcp-client";

export class HealthCheckController {
  constructor(private mcpClient: MCPClient) {}

  handler: RequestHandler = (req, res) => {
    res.json({ status: "ok", tools: this.mcpClient.tools.map((t) => t.name) });
  };
}