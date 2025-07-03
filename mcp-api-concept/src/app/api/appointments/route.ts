import { createAppointment, getAllAppointments, getAppointmentById, getAppointmentByPatientId } from "@/app/services/appointment.service";
import { getDoctorById } from "@/app/services/doctor.service";
import { getPatientById } from "@/app/services/patient.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Parse the incoming request body
  const body = await req.json();
  if (!body || !body.patientId || !body.doctorId || !body.date || !body.time) {
    return new Response("Invalid request body", { status: 400 });
  }
  const doctor = await getDoctorById(body.doctorId);

  if (!doctor) {
    return new Response("Doctor not found", { status: 404 });
  }

  const patien = getPatientById(body.patientId);
  if (!patien) {
    return new Response("Patient not found", { status: 404 });
  }

  // Store the appointment in the Firestore database
  try {
    const res = await createAppointment(body)
    return new Response(JSON.stringify({ id: res.id, ...body }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error storing appointment:", error);
    if (String(error).includes("already booked")) {
      return new Response("Already booked", { status: 409 }); // Conflict
    }
    // Handle other errors
    return new Response("Error storing appointment", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  // Fetch all appointments if no specific ID is provided
  try {
    const appointments = await getAllAppointments(date || undefined);
    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response("Error fetching appointments", { status: 500 });
  }
}
