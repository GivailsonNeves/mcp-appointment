import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formSchema,
  FormType,
} from "./form.validator";

type Props = {
  onSubmit: (data: FormType & { id?: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  data?: FormType & { id?: number };
};

export function FormData({ onSubmit, onCancel, data, loading }: Props) {

  const form = useForm<FormType>({
    defaultValues: {
      name: data?.name || "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => onSubmit({ ...d, id: data?.id }))}
      >
        <div className="grid grid-cols-1 pb-4 gap-4">
          <div className="col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
            Cancelar
          </Button>
          <Button
            variant="secondary-outline"
            isLoading={loading}
          >
            {data ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
