"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const doctors_tool_1 = require("./tools/doctors-tool");
const patient_tool_1 = require("./tools/patient-tool");
const appointment_tools_1 = require("./tools/appointment-tools");
async function main() {
    const server = new mcp_js_1.McpServer({
        name: "MCP appointments server",
        version: "0.0.1",
        capabilities: {
            resources: {},
            tools: {},
        },
    });
    (0, doctors_tool_1.registerDoctorsTool)(server);
    (0, patient_tool_1.registerPatientTool)(server);
    (0, appointment_tools_1.registerAppointmentsTool)(server);
    // Configurando e iniciando o servidor
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}
main().catch((error) => {
    console.error('Error in main:', error);
    process.exit(1);
});
