"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAppointmentsTool = registerAppointmentsTool;
const zod_1 = require("zod");
const api_client_1 = require("../lib/api-client");
function registerAppointmentsTool(server) {
    server.tool("get-appointment", "Retrieve an specific appointment by ID", {
        id: zod_1.z.string().describe("The ID of the appointment to retrieve"),
    }, async ({ id }) => {
        const { data } = await api_client_1.apiClient.get(`/appointments/${id}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    });
    server.tool("list-appointments", "List all appointments with optional filters", {
        date: zod_1.z
            .string()
            .optional()
            .describe("Filter by appointment date (YYYY-MM-DD format)"),
    }, async ({ date }) => {
        const { data } = await api_client_1.apiClient.get("/appointments", {
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
    });
    server.tool("create-appointment", "Create a new appointment", {
        patientId: zod_1.z.string().describe("The ID of the patient"),
        doctorId: zod_1.z.string().describe("The ID of the doctor"),
        date: zod_1.z.string().describe("The date of the appointment (YYYY-MM-DD)"),
        time: zod_1.z.array(zod_1.z.enum(["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"])).describe("The time of the appointment (HH:mm)"),
    }, async ({ patientId, doctorId, date, time }) => {
        const { data } = await api_client_1.apiClient.post("/appointments", {
            patientId,
            doctorId,
            date,
            time,
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
    server.tool("list-doctor-available-times", "List available times for a specific doctor on a given date", {
        doctorId: zod_1.z.string().describe("The ID of the doctor"),
        date: zod_1.z.string().describe("The date to check availability (YYYY-MM-DD)"),
    }, async ({ doctorId, date }) => {
        const { data } = await api_client_1.apiClient.get(`appointments/doctor/${doctorId}/available-times/${date}`);
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
