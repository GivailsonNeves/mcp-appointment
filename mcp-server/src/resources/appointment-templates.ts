import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from 'fs';
import * as path from 'path';

// Load JSON data synchronously
const appointmentTemplatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/appointment-templates.json'), 'utf8')
);

export function registerAppointmentTemplateResources(server: McpServer) {
  // General Consultation Template
  server.resource(
    "General Consultation Template",
    "appointment-templates://consultation",
    { description: "Template for general medical consultation" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://consultation",
            mimeType: "application/json",
            text: JSON.stringify(appointmentTemplatesData.consultation, null, 2)
          }
        ]
      };
    }
  );

  // Checkup Template
  server.resource(
    "Checkup Template", 
    "appointment-templates://checkup",
    { description: "Template for annual routine medical exam" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://checkup",
            mimeType: "application/json",
            text: JSON.stringify(appointmentTemplatesData.checkup, null, 2)
          }
        ]
      };
    }
  );

  // Follow-up Template
  server.resource(
    "Follow-up Template",
    "appointment-templates://followup", 
    { description: "Template for follow-up appointments" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://followup",
            mimeType: "application/json", 
            text: JSON.stringify(appointmentTemplatesData.followup, null, 2)
          }
        ]
      };
    }
  );

  // Emergency Template
  server.resource(
    "Emergency Template",
    "appointment-templates://emergency",
    { description: "Template for emergency appointments" }, 
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://emergency",
            mimeType: "application/json",
            text: JSON.stringify(appointmentTemplatesData.emergency, null, 2)
          }
        ]
      };
    }
  );
}