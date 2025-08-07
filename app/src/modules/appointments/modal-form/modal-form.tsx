"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormData, FormType } from "../form";
import { useModal } from "@/providers/modal-provider";
import { useEffect, useState } from "react";
import { PatientType } from "@/types/patient";
import { getPatientByIdAction } from "../actions";

type Props = {
  onSubmit: Parameters<typeof FormData>[0]["onSubmit"];
  data?: FormType & { id?: number; patient?: PatientType };
  onClose: () => void;
};

export function ModalForm({ onSubmit, onClose, data }: Props) {
  const { loading } = useModal();
  const [patient, setPatient] = useState<PatientType>();

  useEffect(() => {
    async function getPatient() {
      if (data?.patientId) {
        const response = await getPatientByIdAction(data.patientId);
        setPatient(response);
      }
    }

    getPatient();
  }, [data?.patientId]);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Update" : "Add"} appointment
          </DialogTitle>
          <DialogDescription>
            {data ? (
              <>
                Update the fields of the appointment
                <strong>{patient?.name}</strong>
              </>
            ) : (
              "Fill in the appointment fields"
            )}
          </DialogDescription>
        </DialogHeader>
        <FormData
          onSubmit={onSubmit}
          onCancel={onClose}
          data={data}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
