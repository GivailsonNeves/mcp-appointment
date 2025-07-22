import { deletePatient, getPatientById, updatePatient } from "@/api-services/patient.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const id = (await params).id;

  if (id) {
    // Fetch a specific patient by ID
    try {
      const patient = await getPatientById(id);
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
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const id = (await params).id;

  if (!body || !id) {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    const updatedPatient = await updatePatient(id, body);
    if (!updatedPatient) {
      return new Response("Patient not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedPatient), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return new Response("Error updating patient", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    await deletePatient(id);
    return new Response("Patient deleted successfully", { status: 204 });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return new Response("Error deleting patient", { status: 500 });
  }
}