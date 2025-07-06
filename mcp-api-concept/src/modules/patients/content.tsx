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
      alert("Paciente salvo com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao salvar paciente: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    }
  });

  const { mutate: update } = useMutation({
    mutationFn: ({ id, data }: any) => updatePatient({id, ...data}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      alert("Paciente atualizado com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao atualizar paciente: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: removePatient,
    onSuccess: () => {
      alert("Paciente removido com sucesso!");
    },
    onError: () => {
      alert("Paciente removido com sucesso!");
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
      <SectionTitle title="Pacientes">
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
          Adicionar Paciente
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
            title: "Confirmar Exclusão",
            description: "Você tem certeza que deseja excluir este paciente?",
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
    