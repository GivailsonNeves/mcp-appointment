import { db } from "@/lib/firebase";
import { getPatientById } from "./patient.service";
import { getDoctorById } from "./doctor.service";

const COLLECTION_NAME = "appointments";

export async function getAppointmentById(appointmentId: string) {
  if (!db) {
    throw new Error("Database not initialized");
  }
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(appointmentId).get();
    if (!doc.exists) {
      return null;
    }
    return fillAppointmentData({ id: doc.id, ...doc.data() } as AppointmentType);
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw new Error("Error fetching appointment by ID");
  }
}

export async function getAppointmentByPatientId(patientId: string, date?: string) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    try {
        const query = db.collection(COLLECTION_NAME).where("patientId", "==", patientId);
        if (date) {
            query.where("date", "==", date);
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            return null;
        }
        let appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<AppointmentType>;
        if (date) {
            appointments = appointments.filter(a => a.date === date);
        }
        const filledAppointments = await Promise.all(appointments.map(a => fillAppointmentData(a)));
        return filledAppointments;
    } catch (error) {
        console.error("Error fetching appointment by patient ID:", error);
        throw new Error("Error fetching appointment by patient ID");
    }
}

export async function getAllAppointmentsByDoctorId(doctorId: string, date?: string) {
  if (!db) {
    throw new Error("Database not initialized");
  }
  try {
    const query = db.collection(COLLECTION_NAME).where("doctorId", "==", doctorId);
    const snapshot = await query.get();
    if (snapshot.empty) {
      return null;
    }
    let appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<AppointmentType>;

    if (date) {
      appointments = appointments.filter((a) => a.date === date);
    }

    const filledAppointments = await Promise.all(
      appointments.map((a) => fillAppointmentData(a))
    );
    return filledAppointments;
  } catch (error) {
    console.error("Error fetching appointment by patient ID:", error);
    throw new Error("Error fetching appointment by patient ID");
  }
}


type AppointmentType = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  doctorId: string;
  patient?: { name: string; id: string };
  doctor?: { name: string; id: string };
};
export async function getAllAppointments(date?: string): Promise<Array<AppointmentType>> {
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    let snapshot = await db.collection(COLLECTION_NAME).get();
    if (snapshot.empty) {
      return [];
    }

    let appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<AppointmentType>;

    if (date) {
      appointments = appointments.filter((a) => a.date === date);
    }

    const filledAppointments = await Promise.all(
      appointments.map((a) => fillAppointmentData(a))
    );
    return filledAppointments;

  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Error fetching appointments");
  }
}

export async function createAppointment(patientData: {
  patientId: string;
  name: string;
  date: string;
  time: string;
  doctorId: string;
}) {
  if (!db) {
    throw new Error("Database not initialized");
  }

  patientData.date = String(patientData.date);

  const aleradyBooked = await wasAlreadyBooked(
    patientData.doctorId,
    patientData.date,
    patientData.time
  )
  if (
   aleradyBooked 
  ) {
    throw new Error("This appointment slot is already booked");
  }

  try {
    const res = await db.collection(COLLECTION_NAME).add(patientData);
    return { id: res.id, ...patientData };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Error creating appointment");
  }
}

async function wasAlreadyBooked(
  doctorId: string,
  date: string,
  time: string
): Promise<boolean> {
  const appointments = await getAllAppointmentsByDoctorId(doctorId, date);
  return appointments?.length !== 0 && !!appointments?.some(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date === date &&
      appointment.time === time
  );
}

async function fillAppointmentData(
  appointment: AppointmentType
): Promise<AppointmentType> {
  const patient = await getPatientById(appointment.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  const doctor = await getDoctorById(appointment.doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }
  return {
    ...appointment,
    patient,
    doctor,
  };
}