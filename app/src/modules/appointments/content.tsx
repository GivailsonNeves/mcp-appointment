"use client";
import { DateSelector } from "@/components/app/date-selector";
import { ModalConfirm } from "@/components/app/modal-confirm";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { useModal } from "@/providers/modal-provider";
import { queryClient } from "@/providers/query-provider";
import { SectionTitle } from "@/ui/section-title";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Selector as DoctorSelector } from "../doctors/selector";
import { List } from "./list";
import { ModalForm } from "./modal-form";
import { FormType } from "./form";
import {
  createAppointmentAction,
  updateAppointmentAction,
} from "./actions";

type Props = {
  doctor?: string;
  date?: Date;
};

export function Content({ doctor, date }: Props) {
  const { showAppointments } = useNavigation();
  const { showModal, hideModal, showLoading } = useModal();
  const [open, setOpen] = React.useState(false);

  const { mutate } = useMutation({
    mutationFn: async (data: FormType & { id?: string }) => {
      if (data.id) {
        return updateAppointmentAction(data.id, data);
      }

      return createAppointmentAction(data);
    },
    onSuccess: (data) => {
      alert(`Appointment ${data.id ? "updated" : "created"} successfully!`);
    },
    onError: (error) => {
      alert(`Error creating appointment: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      showLoading(false);
      hideModal();
    },
  });

  const handleSubmit = async (data: FormType & { id?: string }) => {
    showLoading(true);
    await mutate(data);
  };

  const handleDateChange = (newDate: Date) => {
    setOpen(false);
    showAppointments({
      doctor,
      date: newDate,
    });
  };

  const handleDoctorChange = (newDoctor: string) => {
    setOpen(false);
    showAppointments({
      doctor: newDoctor,
      date,
    });
  };

  return (
    <div className="container mx-auto">
      <SectionTitle title="Appointments">
        <div className="flex items-center justify-between gap-4">
          <div>
            <DateSelector
              date={date}
              onChange={(date) => date && handleDateChange(date)}
              onOpenChange={setOpen}
              open={open}
            />
          </div>
          <div>
            <DoctorSelector doctor={doctor} onChange={handleDoctorChange} />
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
              Create new appointment
            </Button>
          </div>
        </div>
      </SectionTitle>
      <List
        doctor={doctor}
        date={date}
        onEdit={(data) => {
          showModal(ModalForm, {
            data,
            onSubmit: handleSubmit,
            onClose: hideModal,
          });
        }}
        onDelete={() => {
          showModal(ModalConfirm, {
            title: "Confirm Deletion",
            description:
              "Are you sure you want to delete this appointment?",
            onClose: hideModal,
          });
        }}
      />
    </div>
  );
}
