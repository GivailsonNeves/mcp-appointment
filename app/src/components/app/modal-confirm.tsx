"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/modal-provider";
import { Button } from "../ui/button";

type Props = {
  description?: string;
  title?: string;
  data?: any;
  onClose: (option: boolean, data?: any) => void;
};

export function ModalConfirm({ onClose, title, description, data }: Props) {
  const { loading } = useModal();
  return (
    <Dialog open={true} onOpenChange={(_) => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ? title : "Add Patient"}</DialogTitle>
          <DialogDescription>
            {description ? description : "Fill in the patient fields"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onClose(false, data)}>Cancel</Button>
          <Button variant="primary" onClick={() => onClose(true, data)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
