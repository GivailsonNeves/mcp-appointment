import { z } from 'zod';

export const formSchema = z.object({  
  date: z
    .date()
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) && date >= new Date();
    }, {
      message: 'Data deve ser uma data válida e não pode ser no passado',
    }),
  time: z
    .string()
    .refine((value) => {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timePattern.test(value);
    }, {
      message: 'Hora deve estar no formato HH:mm',
    }),
  doctorId: z.string().min(1, { message: 'Selecione um médico' }),
  patientId: z.string().min(1, { message: 'Selecione um paciente' }),
});

export type FormType = z.infer<typeof formSchema>;