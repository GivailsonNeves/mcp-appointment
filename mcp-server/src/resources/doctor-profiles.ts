import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client.js";

export function registerDoctorProfileResources(server: McpServer) {
  // Template para perfis dinâmicos de médicos
  const doctorProfileTemplate = new ResourceTemplate(
    "doctor-profiles://{doctor_id}",
    {
      list: async () => {
        try {
          const doctors = await apiClient.get('/doctors');
          const resources = doctors.data.map((doctor: any) => ({
            uri: `doctor-profiles://${doctor.id}`,
            name: `Perfil Dr. ${doctor.name}`,
            description: `Perfil completo do Dr. ${doctor.name} incluindo especialidades e horários`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "doctor-profiles://all", 
            name: "Todos os Perfis de Médicos",
            description: "Perfis completos de todos os médicos no sistema",
            mimeType: "application/json"
          });

          return { resources };
        } catch (error) {
          console.error('Erro ao buscar médicos para recursos:', error);
          return { resources: [] };
        }
      }
    }
  );

  server.resource(
    "Perfis de Médicos",
    doctorProfileTemplate,
    { description: "Recursos dinâmicos de perfis de médicos" },
    async (uri: URL, variables: any) => {
      try {
        if (uri.pathname === "/all") {
          const doctors = await apiClient.get('/doctors');
          
          const profiles = doctors.data.map((doctor: any) => ({
            id: doctor.id,
            nome: doctor.name,
            email: doctor.email,
            telefone: doctor.phone,
            especialidade: doctor.specialty || 'Clínica Geral',
            qualificacoes: doctor.qualifications || [],
            experiencia: doctor.experience || 'Não especificado',
            idiomas: doctor.languages || ['Português'],
            horarios: {
              segunda: doctor.monday_schedule || '9:00-17:00',
              terca: doctor.tuesday_schedule || '9:00-17:00',
              quarta: doctor.wednesday_schedule || '9:00-17:00',
              quinta: doctor.thursday_schedule || '9:00-17:00', 
              sexta: doctor.friday_schedule || '9:00-17:00',
              sabado: doctor.saturday_schedule || 'Fechado',
              domingo: doctor.sunday_schedule || 'Fechado'
            },
            tipos_consulta: ['consulta', 'checkup', 'retorno'],
            tempo_medio_consulta: 30,
            aceita_emergencias: doctor.accepts_emergencies || false,
            informacoes_localizacao: {
              consultorio: doctor.office_location || 'Consultório Principal',
              endereco: doctor.address || 'Não especificado'
            }
          }));

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ medicos: profiles }, null, 2)
              }
            ]
          };
        }

        // Lidar com perfil individual de médico  
        const doctorId = variables.doctor_id;
        const doctor = await apiClient.get(`/doctors/${doctorId}`);
        
        const profile = {
          id: doctor.data.id,
          nome: doctor.data.name,
          email: doctor.data.email,
          telefone: doctor.data.phone,
          especialidade: doctor.data.specialty || 'Clínica Geral',
          qualificacoes: doctor.data.qualifications || [],
          experiencia: doctor.data.experience || 'Não especificado',
          idiomas: doctor.data.languages || ['Português'],
          horarios: {
            segunda: doctor.data.monday_schedule || '9:00-17:00',
            terca: doctor.data.tuesday_schedule || '9:00-17:00',
            quarta: doctor.data.wednesday_schedule || '9:00-17:00',
            quinta: doctor.data.thursday_schedule || '9:00-17:00',
            sexta: doctor.data.friday_schedule || '9:00-17:00',
            sabado: doctor.data.saturday_schedule || 'Fechado',
            domingo: doctor.data.sunday_schedule || 'Fechado'
          },
          tipos_consulta: ['consulta', 'checkup', 'retorno'],
          tempo_medio_consulta: 30,
          aceita_emergencias: doctor.data.accepts_emergencies || false,
          informacoes_localizacao: {
            consultorio: doctor.data.office_location || 'Consultório Principal',
            endereco: doctor.data.address || 'Não especificado'
          },
          estatisticas: {
            total_consultas: doctor.data.total_appointments || 0,
            consultas_futuras: doctor.data.upcoming_appointments || 0,
            avaliacao: doctor.data.rating || 'Não avaliado'
          }
        };

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(profile, null, 2)
            }
          ]
        };

      } catch (error) {
        console.error('Erro ao ler recurso de perfil de médico:', error);
        throw new Error(`Falha ao ler perfil de médico: ${uri.href}`);
      }
    }
  );
}