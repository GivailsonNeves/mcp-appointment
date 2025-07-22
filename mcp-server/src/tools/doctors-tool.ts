import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiClient } from "../lib/api-client";

export function registerDoctorsTool(server: McpServer) {
    server.tool(
      "get-doctor",
      "Retrieve an specific doctor by ID or name",
      {
        id: z.string().optional().describe("The ID of the doctor to retrieve"),
        name: z
          .string()
          .optional()
          .describe("The name of the doctor to retrieve"),
      },
      async ({ id, name }) => {
        const {data} = await apiClient.get("/doctors", {
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
        "get-doctor-appointments",
        "Retrieve all appointments for a specific doctor",
        {
          doctorId: z.string().describe("The ID of the doctor to retrieve appointments for"),
          date: z
            .string()
            .optional()
            .describe("The date to filter appointments (YYYY-MM-DD format)"),
        },
        async ({ doctorId, date }) => {
          const { data } = await apiClient.get(
            `/appointments/doctor/${doctorId}`,
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
        "list-doctors",
        "Lista todos os médicos com opções de paginação e filtros",
        {
          page: z.number().optional().describe("Número da página (começa em 1)"),
          limit: z.number().optional().describe("Quantidade de médicos por página (máximo 50)"),
          specialty: z.string().optional().describe("Filtrar por especialidade"),
          search: z.string().optional().describe("Buscar por nome ou email"),
        },
        async ({ page = 1, limit = 20, specialty, search }) => {
          // Validar limites
          if (limit > 50) limit = 50;
          if (page < 1) page = 1;

          const { data } = await apiClient.get("/doctors", {
            params: {
              page,
              limit,
              specialty,
              search,
            },
          });

          // Se a API não suporta paginação nativa, implementar do lado cliente
          let doctors = Array.isArray(data) ? data : data.doctors || [];
          
          // Aplicar filtros se necessário
          if (specialty) {
            doctors = doctors.filter((doctor: any) => 
              doctor.specialty?.toLowerCase().includes(specialty.toLowerCase())
            );
          }

          if (search) {
            doctors = doctors.filter((doctor: any) => 
              doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
              doctor.email?.toLowerCase().includes(search.toLowerCase())
            );
          }

          // Aplicar paginação
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedDoctors = doctors.slice(startIndex, endIndex);
          
          const totalCount = doctors.length;
          const totalPages = Math.ceil(totalCount / limit);

          const result = {
            doctors: paginatedDoctors,
            pagination: {
              currentPage: page,
              totalPages,
              totalCount,
              limit,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            },
            filters: {
              specialty: specialty || null,
              search: search || null,
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
        "update-doctor",
        "Atualizar informações de um médico existente",
        {
          id: z.string().describe("ID do médico a ser atualizado"),
          name: z.string().optional().describe("Novo nome do médico"),
          email: z.string().optional().describe("Novo email do médico"),
          phone: z.string().optional().describe("Novo telefone do médico"),
          specialty: z.string().optional().describe("Nova especialidade"),
          experience: z.string().optional().describe("Experiência profissional"),
          qualifications: z.array(z.string()).optional().describe("Lista de qualificações"),
          languages: z.array(z.string()).optional().describe("Idiomas falados"),
          acceptsEmergencies: z.boolean().optional().describe("Aceita emergências"),
          officeLocation: z.string().optional().describe("Localização do consultório"),
          address: z.string().optional().describe("Endereço completo"),
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

            const { data } = await apiClient.put(`/doctors/${id}`, cleanData);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Médico atualizado com sucesso",
                    doctor: data,
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
                    error: "Erro ao atualizar médico",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );
}
