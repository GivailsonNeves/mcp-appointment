'use client';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormType } from "./form.validator";
import { TimeSelector } from "@/modules/doctors/time-selector";
import { Selector as DoctorSelector } from "@/modules/doctors/selector";
import { Selector as PatientSelector } from "@/modules/patients/selector";
import { DatePickerField } from "@/components/app/date-picker-field";

type Props = {
  onSubmit: (data: FormType & { id?: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  data?: FormType & { id?: number };
};

export function FormData({ onSubmit, onCancel, data, loading }: Props) {
  const form = useForm<FormType>({
    defaultValues: {
      time: data?.time || "",
      date: data?.date ? new Date(data.date) : undefined,
      doctorId: data?.doctorId || "",
      patientId: data?.patientId || "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) =>
          onSubmit({
            ...d,
            id: data?.id,
            //@ts-ignore
            date: d.date?.toISOString().split("T")[0],
          })
        )}
      >
        <div className="grid grid-cols-2 pb-4 gap-4">
          <div className="col">
            <DatePickerField
              control={form.control}
              name="date"
              placeholder="Choose a date"
            />
          </div>
          <div className="col">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DoctorSelector
                      doctor={form.watch("doctorId")}
                      onChange={(value) => form.setValue("doctorId", value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 pb-4 gap-4">
          <div className="col">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PatientSelector
                      patient={form.watch("patientId")}
                      onChange={(value) => form.setValue("patientId", value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TimeSelector
                      time={form.watch("time")}
                      doctorId={form.watch("doctorId")}
                      date={form.watch("date")?.toISOString().split("T")[0]}
                      onChange={(value) => form.setValue("time", value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            isLoading={loading}
            onClick={() => {
              form.reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button variant="secondary-outline" isLoading={loading}>
            {data ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
