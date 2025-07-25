"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormData } from "../form";
import { useModal } from "@/providers/modal-provider";

type Props = {
  onSubmit: Parameters<typeof FormData>[0]["onSubmit"];
  data?: Parameters<typeof FormData>[0]["data"];
  onClose: () => void;
};

export function ModalForm({ onSubmit, onClose, data }: Props) {
  const { loading } = useModal();
  return (
    <Dialog open={true} onOpenChange={(_) => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Update" : "Add"} doctor
          </DialogTitle>
          <DialogDescription>
            {data ? (
              <>
                Update the fields of the doctor <strong>{data.name}</strong>
              </>
            ) : (
              "Fill in the doctor fields"
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
