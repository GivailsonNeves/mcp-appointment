import { db } from "@/lib/firebase";

const COLLECTION_NAME = "patients";
type patientType = { id: string; name: string };

export async function getPatientById(patientId: string): Promise<{ id: string; name: string }> {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const doc = await db.collection(COLLECTION_NAME).doc(patientId).get();
        if (!doc.exists) {
        throw new Error("Patient not found");
        }
        return { id: doc.id, ...doc.data() } as patientType;
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error("Error fetching patient");
    }
}

export async function getPatientByName(name: string) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    try {
        const snapshot = await db.collection(COLLECTION_NAME).where("name", ">=", name).where("name", "<=", name + "\uf8ff").get();        
        if (snapshot.empty) {
            console.log(`Patient not found with name: ${name}`);
            throw new Error(`Patient not found with name: ${name}`);
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
    } catch (error) {
        console.error("Error fetching patient by name:", error);
        throw new Error("Error fetching patient by name");
    }
}

export async function getAllPatients() {
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
        console.error("Error fetching patients:", error);
        throw new Error("Error fetching patients");
    }
}


export async function createPatient(patientData: {name: string}) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        const res = await db.collection(COLLECTION_NAME).add(patientData);
        return { id: res.id, ...patientData };
    } catch (error) {
        console.error("Error creating patient:", error);
        throw new Error("Error creating patient");
    }
}

export async function updatePatient(patientId: string, patientData: {name: string}) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        await db.collection(COLLECTION_NAME).doc(patientId).update(patientData);
        return { id: patientId, ...patientData };
    } catch (error) {
        console.error("Error updating patient:", error);
        throw new Error("Error updating patient");
    }
}

export async function deletePatient(patientId: string) {
    if (!db) {
        throw new Error("Database not initialized");
    }
    
    try {
        await db.collection(COLLECTION_NAME).doc(patientId).delete();
        return { id: patientId };
    } catch (error) {
        console.error("Error deleting patient:", error);
        throw new Error("Error deleting patient");
    }
}