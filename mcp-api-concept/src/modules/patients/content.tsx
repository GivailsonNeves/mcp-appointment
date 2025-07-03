'use client'
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/ui/section-title";
import { List } from "./list";

export function Content() {
  return (
    <div className="container mx-auto">
      <SectionTitle title="Pacientes">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>{}}
        >
          Adicionar Paciente
        </Button>
      </SectionTitle>
      <List
        onEdit={(data) => {}}      
        onDelete={(data) => {}}
      />
    </div>
  );
}
    