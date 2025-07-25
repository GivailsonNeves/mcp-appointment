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
        "List all doctors with pagination and filter options",
        {
          page: z.number().optional().describe("Page number (starts at 1)"),
          limit: z.number().optional().describe("Number of doctors per page (maximum 50)"),
          specialty: z.string().optional().describe("Filter by specialty"),
          search: z.string().optional().describe("Search by name or email"),
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

          // If API doesn't support native pagination, implement client-side
          let doctors = Array.isArray(data) ? data : data.doctors || [];
          
          // Apply filters if necessary
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

          // Apply pagination
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
        "Update information of an existing doctor",
        {
          id: z.string().describe("ID of the doctor to be updated"),
          name: z.string().optional().describe("New doctor name"),
          email: z.string().optional().describe("New doctor email"),
          phone: z.string().optional().describe("New doctor phone"),
          specialty: z.string().optional().describe("New specialty"),
          experience: z.string().optional().describe("Professional experience"),
          qualifications: z.array(z.string()).optional().describe("List of qualifications"),
          languages: z.array(z.string()).optional().describe("Languages spoken"),
          acceptsEmergencies: z.boolean().optional().describe("Accepts emergencies"),
          officeLocation: z.string().optional().describe("Office location"),
          address: z.string().optional().describe("Complete address"),
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

            const { data } = await apiClient.put(`/doctors/${id}`, cleanData);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Doctor updated successfully",
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
                    error: "Error updating doctor",
                    details: error.response?.data?.message || error.message,
                  }, null, 2),
                },
              ],
            };
          }
        }
    );
}
