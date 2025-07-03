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
        "get-pantient-appointments",
        "Retrieve all appointments for a specific pantient",
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
    )
}
