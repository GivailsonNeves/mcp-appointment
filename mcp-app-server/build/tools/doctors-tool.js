"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDoctorsTool = registerDoctorsTool;
const zod_1 = require("zod");
const api_client_1 = require("../lib/api-client");
function registerDoctorsTool(server) {
    server.tool("get-doctor", "Retrieve an specific doctor by ID or name", {
        id: zod_1.z.string().optional().describe("The ID of the doctor to retrieve"),
        name: zod_1.z
            .string()
            .optional()
            .describe("The name of the doctor to retrieve"),
    }, async ({ id, name }) => {
        const { data } = await api_client_1.apiClient.get("/doctors", {
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
    server.tool("get-doctor-appointments", "Retrieve all appointments for a specific doctor", {
        doctorId: zod_1.z.string().describe("The ID of the doctor to retrieve appointments for"),
        date: zod_1.z
            .string()
            .optional()
            .describe("The date to filter appointments (YYYY-MM-DD format)"),
    }, async ({ doctorId, date }) => {
        const { data } = await api_client_1.apiClient.get(`/appointments/doctor/${doctorId}`, {
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
