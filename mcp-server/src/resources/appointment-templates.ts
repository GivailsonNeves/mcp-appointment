import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from 'fs';
import * as path from 'path';

// Carregar dados JSON de forma síncrona
const appointmentTemplatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/appointment-templates.json'), 'utf8')
);

export function registerAppointmentTemplateResources(server: McpServer) {
  // Template de Consulta Geral
  server.resource(
    "Template de Consulta Geral",
    "appointment-templates://consultation",
    { description: "Template para consulta médica geral" },
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

  // Template de Checkup
  server.resource(
    "Template de Checkup", 
    "appointment-templates://checkup",
    { description: "Template para exame médico de rotina anual" },
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

  // Template de Retorno
  server.resource(
    "Template de Retorno",
    "appointment-templates://followup", 
    { description: "Template para consultas de retorno" },
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

  // Template de Emergência
  server.resource(
    "Template de Emergência",
    "appointment-templates://emergency",
    { description: "Template para consultas de emergência" }, 
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