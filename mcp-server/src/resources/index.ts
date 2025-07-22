import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppointmentTemplateResources } from "./appointment-templates.js";
import { registerScheduleTemplateResources } from "./schedule-templates.js";
import { registerDoctorProfileResources } from "./doctor-profiles.js";
import { registerPatientHistoryResources } from "./patient-history.js";
import { registerSystemResources } from "./system-resources.js";

/**
 * Registra todos os recursos MCP do sistema de consultas
 * 
 * Recursos implementados:
 * - Templates de Consulta: 4 tipos (consulta, checkup, retorno, emergência)
 * - Templates de Horários: 5 padrões (padrão, estendido, meio-período, emergência, especialista)
 * - Perfis de Médicos: Recursos dinâmicos com especialidades e horários
 * - Histórico de Pacientes: Análise completa de consultas e padrões
 * - Recursos do Sistema: Estatísticas e guias de operações CRUD
 */
export function registerAllResources(server: McpServer) {
  // Templates de Consulta (4 recursos estáticos)
  registerAppointmentTemplateResources(server);
  
  // Templates de Horários (5 recursos estáticos)
  registerScheduleTemplateResources(server);
  
  // Perfis de Médicos (recursos dinâmicos)
  registerDoctorProfileResources(server);
  
  // Histórico de Pacientes (recursos dinâmicos)
  registerPatientHistoryResources(server);
  
  // Recursos do Sistema (estatísticas e guias)
  registerSystemResources(server);
}

/**
 * Resumo dos recursos registrados:
 * 
 * RECURSOS ESTÁTICOS (9):
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
 * RECURSOS DINÂMICOS (4+):
 * - doctor-profiles://all
 * - doctor-profiles://{doctor_id}
 * - patient-history://all
 * - patient-history://{patient_id}
 * 
 * RECURSOS DO SISTEMA (2):
 * - crud-operations://guide
 * - system://statistics
 * 
 * TOTAL: 15+ recursos MCP implementados
 */