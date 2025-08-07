import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client";
import { getBusiestDay } from "./utils/analysis-helpers";
import * as fs from 'fs';
import * as path from 'path';

// Load JSON data synchronously
const crudGuideData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/crud-operations-guide.json'), 'utf8')
);

export function registerSystemResources(server: McpServer) {
  // CRUD Operations Guide
  server.resource(
    "CRUD Operations Guide",
    "crud-operations://guide",
    { description: "Complete guide of available CRUD operations" },
    async () => {
      return {
        contents: [
          {
            uri: "crud-operations://guide",
            mimeType: "application/json",
            text: JSON.stringify(crudGuideData, null, 2)
          }
        ]
      };
    }
  );

  // System Statistics
  server.resource(
    "System Statistics",
    "system://statistics",
    { description: "Real-time statistics of the appointment system" },
    async () => {
      try {
        const [doctors, patients, appointments] = await Promise.all([
          apiClient.get('/doctors'),
          apiClient.get('/patients'),
          apiClient.get('/appointments')
        ]);

        const allDoctors = Array.isArray(doctors.data) ? doctors.data : doctors.data.doctors || [];
        const allPatients = Array.isArray(patients.data) ? patients.data : patients.data.patients || [];
        const allAppointments = Array.isArray(appointments.data) ? appointments.data : appointments.data.appointments || [];

        // Calculate statistics
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const todayAppointments = allAppointments.filter((apt: any) => apt.date === todayStr);
        const futureAppointments = allAppointments.filter((apt: any) => new Date(apt.date) > today);
        const completedAppointments = allAppointments.filter((apt: any) => apt.status === 'completed' || new Date(apt.date) < today);
        const cancelledAppointments = allAppointments.filter((apt: any) => apt.status === 'cancelled');

        // Most common specialties
        const specialtyCount = allDoctors.reduce((acc: any, doctor: any) => {
          const specialty = doctor.specialty || 'General Practice';
          acc[specialty] = (acc[specialty] || 0) + 1;
          return acc;
        }, {});

        const statistics = {
          timestamp: new Date().toISOString(),
          system_status: "operational",
          totals: {
            doctors: allDoctors.length,
            patients: allPatients.length,
            appointments: allAppointments.length
          },
          appointments_breakdown: {
            today: todayAppointments.length,
            future: futureAppointments.length,
            completed: completedAppointments.length,
            cancelled: cancelledAppointments.length
          },
          specialties: Object.entries(specialtyCount)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([specialty, count]) => ({ specialty, count })),
          availability: {
            doctors_with_appointments_today: todayAppointments
              .map((apt: any) => apt.doctor_id)
              .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index).length,
            busiest_day: getBusiestDay(allAppointments),
            average_appointments_per_doctor: allDoctors.length > 0 ? Math.round(allAppointments.length / allDoctors.length) : 0
          },
          crud_operations_info: {
            available_tools: 13,
            read_operations: 6,
            create_operations: 1,
            update_operations: 3,
            delete_operations: 1,
            utility_operations: 2
          }
        };

        return {
          contents: [
            {
              uri: "system://statistics",
              mimeType: "application/json",
              text: JSON.stringify(statistics, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: "system://statistics",
              mimeType: "application/json",
              text: JSON.stringify({
                error: "Unable to fetch system statistics",
                timestamp: new Date().toISOString(),
                details: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}