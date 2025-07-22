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
        "Lista todos os pacientes com opções de paginação e filtros",
        {
          page: z.number().optional().describe("Número da página (começa em 1)"),
          limit: z.number().optional().describe("Quantidade de pacientes por página (máximo 50)"),
          search: z.string().optional().describe("Buscar por nome, email ou telefone"),
          ageRange: z.string().optional().describe("Filtrar por faixa etária (ex: '18-65')"),
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

          // Se a API não suporta paginação nativa, implementar do lado cliente
          let patients = Array.isArray(data) ? data : data.patients || [];
          
          // Aplicar filtro de busca se necessário
          if (search) {
            patients = patients.filter((patient: any) => 
              patient.name?.toLowerCase().includes(search.toLowerCase()) ||
              patient.email?.toLowerCase().includes(search.toLowerCase()) ||
              patient.phone?.toLowerCase().includes(search.toLowerCase())
            );
          }

          // Aplicar filtro de idade se necessário
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

          // Aplicar paginação
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
        "Atualizar informações de um paciente existente",
        {
          id: z.string().describe("ID do paciente a ser atualizado"),
          name: z.string().optional().describe("Novo nome do paciente"),
          email: z.string().optional().describe("Novo email do paciente"),
          phone: z.string().optional().describe("Novo telefone do paciente"),
          birthDate: z.string().optional().describe("Nova data de nascimento (YYYY-MM-DD)"),
          address: z.string().optional().describe("Novo endereço completo"),
          emergencyContact: z.string().optional().describe("Contato de emergência"),
          emergencyPhone: z.string().optional().describe("Telefone do contato de emergência"),
          allergies: z.array(z.string()).optional().describe("Lista de alergias"),
          medications: z.array(z.string()).optional().describe("Medicações em uso"),
          medicalHistory: z.string().optional().describe("Histórico médico relevante"),
        },
        async (params) => {
          const { id, ...updateData } = params;

          try {
            // Remover campos undefined para não enviar à API
            const cleanData = Object.fromEntries(
              Object.entries(updateData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(cleanData).length === 0) {
              throw new Error("Nenhum campo para atualizar foi fornecido");
            }

            // Validar data de nascimento se fornecida
            if (cleanData.birthDate && typeof cleanData.birthDate === 'string') {
              const birthDate = new Date(cleanData.birthDate);
              if (isNaN(birthDate.getTime())) {
                throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD");
              }
              if (birthDate > new Date()) {
                throw new Error("Data de nascimento não pode ser no futuro");
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
}
