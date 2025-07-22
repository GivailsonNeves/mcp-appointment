import { DoctorType } from "./doctor";
import { PatientType } from "./patient";

export interface AppointmentType {
    id: string;
    patientId: string;
    doctorId: string;
    date: string; // ISO date string
    time: string; // Time in HH:mm format
    doctor: DoctorType;
    patient: PatientType;
}