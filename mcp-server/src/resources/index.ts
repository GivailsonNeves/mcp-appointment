import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiClient } from "../lib/api-client.js";

export function registerAllResources(server: McpServer) {
  // Register appointment template resources
  server.resource(
    "Consultation Template",
    "appointment-templates://consultation",
    { description: "Template for general medical consultation" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://consultation",
            mimeType: "application/json",
            text: JSON.stringify({
              type: "consultation",
              duration: 30,
              description: "General medical consultation",
              requirements: ["patient_id", "doctor_id", "date", "time"],
              defaultNotes: "General consultation appointment",
              category: "routine",
              allowedTimeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Checkup Template", 
    "appointment-templates://checkup",
    { description: "Template for annual health checkup" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://checkup",
            mimeType: "application/json",
            text: JSON.stringify({
              type: "checkup",
              duration: 45,
              description: "Annual routine health checkup",
              requirements: ["patient_id", "doctor_id", "date", "time"],
              defaultNotes: "Annual health checkup - comprehensive examination", 
              category: "preventive",
              allowedTimeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Follow-up Template",
    "appointment-templates://followup", 
    { description: "Template for follow-up appointments" },
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://followup",
            mimeType: "application/json", 
            text: JSON.stringify({
              type: "followup",
              duration: 20,
              description: "Follow-up appointment for previous consultation",
              requirements: ["patient_id", "doctor_id", "date", "time", "previous_appointment_id"],
              defaultNotes: "Follow-up appointment",
              category: "followup",
              allowedTimeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Emergency Template",
    "appointment-templates://emergency",
    { description: "Template for emergency consultations" }, 
    async () => {
      return {
        contents: [
          {
            uri: "appointment-templates://emergency",
            mimeType: "application/json",
            text: JSON.stringify({
              type: "emergency",
              duration: 15,
              description: "Emergency consultation", 
              requirements: ["patient_id", "doctor_id", "urgency_level"],
              defaultNotes: "Emergency consultation - urgent care required",
              category: "emergency",
              allowedTimeSlots: "any",
              priority: "high"
            }, null, 2)
          }
        ]
      };
    }
  );

  // Register schedule template resources
  server.resource(
    "Standard Weekday Schedule",
    "schedule-templates://standard-weekday",
    { description: "Monday to Friday 9AM-5PM schedule template" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://standard-weekday", 
            mimeType: "application/json",
            text: JSON.stringify({
              name: "Standard Weekday Schedule",
              type: "weekday",
              description: "Standard Monday to Friday office hours",
              schedule: {
                monday: {
                  start: "09:00",
                  end: "17:00", 
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                tuesday: {
                  start: "09:00",
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30, 
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                wednesday: {
                  start: "09:00",
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                thursday: {
                  start: "09:00",
                  end: "17:00", 
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                friday: {
                  start: "09:00",
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                saturday: { closed: true },
                sunday: { closed: true }
              },
              totalWeeklyHours: 40,
              maxDailyAppointments: 16
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Extended Hours Schedule", 
    "schedule-templates://extended-hours",
    { description: "Extended weekday hours with Saturday morning" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://extended-hours",
            mimeType: "application/json",
            text: JSON.stringify({
              name: "Extended Hours Schedule",
              type: "extended",
              description: "Extended weekday hours with Saturday morning availability",
              schedule: {
                monday: {
                  start: "08:00",
                  end: "18:00",
                  lunchBreak: { start: "12:30", end: "13:30" },
                  slotDuration: 30,
                  slots: generateTimeSlots("08:00", "18:00", "12:30", "13:30", 30)
                },
                tuesday: {
                  start: "08:00", 
                  end: "18:00",
                  lunchBreak: { start: "12:30", end: "13:30" },
                  slotDuration: 30,
                  slots: generateTimeSlots("08:00", "18:00", "12:30", "13:30", 30)
                },
                wednesday: {
                  start: "08:00",
                  end: "18:00",
                  lunchBreak: { start: "12:30", end: "13:30" },
                  slotDuration: 30,
                  slots: generateTimeSlots("08:00", "18:00", "12:30", "13:30", 30)
                },
                thursday: {
                  start: "08:00",
                  end: "18:00",
                  lunchBreak: { start: "12:30", end: "13:30" },
                  slotDuration: 30,
                  slots: generateTimeSlots("08:00", "18:00", "12:30", "13:30", 30)
                },
                friday: {
                  start: "08:00",
                  end: "18:00",
                  lunchBreak: { start: "12:30", end: "13:30" },
                  slotDuration: 30,
                  slots: generateTimeSlots("08:00", "18:00", "12:30", "13:30", 30)
                },
                saturday: {
                  start: "09:00",
                  end: "13:00",
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "13:00", null, null, 30)
                },
                sunday: { closed: true }
              },
              totalWeeklyHours: 54,
              maxDailyAppointments: 20
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Part-time Schedule",
    "schedule-templates://part-time", 
    { description: "Three days per week schedule" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://part-time",
            mimeType: "application/json",
            text: JSON.stringify({
              name: "Part-time Schedule",
              type: "part-time",
              description: "Three days per week schedule",
              schedule: {
                monday: { closed: true },
                tuesday: {
                  start: "09:00",
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                wednesday: { closed: true },
                thursday: {
                  start: "09:00", 
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                friday: { closed: true },
                saturday: {
                  start: "09:00",
                  end: "17:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 30,
                  slots: generateTimeSlots("09:00", "17:00", "12:00", "13:00", 30)
                },
                sunday: { closed: true }
              },
              totalWeeklyHours: 24,
              maxDailyAppointments: 16
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Emergency Coverage Schedule",
    "schedule-templates://emergency",
    { description: "24/7 emergency coverage rotation template" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://emergency",
            mimeType: "application/json",
            text: JSON.stringify({
              name: "Emergency Coverage Schedule",
              type: "emergency",
              description: "24/7 emergency rotation coverage", 
              schedule: {
                monday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                },
                tuesday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true, 
                  slots: "on-call"
                },
                wednesday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                },
                thursday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                },
                friday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                },
                saturday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                },
                sunday: {
                  start: "00:00",
                  end: "23:59",
                  slotDuration: 15,
                  emergencyOnly: true,
                  slots: "on-call"
                }
              },
              totalWeeklyHours: 168,
              rotationRequired: true,
              maxContinuousHours: 12
            }, null, 2)
          }
        ]
      };
    }
  );

  server.resource(
    "Specialist Schedule",
    "schedule-templates://specialist", 
    { description: "Specialized consultation schedule with longer appointments" },
    async () => {
      return {
        contents: [
          {
            uri: "schedule-templates://specialist",
            mimeType: "application/json",
            text: JSON.stringify({
              name: "Specialist Schedule",
              type: "specialist",
              description: "Specialized consultations with longer appointment slots",
              schedule: {
                monday: {
                  start: "09:00",
                  end: "16:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 60,
                  slots: generateTimeSlots("09:00", "16:00", "12:00", "13:00", 60)
                },
                tuesday: {
                  start: "09:00",
                  end: "16:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 60,
                  slots: generateTimeSlots("09:00", "16:00", "12:00", "13:00", 60)
                },
                wednesday: {
                  start: "09:00", 
                  end: "16:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 60,
                  slots: generateTimeSlots("09:00", "16:00", "12:00", "13:00", 60)
                },
                thursday: {
                  start: "09:00",
                  end: "16:00",
                  lunchBreak: { start: "12:00", end: "13:00" },
                  slotDuration: 60,
                  slots: generateTimeSlots("09:00", "16:00", "12:00", "13:00", 60)
                },
                friday: { closed: true },
                saturday: { closed: true },
                sunday: { closed: true }
              },
              totalWeeklyHours: 28,
              maxDailyAppointments: 6,
              specialistType: true
            }, null, 2)
          }
        ]
      };
    }
  );

  // Register dynamic doctor profiles using template
  const doctorProfileTemplate = new ResourceTemplate(
    "doctor-profiles://{doctor_id}",
    {
      list: async () => {
        try {
          const doctors = await apiClient.get('/doctors');
          const resources = doctors.data.map((doctor: any) => ({
            uri: `doctor-profiles://${doctor.id}`,
            name: `Dr. ${doctor.name} Profile`,
            description: `Complete profile for Dr. ${doctor.name} including specialties and schedule`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "doctor-profiles://all", 
            name: "All Doctor Profiles",
            description: "Complete profiles for all doctors in the system",
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
            schedule: {
              monday: doctor.monday_schedule || '9:00-17:00',
              tuesday: doctor.tuesday_schedule || '9:00-17:00',
              wednesday: doctor.wednesday_schedule || '9:00-17:00',
              thursday: doctor.thursday_schedule || '9:00-17:00', 
              friday: doctor.friday_schedule || '9:00-17:00',
              saturday: doctor.saturday_schedule || 'Closed',
              sunday: doctor.sunday_schedule || 'Closed'
            },
            consultationTypes: ['consultation', 'checkup', 'followup'],
            averageConsultationTime: 30,
            acceptsEmergencies: doctor.accepts_emergencies || false,
            locationInfo: {
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
          schedule: {
            monday: doctor.data.monday_schedule || '9:00-17:00',
            tuesday: doctor.data.tuesday_schedule || '9:00-17:00',
            wednesday: doctor.data.wednesday_schedule || '9:00-17:00',
            thursday: doctor.data.thursday_schedule || '9:00-17:00',
            friday: doctor.data.friday_schedule || '9:00-17:00',
            saturday: doctor.data.saturday_schedule || 'Closed',
            sunday: doctor.data.sunday_schedule || 'Closed'
          },
          consultationTypes: ['consultation', 'checkup', 'followup'],
          averageConsultationTime: 30,
          acceptsEmergencies: doctor.data.accepts_emergencies || false,
          locationInfo: {
            office: doctor.data.office_location || 'Main Office',
            address: doctor.data.address || 'Not specified'
          },
          statistics: {
            totalAppointments: doctor.data.total_appointments || 0,
            upcomingAppointments: doctor.data.upcoming_appointments || 0,
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

  // Register dynamic patient history using template
  const patientHistoryTemplate = new ResourceTemplate(
    "patient-history://{patient_id}",
    {
      list: async () => {
        try {
          const patients = await apiClient.get('/patients');
          const resources = patients.data.map((patient: any) => ({
            uri: `patient-history://${patient.id}`,
            name: `${patient.name} Medical History`,
            description: `Complete appointment history for ${patient.name}`,
            mimeType: "application/json"
          }));

          resources.unshift({
            uri: "patient-history://all",
            name: "All Patient Histories",
            description: "Complete appointment histories for all patients",
            mimeType: "application/json"
          });

          return { resources };
        } catch (error) {
          console.error('Error fetching patients for resources:', error);
          return { resources: [] };
        }
      }
    }
  );

  server.resource(
    "Patient History",
    patientHistoryTemplate,
    { description: "Dynamic patient history resources" },
    async (uri: URL, variables: any) => {
      try {
        if (uri.pathname === "/all") {
          const [patients, appointments] = await Promise.all([
            apiClient.get('/patients'),
            apiClient.get('/appointments')
          ]);
          
          const patientHistories = patients.data.map((patient: any) => {
            const patientAppointments = appointments.data.filter(
              (apt: any) => apt.patient_id === patient.id
            );
            
            const sortedAppointments = patientAppointments.sort(
              (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return {
              patientId: patient.id,
              patientName: patient.name,
              patientEmail: patient.email,
              patientPhone: patient.phone,
              totalAppointments: patientAppointments.length,
              appointments: sortedAppointments.map((apt: any) => ({
                id: apt.id,
                date: apt.date,
                time: apt.time,
                doctorId: apt.doctor_id,
                doctorName: apt.doctor_name,
                type: apt.type || 'consultation',
                status: apt.status || 'completed',
                notes: apt.notes || '',
                duration: apt.duration || 30,
                createdAt: apt.created_at
              })),
              summary: {
                firstAppointment: sortedAppointments[sortedAppointments.length - 1]?.date,
                lastAppointment: sortedAppointments[0]?.date,
                frequentDoctors: getFrequentDoctors(patientAppointments),
                appointmentTypes: getAppointmentTypes(patientAppointments),
                averageInterval: calculateAverageInterval(sortedAppointments)
              }
            };
          });

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify({ patientHistories }, null, 2)
              }
            ]
          };
        }

        // Handle individual patient history
        const patientId = variables.patient_id;
        const [patient, appointments] = await Promise.all([
          apiClient.get(`/patients/${patientId}`),
          apiClient.get('/appointments')
        ]);
        
        const patientAppointments = appointments.data.filter(
          (apt: any) => apt.patient_id === parseInt(patientId)
        );
        
        const sortedAppointments = patientAppointments.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const history = {
          patient: {
            id: patient.data.id,
            name: patient.data.name,
            email: patient.data.email,
            phone: patient.data.phone,
            birthDate: patient.data.birth_date,
            address: patient.data.address
          },
          totalAppointments: patientAppointments.length,
          appointments: sortedAppointments.map((apt: any) => ({
            id: apt.id,
            date: apt.date,
            time: apt.time,
            doctorId: apt.doctor_id,
            doctorName: apt.doctor_name,
            type: apt.type || 'consultation',
            status: apt.status || 'completed',
            notes: apt.notes || '',
            duration: apt.duration || 30,
            createdAt: apt.created_at
          })),
          summary: {
            firstAppointment: sortedAppointments[sortedAppointments.length - 1]?.date,
            lastAppointment: sortedAppointments[0]?.date,
            frequentDoctors: getFrequentDoctors(patientAppointments),
            appointmentTypes: getAppointmentTypes(patientAppointments),
            averageInterval: calculateAverageInterval(sortedAppointments),
            upcomingAppointments: patientAppointments.filter(
              (apt: any) => new Date(apt.date) > new Date()
            ).length
          }
        };

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(history, null, 2)
            }
          ]
        };

      } catch (error) {
        console.error('Error reading patient history resource:', error);
        throw new Error(`Failed to read patient history: ${uri.href}`);
      }
    }
  );
}

// Helper functions
function generateTimeSlots(startTime: string, endTime: string, lunchStart: string | null, lunchEnd: string | null, duration: number): string[] {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const lunchStartMinutes = lunchStart ? timeToMinutes(lunchStart) : null;
  const lunchEndMinutes = lunchEnd ? timeToMinutes(lunchEnd) : null;

  for (let time = start; time < end; time += duration) {
    // Skip lunch break slots
    if (lunchStartMinutes && lunchEndMinutes && 
        time >= lunchStartMinutes && time < lunchEndMinutes) {
      continue;
    }
    
    slots.push(minutesToTime(time));
  }

  return slots;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getFrequentDoctors(appointments: any[]) {
  const doctorCounts = appointments.reduce((acc: any, apt: any) => {
    const doctorName = apt.doctor_name || `Doctor ${apt.doctor_id}`;
    acc[doctorName] = (acc[doctorName] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(doctorCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([name, count]) => ({ name, appointments: count }));
}

function getAppointmentTypes(appointments: any[]) {
  const typeCounts = appointments.reduce((acc: any, apt: any) => {
    const type = apt.type || 'consultation';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }));
}

function calculateAverageInterval(appointments: any[]) {
  if (appointments.length < 2) return null;

  let totalDays = 0;
  let intervals = 0;

  for (let i = 0; i < appointments.length - 1; i++) {
    const current = new Date(appointments[i].date);
    const next = new Date(appointments[i + 1].date);
    const daysDiff = Math.abs((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    totalDays += daysDiff;
    intervals++;
  }

  return intervals > 0 ? Math.round(totalDays / intervals) : null;
}
