'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/ui/section-title";
import { List } from "./list";
import { useModal } from "@/providers/modal-provider";
import { ModalForm } from "./modal-form";
import { useMutation } from "@tanstack/react-query";
import { addPatient, removePatient, updatePatient } from "@/services";
import { queryClient } from "@/providers/query-provider";
import { ModalConfirm } from "@/components/app/modal-confirm";

export function Content() {
  const { showModal, hideModal, showLoading } = useModal();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleHideModal = () => {
    setSelectedId(null);
    hideModal();
  };  

  const { mutate } = useMutation({
    mutationFn: (data: any) => addPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      alert("Patient saved successfully!");
    },
    onError: (error: any) => {
      alert(`Error saving patient: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    }
  });

  const { mutate: update } = useMutation({
    mutationFn: ({ id, data }: any) => updatePatient({id, ...data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      alert("Patient updated successfully!");
    },
    onError: (error: any) => {
      alert(`Error updating patient: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: removePatient,
    onSuccess: () => {
      alert("Patient removed successfully!");
    },
    onError: () => {
      alert("Error removing patient!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const handleSubmit = async (data: any) => {
    showLoading(true);
    if (selectedId) {
      await update({ id: selectedId, data });
    } else {
      await mutate(data);
    }
    showLoading(false);
    handleHideModal();
  };

  const handleRemove = async (option: boolean, data: any) => {
    if (option) {
      showLoading(true)
      await remove(data.id)
      showLoading(false)
    }
    handleHideModal();
  }

  return (
    <div className="container mx-auto">
      <SectionTitle title="Patients">
        {selectedId}
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            showModal(ModalForm, {
              onSubmit: handleSubmit,
              onClose: handleHideModal,
            })
          }
        >
          Add Patient
        </Button>
      </SectionTitle>
      <List
        onEdit={(data) => {
          setSelectedId(data.id);
          showModal(ModalForm, {
            data,
            onSubmit: handleSubmit,
            onClose: handleHideModal,
          });
        }}
        onDelete={(data) => {
          showModal(ModalConfirm, {
            title: "Confirm Deletion",
            description: "Are you sure you want to delete this patient?",
            data,
            onClose: (option: boolean, data: any) => {
              handleRemove(option, data)
            },
          });
        }}
      />
    </div>
  );
}
    