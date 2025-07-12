import { serviceClient } from "@/lib/service-client";
import { AppointmentType, DoctorType, PatientType } from "@/types";

export const listPatients = async () => {
  return serviceClient
    .get<PatientType[]>("/patients")
    .then((response) => response.data);
};
export const addPatient = async (data: Omit<PatientType, "id">) => {
  return serviceClient
    .post("/patients", data)
    .then((response) => response.data);
};
export const updatePatient = async ({ id, ...rest }: PatientType) => {
  return serviceClient
    .put(`/patients/${id}`, rest)
    .then((response) => response.data);
};
export const removePatient = async (id: string) => {
  return serviceClient
    .delete(`/patients/${id}`)
    .then((response) => response.data);
};
export const addDoctor = async (data: Omit<DoctorType, "id">) => {
  return serviceClient.post("/doctors", data).then((response) => response.data);
};
export const listDoctors = async () => {
  return serviceClient
    .get<DoctorType[]>("/doctors")
    .then((response) => response.data);
};

export const listAppointments = async ({
  doctorId,
  date,
}: {
  doctorId?: string;
  date?: Date;
}) => {
  const path = doctorId ? `/appointments/doctor/${doctorId}` : "/appointments";
  return serviceClient
    .get<AppointmentType[]>(path, {
      params: {
        date: date ? date.toISOString().split("T")[0] : undefined,
      },
    })
    .then((response) => response.data);
};

export const listAvailability = async ({
  doctorId,
  date,
}: {
  doctorId: string;
  date: Date;
}) => {
  return serviceClient
    .get<string[]>(
      `/appointments/doctor/${doctorId}/available-times/${
        date.toISOString().split("T")[0]
      }`
    )
    .then((response) => response.data);
};

export const addAppointment = async (
  data: Omit<AppointmentType, "id" | "patient" | "doctor">
) => {
  return serviceClient
    .post("/appointments", data)
    .then((response) => response.data);
};
