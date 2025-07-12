import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerUtilsTools(server: McpServer) {
  server.tool(
    "get-date",
    "Retrieve the current date",
    {},
    async () => {
      const date = new Date();
      
      const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      return {
        content: [
          {
            type: "text",
            text: `Current date: ${formatter.format(date).split(" ")[0]}`,
          },
        ],
      };
    }
  );
}
