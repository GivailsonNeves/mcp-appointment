import { deleteDoctor, getDoctorById, updateDoctor } from "@/api-services/doctor.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const id = (await params).id;

  if (id) {
    // Fetch a specific doctor by ID
    try {
      const doctor = await getDoctorById(id);
      if (!doctor) {
        return new Response("Doctor not found", { status: 404 });
      }
      return new Response(JSON.stringify(doctor), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching doctor:", error);
      return new Response("Error fetching doctor", { status: 500 });
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
    const updatedDoctor = await updateDoctor(id, body);
    if (!updatedDoctor) {
      return new Response("Doctor not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedDoctor), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return new Response("Error updating doctor", { status: 500 });
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
    const deletedDoctor = await getDoctorById(id);
    if (!deletedDoctor) {
      return new Response("Doctor not found", { status: 404 });
    }
    // Assuming there's a delete function in the service
    await deleteDoctor(id);
    return new Response("Doctor deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return new Response("Error deleting doctor", { status: 500 });
  }
}
