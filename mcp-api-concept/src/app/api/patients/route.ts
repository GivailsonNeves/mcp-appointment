import { createPatient, getAllPatients, getPatientById, getPatientByName } from "@/api-services/patient.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Parse the incoming request body
  const body = await req.json();
    if (!body || !body.name) {
        return new Response("Invalid request body", { status: 400 });
    }
    try {
        const patient = await createPatient(body);
        return new Response(JSON.stringify(patient), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating patient:", error);
        return new Response("Error creating patient", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("id");
  const patientName = searchParams.get("name");
  if (patientId) {
    // Fetch a specific patient by ID
    try {
      const patient = await getPatientById(patientId);
      if (!patient) {
        return new Response("Patient not found", { status: 404 });
      }
      return new Response(JSON.stringify(patient), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching patient:", error);
      return new Response("Error fetching patient", { status: 500 });
    }
  }
  if (patientName) {
    // Fetch a specific patient by name
    try {
      const patient = await getPatientByName(patientName);
      if (!patient) {
        return new Response("Patient not found", { status: 404 });
      }
      return new Response(JSON.stringify(patient), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching patient by name:", error);
      return new Response("Error fetching patient by name", { status: 500 });
    }
  }
  // Fetch all patients if no specific ID or name is provided
  try {
    const patients = await getAllPatients();
    if (patients.length === 0) {
      return new Response("No patients found", { status: 404 });
    }
    return new Response(JSON.stringify(patients), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return new Response("Error fetching patients", { status: 500 });
  }
}
