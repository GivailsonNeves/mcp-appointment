import { z } from 'zod';

export const formSchema = z
  .object({
    date: z.date({
      required_error: 'A data é obrigatória.',
    }),
    time: z
      .string()
      .min(1, { message: 'O horário é obrigatório.' })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Hora deve estar no formato HH:mm.',
      }),
    doctorId: z.string().min(1, { message: 'Selecione um médico' }),
    patientId: z.string().min(1, { message: 'Selecione um paciente' }),
  })
  .superRefine((data, ctx) => {
    const { date, time } = data;

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(time)) {
      return;
    }

    const [hours, minutes] = time.split(':');
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const now = new Date();
    now.setSeconds(0, 0);

    if (appointmentDateTime < now) {
      ctx.addIssue({
        code: 'custom',
        message: 'Não é possível agendar um horário no passado.',
        path: ['time'],
      });
    }
  });

export type FormType = z.infer<typeof formSchema>;