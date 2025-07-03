import { createDoctor, getAllDoctors, getDoctorById, getDoctorByName } from "@/app/services/doctor.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    // Parse the incoming request body
    const body = await req.json();
    if (!body || !body.name) {
        return new Response("Invalid request body", { status: 400 });
    }
    
    try {
        const doctor = await createDoctor(body);
        return new Response(JSON.stringify(doctor), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating doctor:", error);
        return new Response("Error creating doctor", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");
    const doctorName = searchParams.get("name");
    if (doctorId) {
        // Fetch a specific doctor by ID
        try {
            const doctor = await getDoctorById(doctorId);
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

    if (doctorName) {
        // Fetch a specific doctor by name
        try {
            const doctor = await getDoctorByName(doctorName);
            if (!doctor) {
                return new Response("Doctor not found", { status: 404 });
            }
            return new Response(JSON.stringify(doctor), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching doctor by name:", error);
            return new Response("Error fetching doctor by name", { status: 500 });
        }
    }

    // Fetch all doctors from the Firestore database
    try {
        const doctors = await getAllDoctors();
        return new Response(JSON.stringify(doctors), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return new Response("Error fetching doctors", { status: 500 });
    }
}