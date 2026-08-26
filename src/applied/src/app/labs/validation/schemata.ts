import { z } from 'zod';
// valibot - this is a cool one.

export const TicketFromApi = z.object({
  id: z.number(),
  subject: z.string().nullable(),
  status: z.string(),
  openedOn: z.union([z.string(), z.number()]),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  assignedTo: z
    .union([z.string(), z.object({ id: z.string(), name: z.string() })])
    .nullable()
    .optional(),
});

// Chef's kiss! Awesome -
export type TicketFromApi = z.infer<typeof TicketFromApi>;

export const TicketsFromApi = z.array(TicketFromApi);
