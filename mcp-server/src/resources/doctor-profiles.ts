import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client";

export function registerDoctorProfileResources(server: McpServer) {
  // Template for dynamic doctor profiles
  const doctorProfileTemplate = new ResourceTemplate(
    "doctor-profiles://{doctor_id}",
    {
      list: async () => {
        try {
          const doctors = await apiClient.get('/doctors');
          const resources = doctors.data.map((doctor: any) => ({
            uri: `doctor-profiles://${doctor.id}`,
            name: `Dr. ${doctor.name} Profile`,
            description: `Complete profile of Dr. ${doctor.name} including specialties and schedules`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "doctor-profiles://all", 
            name: "All Doctor Profiles",
            description: "Complete profiles of all doctors in the system",
            mimeType: "application/json"
          });

          return { resources };
        } catch (error) {
          console.error('Error fetching doctors for resources:', error);
          return { resources: [] };
        }
      }
    }
  );

  server.resource(
    "Doctor Profiles",
    doctorProfileTemplate,
    { description: "Dynamic doctor profile resources" },
    async (uri: URL, variables: any) => {
      try {
        if (uri.pathname === "/all") {
          const doctors = await apiClient.get('/doctors');
          
          const profiles = doctors.data.map((doctor: any) => ({
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialty: doctor.specialty || 'General Practice',
            qualifications: doctor.qualifications || [],
            experience: doctor.experience || 'Not specified',
            languages: doctor.languages || ['Portuguese'],
            schedules: {
              monday: doctor.monday_schedule || '9:00-17:00',
              tuesday: doctor.tuesday_schedule || '9:00-17:00',
              wednesday: doctor.wednesday_schedule || '9:00-17:00',
              thursday: doctor.thursday_schedule || '9:00-17:00', 
              friday: doctor.friday_schedule || '9:00-17:00',
              saturday: doctor.saturday_schedule || 'Closed',
              sunday: doctor.sunday_schedule || 'Closed'
            },
            appointment_types: ['consultation', 'checkup', 'followup'],
            average_appointment_time: 30,
            accepts_emergencies: doctor.accepts_emergencies || false,
            location_info: {
              office: doctor.office_location || 'Main Office',
              address: doctor.address || 'Not specified'
            }
          }));

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ doctors: profiles }, null, 2)
              }
            ]
          };
        }

        // Handle individual doctor profile  
        const doctorId = variables.doctor_id;
        const doctor = await apiClient.get(`/doctors/${doctorId}`);
        
        const profile = {
          id: doctor.data.id,
          name: doctor.data.name,
          email: doctor.data.email,
          phone: doctor.data.phone,
          specialty: doctor.data.specialty || 'General Practice',
          qualifications: doctor.data.qualifications || [],
          experience: doctor.data.experience || 'Not specified',
          languages: doctor.data.languages || ['Portuguese'],
          schedules: {
            monday: doctor.data.monday_schedule || '9:00-17:00',
            tuesday: doctor.data.tuesday_schedule || '9:00-17:00',
            wednesday: doctor.data.wednesday_schedule || '9:00-17:00',
            thursday: doctor.data.thursday_schedule || '9:00-17:00',
            friday: doctor.data.friday_schedule || '9:00-17:00',
            saturday: doctor.data.saturday_schedule || 'Closed',
            sunday: doctor.data.sunday_schedule || 'Closed'
          },
          appointment_types: ['consultation', 'checkup', 'followup'],
          average_appointment_time: 30,
          accepts_emergencies: doctor.data.accepts_emergencies || false,
          location_info: {
            office: doctor.data.office_location || 'Main Office',
            address: doctor.data.address || 'Not specified'
          },
          statistics: {
            total_appointments: doctor.data.total_appointments || 0,
            upcoming_appointments: doctor.data.upcoming_appointments || 0,
            rating: doctor.data.rating || 'Not rated'
          }
        };

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(profile, null, 2)
            }
          ]
        };

      } catch (error) {
        console.error('Error reading doctor profile resource:', error);
        throw new Error(`Failed to read doctor profile: ${uri.href}`);
      }
    }
  );
}