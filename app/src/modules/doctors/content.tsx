"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { queryClient } from "@/providers/query-provider";
import { addDoctor } from "@/services";
import { SectionTitle } from "@/ui/section-title";
import { useMutation } from "@tanstack/react-query";
import { List } from "./list";
import { ModalForm } from "./modal-form";
import { ModalConfirm } from "@/components/app/modal-confirm";

export function Content() {
  const { showModal, hideModal, showLoading } = useModal();

  const { mutate } = useMutation({
    mutationFn: (data: any) => addDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      alert("Doctor saved successfully!");
    },
    onError: (error: any) => {
      alert(`Error saving doctor: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    }
  });

  const handleSubmit = async (data: any) => {
    showLoading(true);
    await mutate(data);
    showLoading(false);
    hideModal();
  };

  return (
    <div className="container mx-auto">
      <SectionTitle title="Doctors">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            showModal(ModalForm, {
              onSubmit: handleSubmit,
              onClose: hideModal,
            })
          }
        >
          Add Doctor
        </Button>
      </SectionTitle>
      <List
        onEdit={(data) => {}}
        onDelete={(data) => {
          showModal(ModalConfirm, {
            title: "Confirm Deletion",
            description: "Are you sure you want to delete this doctor?",
            onClose: hideModal,
          });
        }}
      />
    </div>
  );
}
