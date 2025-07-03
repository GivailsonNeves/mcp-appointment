import { serviceClient } from "@/lib/service-client";

export const listPatients = async () => {
    return serviceClient.get("/patients").then((response) => response.data);
}
export const listDoctors = async () => {
    return serviceClient.get("/doctors").then((response) => response.data);
}

export const listAppointments = async () => {
    return serviceClient.get("/appointments").then((response) => response.data);
}