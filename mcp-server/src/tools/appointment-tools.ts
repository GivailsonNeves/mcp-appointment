import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiClient } from "../lib/api-client";

export function registerAppointmentsTool(server: McpServer) {
    server.tool(
      "get-appointment",
      "Retrieve an specific appointment by ID",
      {
        id: z.string().describe("The ID of the appointment to retrieve"),
      },
      async ({ id }) => {
        const { data } = await apiClient.get(`/appointments/${id}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }
    );

    server.tool(
      "list-appointments",
      "List all appointments with optional filters",
      {
        date: z
          .string()
          .optional()
          .describe("Filter by appointment date (YYYY-MM-DD format)"),
      },
      async ({ date }) => {
        const { data } = await apiClient.get("/appointments", {
          params: { date },
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }
    );
    server.tool(
      "create-appointment",
      "Create a new appointment, creating the patient if it does not exist. Always ask for the full name (including last name) and phone number if the patient needs to be created.",
      {
        patientId: z.string().optional().describe("The ID of the patient. If not provided, a new patient will be created"),
        patientName: z.string().optional().describe("The full name of the patient to be created. If the last name is missing, you must ask for it."),
        patientPhone: z.string().optional().describe("The phone of the patient to be created"),
        doctorId: z.string().describe("The ID of the doctor"),
        date: z.string().describe("The date of the appointment (YYYY-MM-DD)"),
        time: z.string(z.enum(["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"])).describe("The time of the appointment (HH:mm)"),
      },
      async ({ patientId, patientName, patientPhone, doctorId, date, time }) => {
        let finalPatientId = patientId;

        if (!finalPatientId) {
            if (!patientName || !patientPhone) {
                throw new Error("Patient name and phone are required to create a new patient.");
            }
            if (patientName.split(" ").length < 2) {
                throw new Error("The patient's full name (including last name) is required.");
            }
            const { data: newPatient } = await apiClient.post("/patients", {
                name: patientName,
                phone: patientPhone,
            });
            finalPatientId = newPatient.id;
        }

        const { data } = await apiClient.post("/appointments", {
          patientId: finalPatientId,
          doctorId,
          date,
          time,
          assistant: true,
        });

        const content: any[] = [{
          type: "text",
          text: JSON.stringify(data, null, 2),
        }];

        if (date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const [year, month, day] = date.split("-").map(Number);
          const inputDate = new Date(year, month - 1, day);
          if (inputDate < today) {
            content.unshift({
              type: "text",
              text: "Aviso: A data especificada está no passado. Esses agendamentos não podem mais ser marcados.",
            });
          }
        }

        return {
          content,
        };
      }
    );
    server.tool(
      "list-doctor-available-times",
      "List available times for a specific doctor on a given date",
      {
        doctorId: z.string().describe("The ID of the doctor"),
        date: z.string().describe("The date to check availability (YYYY-MM-DD)"),
      },
      async ({ doctorId, date }) => {
        const { data } = await apiClient.get(
          `appointments/doctor/${doctorId}/available-times/${date}`
        );
        const content: any[] = [{
          type: "text",
          text: JSON.stringify(data, null, 2),
        }];

        if (date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const [year, month, day] = date.split("-").map(Number);
          const inputDate = new Date(year, month - 1, day);
          if (inputDate < today) {
            content.unshift({
              type: "text",
              text: "Aviso: A data especificada está no passado. Esses agendamentos não podem mais ser marcados.",
            });
          }
        }

        return {
          content,
        };
      }
    );

    server.tool(
        "update-appointment",
        "Atualizar uma consulta existente com validações de conflito",
        {
          id: z.string().describe("ID da consulta a ser atualizada"),
          patientId: z.string().optional().describe("Novo ID do paciente"),
          doctorId: z.string().optional().describe("Novo ID do médico"),
          date: z.string().optional().describe("Nova data da consulta (YYYY-MM-DD)"),
          time: z.enum(["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]).optional().describe("Novo horário da consulta"),
          notes: z.string().optional().describe("Notas adicionais sobre a consulta"),
          status: z.enum(["scheduled", "confirmed", "cancelled", "completed"]).optional().describe("Status da consulta"),
        },
        async (params) => {
          const { id, ...updateData } = params;

          try {
            // Remover campos undefined
            const cleanData = Object.fromEntries(
              Object.entries(updateData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(cleanData).length === 0) {
              throw new Error("Nenhum campo para atualizar foi fornecido");
            }

            // Validar data se fornecida
            if (cleanData.date) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const [year, month, day] = cleanData.date.split("-").map(Number);
              const appointmentDate = new Date(year, month - 1, day);
              
              if (appointmentDate < today) {
                throw new Error("Não é possível atualizar consultas para datas passadas");
              }
            }

            // Se alterando médico ou data/hora, verificar conflitos
            if (cleanData.doctorId || cleanData.date || cleanData.time) {
              const appointment = await apiClient.get(`/appointments/${id}`);
              const currentAppointment = appointment.data;
              
              const checkDoctorId = cleanData.doctorId || currentAppointment.doctor_id;
              const checkDate = cleanData.date || currentAppointment.date;
              const checkTime = cleanData.time || currentAppointment.time;

              // Verificar disponibilidade do médico
              const availabilityResponse = await apiClient.get(
                `appointments/doctor/${checkDoctorId}/available-times/${checkDate}`
              );
              
              const availableTimes = availabilityResponse.data.available_times || [];
              if (!availableTimes.includes(checkTime)) {
                throw new Error(`Horário ${checkTime} não está disponível para o médico na data ${checkDate}`);
              }
            }

            const { data } = await apiClient.put(`/appointments/${id}`, cleanData);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Consulta atualizada com sucesso",
                    appointment: data,
                    updatedFields: Object.keys(cleanData),
                  }, null, 2),
                },
              ],
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: "Erro ao atualizar consulta",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );

    server.tool(
        "delete-appointment",
        "Cancelar/excluir uma consulta com validação apropriada",
        {
          id: z.string().describe("ID da consulta a ser cancelada"),
          reason: z.string().optional().describe("Motivo do cancelamento"),
          softDelete: z.boolean().optional().describe("Se true, apenas marca como cancelada. Se false, exclui permanentemente"),
        },
        async ({ id, reason, softDelete = true }) => {
          try {
            // Buscar a consulta primeiro para validações
            const appointmentResponse = await apiClient.get(`/appointments/${id}`);
            const appointment = appointmentResponse.data;

            if (!appointment) {
              throw new Error("Consulta não encontrada");
            }

            // Verificar se a consulta não está no passado (com 2h de antecedência)
            const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
            const now = new Date();
            const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

            if (appointmentDateTime < twoHoursFromNow && appointment.status !== 'completed') {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      success: false,
                      error: "Consulta não pode ser cancelada",
                      details: "Consultas só podem ser canceladas com pelo menos 2 horas de antecedência",
                      appointment: {
                        id: appointment.id,
                        date: appointment.date,
                        time: appointment.time,
                        status: appointment.status
                      }
                    }, null, 2),
                  },
                ],
              };
            }

            let result;
            if (softDelete) {
              // Soft delete - apenas marcar como cancelada
              result = await apiClient.put(`/appointments/${id}`, {
                status: 'cancelled',
                cancellation_reason: reason || 'Cancelada via assistente',
                cancelled_at: new Date().toISOString()
              });
            } else {
              // Hard delete - excluir permanentemente
              result = await apiClient.delete(`/appointments/${id}`);
            }

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: softDelete ? "Consulta cancelada com sucesso" : "Consulta excluída permanentemente",
                    action: softDelete ? "cancelled" : "deleted",
                    appointment: {
                      id,
                      previousStatus: appointment.status,
                      reason: reason || 'Não especificado'
                    },
                    data: result.data || null
                  }, null, 2),
                },
              ],
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: "Erro ao cancelar/excluir consulta",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );

}