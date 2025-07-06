"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { queryClient } from "@/providers/query-provider";
import { addDoctor } from "@/services";
import { SectionTitle } from "@/ui/section-title";
import { useMutation } from "@tanstack/react-query";
import { List } from "./list";
import { ModalForm } from "./modal-form";

export function Content() {
  const { showModal, hideModal, showLoading } = useModal();

  const { mutate } = useMutation({
    mutationFn: (data: any) => addDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      alert("Doutor salvo com sucesso!");
    },
    onError: (error: any) => {
      alert(`Erro ao salvar doutor: ${error.message}`);
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
          Adicionar Doutor
        </Button>
      </SectionTitle>
      <List onEdit={(data) => {}} onDelete={(data) => {}} />
    </div>
  );
}
