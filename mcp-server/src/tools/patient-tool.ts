import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiClient } from "../lib/api-client";

export function registerPatientTool(server: McpServer) {
    server.tool(
      "get-patient",
      "Retrieve an specific patient by ID or name",
      {
        id: z.string().optional().describe("The ID of the patient to retrieve"),
        name: z
          .string()
          .optional()
          .describe("The name of the patient to retrieve"),
      },
      async ({ id, name }) => {
        const {data} = await apiClient.get("/patients", {
          params: {
            id,
            name,
            },
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
        "get-patient-appointments",
        "Retrieve all appointments for a specific patient",
        {
          patientId: z.string().describe("The ID of the patient to retrieve appointments for"),
          date: z
            .string()
            .optional()
            .describe("The date to filter appointments (YYYY-MM-DD format)"),
        },
        async ({ patientId, date }) => {
          const { data } = await apiClient.get(
            `/appointments/patient/${patientId}`,
            {
              params: {
                date,
              },
            }
          );

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
        "list-patients",
        "List all patients with pagination and filter options",
        {
          page: z.number().optional().describe("Page number (starts at 1)"),
          limit: z.number().optional().describe("Number of patients per page (maximum 50)"),
          search: z.string().optional().describe("Search by name, email or phone"),
          ageRange: z.string().optional().describe("Filter by age range (e.g.: '18-65')"),
        },
        async ({ page = 1, limit = 20, search, ageRange }) => {
          // Validar limites
          if (limit > 50) limit = 50;
          if (page < 1) page = 1;

          const { data } = await apiClient.get("/patients", {
            params: {
              page,
              limit,
              search,
              ageRange,
            },
          });

          // If API doesn't support native pagination, implement client-side
          let patients = Array.isArray(data) ? data : data.patients || [];
          
          // Apply search filter if necessary
          if (search) {
            patients = patients.filter((patient: any) => 
              patient.name?.toLowerCase().includes(search.toLowerCase()) ||
              patient.email?.toLowerCase().includes(search.toLowerCase()) ||
              patient.phone?.toLowerCase().includes(search.toLowerCase())
            );
          }

          // Apply age filter if necessary
          if (ageRange) {
            const [minAge, maxAge] = ageRange.split('-').map(Number);
            patients = patients.filter((patient: any) => {
              if (!patient.birth_date) return true;
              const birthDate = new Date(patient.birth_date);
              const today = new Date();
              const age = today.getFullYear() - birthDate.getFullYear();
              return age >= (minAge || 0) && age <= (maxAge || 150);
            });
          }

          // Apply pagination
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedPatients = patients.slice(startIndex, endIndex);
          
          const totalCount = patients.length;
          const totalPages = Math.ceil(totalCount / limit);

          const result = {
            patients: paginatedPatients,
            pagination: {
              currentPage: page,
              totalPages,
              totalCount,
              limit,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            },
            filters: {
              search: search || null,
              ageRange: ageRange || null,
            }
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
    );

    server.tool(
        "update-patient",
        "Update information of an existing patient",
        {
          id: z.string().describe("ID of the patient to be updated"),
          name: z.string().optional().describe("New patient name"),
          email: z.string().optional().describe("New patient email"),
          phone: z.string().optional().describe("New patient phone"),
          birthDate: z.string().optional().describe("New birth date (YYYY-MM-DD)"),
          address: z.string().optional().describe("New complete address"),
          emergencyContact: z.string().optional().describe("Emergency contact"),
          emergencyPhone: z.string().optional().describe("Emergency contact phone"),
          allergies: z.array(z.string()).optional().describe("List of allergies"),
          medications: z.array(z.string()).optional().describe("Medications in use"),
          medicalHistory: z.string().optional().describe("Relevant medical history"),
        },
        async (params) => {
          const { id, ...updateData } = params;

          try {
            // Remove undefined fields to not send to API
            const cleanData = Object.fromEntries(
              Object.entries(updateData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(cleanData).length === 0) {
              throw new Error("No fields to update were provided");
            }

            // Validate birth date if provided
            if (cleanData.birthDate && typeof cleanData.birthDate === 'string') {
              const birthDate = new Date(cleanData.birthDate);
              if (isNaN(birthDate.getTime())) {
                throw new Error("Invalid birth date. Use YYYY-MM-DD format");
              }
              if (birthDate > new Date()) {
                throw new Error("Birth date cannot be in the future");
              }
            }

            const { data } = await apiClient.put(`/patients/${id}`, cleanData);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Paciente atualizado com sucesso",
                    patient: data,
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
                    error: "Erro ao atualizar paciente",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );

    server.tool(
        "create-patient",
        "Create a new patient record",
        {
            name: z.string().describe("The full name of the patient"),
            email: z.string().email().optional().describe("The email address of the patient"),
            phone: z.string().describe("The phone number of the patient"),
            birthDate: z.string().optional().describe("The patient's birth date (YYYY-MM-DD)"),
            address: z.string().optional().describe("The patient's full address"),
        },
        async (params) => {
            try {
                const { data } = await apiClient.post("/patients", params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                message: "Patient created successfully",
                                patient: data,
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
                                error: "Error creating patient",
                                details: error.response?.data?.message || error.message,
                            }, null, 2),
                        },
                    ],
                };
            }
        }
    );
}
