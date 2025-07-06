'use client'
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/ui/section-title";
import { List } from "./list";
import { useModal } from "@/providers/modal-provider";
import { ModalForm } from "./modal-form";
import { useMutation } from "@tanstack/react-query";
import { addPatient } from "@/services";
import { queryClient } from "@/providers/query-provider";

export function Content() {
  const { showModal, hideModal, showLoading } = useModal();

  const { mutate } = useMutation({
    mutationFn: (data: any) => addPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      alert("Paciente salvo com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao salvar paciente: ${error.message}`);
    },
  });

  const handleSubmit = async (data: any) => {
    showLoading(true);
    await mutate(data);
    showLoading(false);
    hideModal();
  };

  return (
    <div className="container mx-auto">
      <SectionTitle title="Pacientes">
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
          Adicionar Paciente
        </Button>
      </SectionTitle>
      <List onEdit={(data) => {}} onDelete={(data) => {}} />
    </div>
  );
}
    