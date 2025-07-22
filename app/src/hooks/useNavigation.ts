import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function useNavigation() {
    const router = useRouter();

    const showAppointments = ({
        doctor,
        date,
    }: {
        doctor?: string;
        date?: Date;
    }) => {
        const query: Record<string, string> = {};
        if (doctor) query.doctor = doctor;
        if (date) query.date = formatDate(date);
        query.noCache = new Date().getTime().toString();
        router.push(`/?${new URLSearchParams(query).toString()}`);
    }

    const processInteraction = (action: string, paramns: any) => {

        if (
          [
            "create-appointment",
            "get-doctor-appointments",
            "list-appointments",
            "list-doctor-available-times",
          ].includes(action)
        ) {
          showAppointments({
            doctor: paramns.doctorId,
            date: new Date(`${paramns.date}T12:00:00`),
          });
        }
    }

    return {
      showAppointments,
      processInteraction,
    };
}