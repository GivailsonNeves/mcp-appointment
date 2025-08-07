import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppointmentTemplateResources } from "./appointment-templates";
import { registerScheduleTemplateResources } from "./schedule-templates";
import { registerDoctorProfileResources } from "./doctor-profiles";
import { registerPatientHistoryResources } from "./patient-history";
import { registerSystemResources } from "./system-resources";

/**
 * Registers all MCP resources for the appointment system
 * 
 * Implemented resources:
 * - Appointment Templates: 4 types (consultation, checkup, followup, emergency)
 * - Schedule Templates: 5 patterns (standard, extended, part-time, emergency, specialist)
 * - Doctor Profiles: Dynamic resources with specialties and schedules
 * - Patient History: Complete analysis of appointments and patterns
 * - System Resources: Statistics and CRUD operations guides
 */
export function registerAllResources(server: McpServer) {
  // Appointment Templates (4 static resources)
  registerAppointmentTemplateResources(server);
  
  // Schedule Templates (5 static resources)
  registerScheduleTemplateResources(server);
  
  // Doctor Profiles (dynamic resources)
  registerDoctorProfileResources(server);
  
  // Patient History (dynamic resources)
  registerPatientHistoryResources(server);
  
  // System Resources (statistics and guides)
  registerSystemResources(server);
}

/**
 * Summary of registered resources:
 * 
 * STATIC RESOURCES (9):
 * - appointment-templates://consultation
 * - appointment-templates://checkup
 * - appointment-templates://followup
 * - appointment-templates://emergency
 * - schedule-templates://standard-weekday
 * - schedule-templates://extended-hours
 * - schedule-templates://part-time
 * - schedule-templates://emergency
 * - schedule-templates://specialist
 * 
 * DYNAMIC RESOURCES (4+):
 * - doctor-profiles://all
 * - doctor-profiles://{doctor_id}
 * - patient-history://all
 * - patient-history://{patient_id}
 * 
 * SYSTEM RESOURCES (2):
 * - crud-operations://guide
 * - system://statistics
 * 
 * TOTAL: 15+ MCP resources implemented
 */