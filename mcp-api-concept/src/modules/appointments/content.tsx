"use client";
import { DateSelector } from "@/components/app/date-selector";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/ui/section-title";
import React from "react";
import { Selector as DoctorSelector } from "../doctors/selector";
import { List } from "./list";
import { useModal } from "@/providers/modal-provider";
import { ModalForm } from "./modal-form";
import { useMutation } from "@tanstack/react-query";
import { addAppointment } from "@/services";

export function Content() {
  const { showModal, hideModal, showLoading } = useModal();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [doctor, setDoctor] = React.useState<string | undefined>(undefined);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return addAppointment({
        date: data.date,
        time: data.time,
        doctorId: data.doctorId,
        patientId: data.patientId,
      });
    },
    onSuccess: () => {
      console.log("Appointment created successfully");
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
    },
  });

  const handleSubmit = async (data: any) => {
    console.log(data)
    showLoading(true);
    await mutate(data);
    showLoading(false);
    hideModal();
  };

  return (
    <div className="container mx-auto">
      <SectionTitle title="Appointments">
        <div className="flex items-center justify-between gap-4">
          <div>
            <DateSelector
              date={date}
              onChange={setDate}
              onOpenChange={setOpen}
              open={open}
            />
          </div>
          <div>
            <DoctorSelector doctor={doctor} onChange={setDoctor} />
          </div>
          <div>
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
              Criar novo agendamento
            </Button>
          </div>
        </div>
      </SectionTitle>
      <List
        doctor={doctor}
        date={date}
        onEdit={(data) => {}}
        onDelete={(data) => {}}
      />
    </div>
  );
}
