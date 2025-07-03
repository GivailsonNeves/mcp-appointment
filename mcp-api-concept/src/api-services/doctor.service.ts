import { db } from "@/lib/firebase";

const COLLECTION_NAME = "doctors";

type DoctorType = {
    id: string;
    name: string;
};

export async function getDoctorById(doctorId: string): Promise<DoctorType> {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const doc = await db.collection(COLLECTION_NAME).doc(doctorId).get();
        if (!doc.exists) {
        throw new Error("Patient not found");
        }
        return { id: doc.id, ...doc.data() } as DoctorType;
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error("Error fetching patient");
    }
}

export async function getDoctorByName(name: string) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const snapshot = await db.collection(COLLECTION_NAME).where("name", ">=", name).where("name", "<=", name + "\uf8ff").get();
        if (snapshot.empty) {
            throw new Error("Patient not found");
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
    } catch (error) {
        console.error("Error fetching patient by name:", error);
        throw new Error("Error fetching patient by name");
    }
}

export async function getAllDoctors() {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw new Error("Error fetching doctors");
    }
}


export async function createDoctor(doctorData: {name: string}) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const res = await db.collection(COLLECTION_NAME).add(doctorData);
        return { id: res.id, ...doctorData };
    } catch (error) {
        console.error("Error creating doctor:", error);
        throw new Error("Error creating doctor");
    }
}