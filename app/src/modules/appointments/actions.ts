"use server";

import {
  createAppointment as create,
  updateAppointment as update,
} from "@/api-services/appointment.service";
import { FormType } from "./form";
import { getPatientById } from "@/api-services/patient.service";

export async function createAppointmentAction(data: FormType) {
  return await create({
    date: data.date.toISOString().split("T")[0],
    time: data.time,
    doctorId: data.doctorId,
    patientId: data.patientId,
    name: data.patientId,
  });
}

export async function updateAppointmentAction(
  id: string,
  data: Omit<FormType, "patientId"> & { patientId: string }
) {
  return await update(id, {
    date: data.date.toISOString().split("T")[0],
    time: data.time,
    doctorId: data.doctorId,
    patientId: data.patientId,
  });
}

export async function getPatientByIdAction(id: string) {
  return await getPatientById(id);
}
