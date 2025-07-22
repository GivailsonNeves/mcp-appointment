import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerDoctorsTool } from "./tools/doctors-tool";
import { registerPatientTool } from "./tools/patient-tool";
import { registerAppointmentsTool } from "./tools/appointment-tools";
import { registerUtilsTools } from "./tools/utils-tools";
import { registerAllResources } from "./resources/index.js";

async function main() {
  const server = new McpServer({
    name: "MCP appointments server",
    version: "0.0.1",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  registerDoctorsTool(server);
  registerPatientTool(server);
  registerAppointmentsTool(server);
  registerUtilsTools(server);
  
  // Register MCP resources
  registerAllResources(server);
  // Configurando e iniciando o servidor
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Appointments MCP Server running on stdio");
}

main().catch((error) => {
  console.error('Error in main:', error);
  process.exit(1);
});