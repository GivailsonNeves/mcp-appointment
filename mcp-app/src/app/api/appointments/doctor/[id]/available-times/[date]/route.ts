import { getAllAppointmentsByDoctorId } from "@/api-services/appointment.service";
import { NextRequest } from "next/server";

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, date: string }> }
) {
  const id = (await params).id;
  const date = (await params).date;

  if (id) {
    try {
      const appointments =
        (await getAllAppointmentsByDoctorId(id, date)) || [];

      const alreadyBooked = appointments.map(({time}) => time)
      const availableSlots = TIME_SLOTS.filter(
        (slot) => !alreadyBooked.includes(slot)
      );
      return new Response(JSON.stringify(availableSlots), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching availibility for doctor:", error);
      return new Response("Error fetching availibility for doctor", {
        status: 500,
      });
    }
  }
}
// ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]