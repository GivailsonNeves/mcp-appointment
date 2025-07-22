import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client.js";
import { getFrequentDoctors, getAppointmentTypes, calculateAverageInterval } from "./utils/analysis-helpers.js";

export function registerPatientHistoryResources(server: McpServer) {
  // Template para histórico dinâmico de pacientes
  const patientHistoryTemplate = new ResourceTemplate(
    "patient-history://{patient_id}",
    {
      list: async () => {
        try {
          const patients = await apiClient.get('/patients');
          const resources = patients.data.map((patient: any) => ({
            uri: `patient-history://${patient.id}`,
            name: `Histórico Médico de ${patient.name}`,
            description: `Histórico completo de consultas de ${patient.name}`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "patient-history://all",
            name: "Todos os Históricos de Pacientes",
            description: "Históricos completos de consultas de todos os pacientes",
            mimeType: "application/json"
          });

          return { resources };
        } catch (error) {
          console.error('Erro ao buscar pacientes para recursos:', error);
          return { resources: [] };
        }
      }
    }
  );

  server.resource(
    "Histórico de Pacientes",
    patientHistoryTemplate,
    { description: "Recursos dinâmicos de histórico de pacientes" },
    async (uri: URL, variables: any) => {
      try {
        if (uri.pathname === "/all") {
          const [patients, appointments] = await Promise.all([
            apiClient.get('/patients'),
            apiClient.get('/appointments')
          ]);
          
          const pacientesHistoricos = patients.data.map((patient: any) => {
            const consultasPaciente = appointments.data.filter(
              (apt: any) => apt.patient_id === patient.id
            );
            
            const consultasOrdenadas = consultasPaciente.sort(
              (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return {
              id_paciente: patient.id,
              nome_paciente: patient.name,
              email_paciente: patient.email,
              telefone_paciente: patient.phone,
              total_consultas: consultasPaciente.length,
              consultas: consultasOrdenadas.map((apt: any) => ({
                id: apt.id,
                data: apt.date,
                horario: apt.time,
                id_medico: apt.doctor_id,
                nome_medico: apt.doctor_name,
                tipo: apt.type || 'consulta',
                status: apt.status || 'completada',
                observacoes: apt.notes || '',
                duracao: apt.duration || 30,
                criada_em: apt.created_at
              })),
              resumo: {
                primeira_consulta: consultasOrdenadas[consultasOrdenadas.length - 1]?.date,
                ultima_consulta: consultasOrdenadas[0]?.date,
                medicos_frequentes: getFrequentDoctors(consultasPaciente),
                tipos_consulta: getAppointmentTypes(consultasPaciente),
                intervalo_medio: calculateAverageInterval(consultasOrdenadas)
              }
            };
          });

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ historicos_pacientes: pacientesHistoricos }, null, 2)
              }
            ]
          };
        }

        // Lidar com histórico individual de paciente
        const patientId = variables.patient_id;
        const [patient, appointments] = await Promise.all([
          apiClient.get(`/patients/${patientId}`),
          apiClient.get('/appointments')
        ]);
        
        const consultasPaciente = appointments.data.filter(
          (apt: any) => apt.patient_id === parseInt(patientId)
        );
        
        const consultasOrdenadas = consultasPaciente.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const historico = {
          paciente: {
            id: patient.data.id,
            nome: patient.data.name,
            email: patient.data.email,
            telefone: patient.data.phone,
            data_nascimento: patient.data.birth_date,
            endereco: patient.data.address
          },
          total_consultas: consultasPaciente.length,
          consultas: consultasOrdenadas.map((apt: any) => ({
            id: apt.id,
            data: apt.date,
            horario: apt.time,
            id_medico: apt.doctor_id,
            nome_medico: apt.doctor_name,
            tipo: apt.type || 'consulta',
            status: apt.status || 'completada',
            observacoes: apt.notes || '',
            duracao: apt.duration || 30,
            criada_em: apt.created_at
          })),
          resumo: {
            primeira_consulta: consultasOrdenadas[consultasOrdenadas.length - 1]?.date,
            ultima_consulta: consultasOrdenadas[0]?.date,
            medicos_frequentes: getFrequentDoctors(consultasPaciente),
            tipos_consulta: getAppointmentTypes(consultasPaciente),
            intervalo_medio: calculateAverageInterval(consultasOrdenadas),
            consultas_futuras: consultasPaciente.filter(
              (apt: any) => new Date(apt.date) > new Date()
            ).length
          }
        };

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(historico, null, 2)
            }
          ]
        };

      } catch (error) {
        console.error('Erro ao ler recurso de histórico de paciente:', error);
        throw new Error(`Falha ao ler histórico de paciente: ${uri.href}`);
      }
    }
  );
}