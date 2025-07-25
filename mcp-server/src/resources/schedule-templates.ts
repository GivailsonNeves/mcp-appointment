import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from 'fs';
import * as path from 'path';

// Load JSON data synchronously
const scheduleTemplatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/schedule-templates.json'), 'utf8')
);
import { generateTimeSlots } from "./utils/time-helpers.js";

export function registerScheduleTemplateResources(server: McpServer) {
  // Standard Monday-Friday Schedule
  server.resource(
    "Standard Monday-Friday Schedule",
    "schedule-templates://standard-weekday",
    { description: "Standard Monday to Friday schedule from 9am to 5pm" },
    async () => {
      const template = { ...scheduleTemplatesData["standard-weekday"] };
      
      // Add calculated slots for each day
      Object.keys(template.schedules).forEach(day => {
        const schedule = template.schedules[day as keyof typeof template.schedules];
        if ('start' in schedule && schedule.start) {
          const slots = generateTimeSlots(
            schedule.start, 
            schedule.end, 
            schedule.lunch_break?.start || null, 
            schedule.lunch_break?.end || null, 
            schedule.slot_duration
          );
          (schedule as any).slots = slots;
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

  // Extended Schedule
  server.resource(
    "Extended Schedule", 
    "schedule-templates://extended-hours",
    { description: "Extended weekday schedule with Saturday morning" },
    async () => {
      const template = { ...scheduleTemplatesData["extended-hours"] };
      
      // Add calculated slots for each day
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
      
      // Add calculated slots for each day
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
    "Emergency Shift",
    "schedule-templates://emergency",
    { description: "24/7 emergency shift coverage" },
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
      
      // Add calculated slots for each day
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