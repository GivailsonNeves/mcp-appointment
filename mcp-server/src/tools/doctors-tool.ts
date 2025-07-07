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
    )
}
