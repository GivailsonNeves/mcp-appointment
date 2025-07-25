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
              text: "Warning: The specified date is in the past. These appointments can no longer be scheduled.",
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
              text: "Warning: The specified date is in the past. These appointments can no longer be scheduled.",
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
        "Update an existing appointment with conflict validations",
        {
          id: z.string().describe("ID of the appointment to be updated"),
          patientId: z.string().optional().describe("New patient ID"),
          doctorId: z.string().optional().describe("New doctor ID"),
          date: z.string().optional().describe("New appointment date (YYYY-MM-DD)"),
          time: z.enum(["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]).optional().describe("New appointment time"),
          notes: z.string().optional().describe("Additional notes about the appointment"),
          status: z.enum(["scheduled", "confirmed", "cancelled", "completed"]).optional().describe("Appointment status"),
        },
        async (params) => {
          const { id, ...updateData } = params;

          try {
            // Remover campos undefined
            const cleanData = Object.fromEntries(
              Object.entries(updateData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(cleanData).length === 0) {
              throw new Error("No fields to update were provided");
            }

            // Validate date if provided
            if (cleanData.date) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const [year, month, day] = cleanData.date.split("-").map(Number);
              const appointmentDate = new Date(year, month - 1, day);
              
              if (appointmentDate < today) {
                throw new Error("Cannot update appointments to past dates");
              }
            }

            // If changing doctor or date/time, check for conflicts
            if (cleanData.doctorId || cleanData.date || cleanData.time) {
              const appointment = await apiClient.get(`/appointments/${id}`);
              const currentAppointment = appointment.data;
              
              const checkDoctorId = cleanData.doctorId || currentAppointment.doctor_id;
              const checkDate = cleanData.date || currentAppointment.date;
              const checkTime = cleanData.time || currentAppointment.time;

              // Check doctor availability
              const availabilityResponse = await apiClient.get(
                `appointments/doctor/${checkDoctorId}/available-times/${checkDate}`
              );
              
              const availableTimes = availabilityResponse.data.available_times || [];
              if (!availableTimes.includes(checkTime)) {
                throw new Error(`Time ${checkTime} is not available for the doctor on date ${checkDate}`);
              }
            }

            const { data } = await apiClient.put(`/appointments/${id}`, cleanData);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Appointment updated successfully",
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
                    error: "Error updating appointment",
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
          id: z.string().describe("ID of the appointment to be cancelled"),
          reason: z.string().optional().describe("Motivo do cancelamento"),
          softDelete: z.boolean().optional().describe("Se true, apenas marca como cancelada. Se false, exclui permanentemente"),
        },
        async ({ id, reason, softDelete = true }) => {
          try {
            // Fetch the appointment first for validations
            const appointmentResponse = await apiClient.get(`/appointments/${id}`);
            const appointment = appointmentResponse.data;

            if (!appointment) {
              throw new Error("Appointment not found");
            }

            // Check if the appointment is not in the past (with 2h advance notice)
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
                      error: "Appointment cannot be cancelled",
                      details: "Appointments can only be cancelled with at least 2 hours advance notice",
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
                    message: softDelete ? "Appointment cancelled successfully" : "Appointment permanently deleted",
                    action: softDelete ? "cancelled" : "deleted",
                    appointment: {
                      id,
                      previousStatus: appointment.status,
                      reason: reason || 'Not specified'
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
                    error: "Error cancelling/deleting appointment",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );

}