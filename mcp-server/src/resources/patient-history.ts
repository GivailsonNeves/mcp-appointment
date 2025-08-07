import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client";
import { getFrequentDoctors, getAppointmentTypes, calculateAverageInterval } from "./utils/analysis-helpers";

export function registerPatientHistoryResources(server: McpServer) {
  // Template for dynamic patient history
  const patientHistoryTemplate = new ResourceTemplate(
    "patient-history://{patient_id}",
    {
      list: async () => {
        try {
          const patients = await apiClient.get('/patients');
          const resources = patients.data.map((patient: any) => ({
            uri: `patient-history://${patient.id}`,
            name: `Medical History of ${patient.name}`,
            description: `Complete appointment history of ${patient.name}`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "patient-history://all",
            name: "All Patient Histories",
            description: "Complete appointment histories of all patients",
            mimeType: "application/json"
          });

          return { resources };
        } catch (error) {
          console.error('Error fetching patients for resources:', error);
          return { resources: [] };
        }
      }
    }
  );

  server.resource(
    "Patient History",
    patientHistoryTemplate,
    { description: "Dynamic patient history resources" },
    async (uri: URL, variables: any) => {
      try {
        if (uri.pathname === "/all") {
          const [patients, appointments] = await Promise.all([
            apiClient.get('/patients'),
            apiClient.get('/appointments')
          ]);
          
          const patientHistories = patients.data.map((patient: any) => {
            const patientAppointments = appointments.data.filter(
              (apt: any) => apt.patient_id === patient.id
            );
            
            const sortedAppointments = patientAppointments.sort(
              (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return {
              patient_id: patient.id,
              patient_name: patient.name,
              patient_email: patient.email,
              patient_phone: patient.phone,
              total_appointments: patientAppointments.length,
              appointments: sortedAppointments.map((apt: any) => ({
                id: apt.id,
                date: apt.date,
                time: apt.time,
                doctor_id: apt.doctor_id,
                doctor_name: apt.doctor_name,
                type: apt.type || 'consultation',
                status: apt.status || 'completed',
                notes: apt.notes || '',
                duration: apt.duration || 30,
                created_at: apt.created_at
              })),
              summary: {
                first_appointment: sortedAppointments[sortedAppointments.length - 1]?.date,
                last_appointment: sortedAppointments[0]?.date,
                frequent_doctors: getFrequentDoctors(patientAppointments),
                appointment_types: getAppointmentTypes(patientAppointments),
                average_interval: calculateAverageInterval(sortedAppointments)
              }
            };
          });

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ patient_histories: patientHistories }, null, 2)
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
            phone: patient.data.phone,
            birth_date: patient.data.birth_date,
            address: patient.data.address
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