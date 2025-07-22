import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from 'fs';
import * as path from 'path';

// Carregar dados JSON de forma síncrona
const scheduleTemplatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/schedule-templates.json'), 'utf8')
);
import { generateTimeSlots } from "./utils/time-helpers.js";

export function registerScheduleTemplateResources(server: McpServer) {
  // Horário Padrão Segunda-Sexta
  server.resource(
    "Horário Padrão Segunda-Sexta",
    "schedule-templates://standard-weekday",
    { description: "Horário padrão segunda-feira a sexta-feira das 9h às 17h" },
    async () => {
      const template = { ...scheduleTemplatesData["standard-weekday"] };
      
      // Adicionar slots calculados para cada dia
      Object.keys(template.horarios).forEach(dia => {
        const horario = template.horarios[dia as keyof typeof template.horarios];
        if ('inicio' in horario && horario.inicio) {
          const slots = generateTimeSlots(
            horario.inicio, 
            horario.fim, 
            horario.intervalo_almoco?.inicio || null, 
            horario.intervalo_almoco?.fim || null, 
            horario.duracao_slot
          );
          (horario as any).slots = slots;
        }
      });

      return {
        contents: [
          {
            uri: "schedule-templates://standard-weekday", 
            mimeType: "application/json",
            text: JSON.stringify(template, null, 2)
          }
        ]
      };
    }
  );

  // Horário Estendido
  server.resource(
    "Horário Estendido", 
    "schedule-templates://extended-hours",
    { description: "Horário estendido durante semana com sábado de manhã" },
    async () => {
      const template = { ...scheduleTemplatesData["extended-hours"] };
      
      // Adicionar slots calculados para cada dia
      Object.keys(template.horarios).forEach(dia => {
        const horario = template.horarios[dia as keyof typeof template.horarios];
        if ('inicio' in horario && horario.inicio) {
          const slots = generateTimeSlots(
            horario.inicio, 
            horario.fim, 
            horario.intervalo_almoco?.inicio || null, 
            horario.intervalo_almoco?.fim || null, 
            horario.duracao_slot
          );
          (horario as any).slots = slots;
        }
      });

      return {
        contents: [
          {
            uri: "schedule-templates://extended-hours",
            mimeType: "application/json",
            text: JSON.stringify(template, null, 2)
          }
        ]
      };
    }
  );

  // Meio Período
  server.resource(
    "Horário Meio Período",
    "schedule-templates://part-time", 
    { description: "Horário de meio período - 3 dias por semana" },
    async () => {
      const template = { ...scheduleTemplatesData["part-time"] };
      
      // Adicionar slots calculados para cada dia
      Object.keys(template.horarios).forEach(dia => {
        const horario = template.horarios[dia as keyof typeof template.horarios];
        if ('inicio' in horario && horario.inicio) {
          const slots = generateTimeSlots(
            horario.inicio, 
            horario.fim, 
            horario.intervalo_almoco?.inicio || null, 
            horario.intervalo_almoco?.fim || null, 
            horario.duracao_slot
          );
          (horario as any).slots = slots;
        }
      });

      return {
        contents: [
          {
            uri: "schedule-templates://part-time",
            mimeType: "application/json",
            text: JSON.stringify(template, null, 2)
          }
        ]
      };
    }
  );

  // Plantão de Emergência
  server.resource(
    "Plantão de Emergência",
    "schedule-templates://emergency",
    { description: "Cobertura de plantão 24/7 para emergências" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://emergency",
            mimeType: "application/json",
            text: JSON.stringify(scheduleTemplatesData.emergency, null, 2)
          }
        ]
      };
    }
  );

  // Horário Especialista
  server.resource(
    "Horário Especialista",
    "schedule-templates://specialist", 
    { description: "Consultas especializadas com slots mais longos" },
    async () => {
      const template = { ...scheduleTemplatesData.specialist };
      
      // Adicionar slots calculados para cada dia
      Object.keys(template.horarios).forEach(dia => {
        const horario = template.horarios[dia as keyof typeof template.horarios];
        if ('inicio' in horario && horario.inicio) {
          const slots = generateTimeSlots(
            horario.inicio, 
            horario.fim, 
            horario.intervalo_almoco?.inicio || null, 
            horario.intervalo_almoco?.fim || null, 
            horario.duracao_slot
          );
          (horario as any).slots = slots;
        }
      });

      return {
        contents: [
          {
            uri: "schedule-templates://specialist",
            mimeType: "application/json",
            text: JSON.stringify(template, null, 2)
          }
        ]
      };
    }
  );
}