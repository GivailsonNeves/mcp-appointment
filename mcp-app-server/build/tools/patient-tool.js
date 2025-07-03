"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPatientTool = registerPatientTool;
const zod_1 = require("zod");
const api_client_1 = require("../lib/api-client");
function registerPatientTool(server) {
    server.tool("get-patient", "Retrieve an specific patient by ID or name", {
        id: zod_1.z.string().optional().describe("The ID of the patient to retrieve"),
        name: zod_1.z
            .string()
            .optional()
            .describe("The name of the patient to retrieve"),
    }, async ({ id, name }) => {
        const { data } = await api_client_1.apiClient.get("/patients", {
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
    });
    server.tool("get-pantient-appointments", "Retrieve all appointments for a specific pantient", {
        patientId: zod_1.z.string().describe("The ID of the patient to retrieve appointments for"),
        date: zod_1.z
            .string()
            .optional()
            .describe("The date to filter appointments (YYYY-MM-DD format)"),
    }, async ({ patientId, date }) => {
        const { data } = await api_client_1.apiClient.get(`/appointments/patient/${patientId}`, {
            params: {
                date,
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
    });
}
