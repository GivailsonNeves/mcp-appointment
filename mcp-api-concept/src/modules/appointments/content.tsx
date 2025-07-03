'use client'
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/ui/section-title";
import { List } from "./list";

export function Content() {
  return (
    <div className="container mx-auto">
      <SectionTitle title="Appointments">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>{}}
        >
          Criar novo agendamento
        </Button>
      </SectionTitle>
      <List
        onEdit={(data) => {}}      
        onDelete={(data) => {}}
      />
    </div>
  );
}
    