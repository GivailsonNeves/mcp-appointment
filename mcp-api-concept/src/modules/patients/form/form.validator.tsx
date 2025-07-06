import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
});

export type FormType = z.infer<typeof formSchema>;