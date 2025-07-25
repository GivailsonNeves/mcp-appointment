import { z } from 'zod';

export const formSchema = z
  .object({
    date: z.date({
      required_error: 'Date is required.',
    }),
    time: z
      .string()
      .min(1, { message: 'Time is required.' })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:mm format.',
      }),
    doctorId: z.string().min(1, { message: 'Select a doctor' }),
    patientId: z.string().min(1, { message: 'Select a patient' }),
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
        message: 'Cannot schedule an appointment in the past.',
        path: ['time'],
      });
    }
  });

export type FormType = z.infer<typeof formSchema>;