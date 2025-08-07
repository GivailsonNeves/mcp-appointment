import { formatDate } from "@/lib/utils";
import { Content } from "@/modules/appointments";
import { redirect } from "next/navigation";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; doctor?: string; noCache?: string }>;
}) {
  const { date, doctor, noCache } = await searchParams;

  if (!date) {
    const today = new Date();
    redirect(`/?date=${formatDate(today)}`); // Redirect to today's date if no date is provided
  }

  return (
    <Content
      key={noCache}
      doctor={doctor}
      date={new Date(date ? `${date}T12:00:00` : "")}
    />
  );
}