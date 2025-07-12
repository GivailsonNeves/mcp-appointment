import { Content } from "@/modules/appointments";

export default function AppointmentsPage({ searchParams }: {
  searchParams: any;
}) {
  const {
    date, doctor
  } = searchParams;
  return <Content doctor={doctor} date={new Date(date ? `${date}T12:00:00` : '')} />;
}
