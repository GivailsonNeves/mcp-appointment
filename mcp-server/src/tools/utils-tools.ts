import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUtilsTools(server: McpServer) {
  server.tool(
    "get-date",
    "Retrieve the current date",
    {},
    async () => {
      const date = new Date();
      return {
        content: [
          {
            type: "text",
            text: `Current date: ${date.toISOString().split("T")[0]}`,
          },
        ],
      };
    }
  );
}
