import { getAllAppointmentsByDoctorId } from "@/app/services/appointment.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const id = (await params).id;
  const date = searchParams.get("date");

  if (id) {
    // Fetch appointments for a specific patient
    try {
      const appointments =
        (await getAllAppointmentsByDoctorId(id, date || undefined)) || [];

      return new Response(JSON.stringify(appointments), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching appointments for doctor:", error);
      return new Response("Error fetching appointments for doctor", {
        status: 500,
      });
    }
  }
}