import { z } from 'zod';

// What the API documentation promises. Written from the docs, by hand, before
// anyone looked at a real response.
export interface DocumentedTicket {
  id: number;
  subject: string;
  status: 'open' | 'waiting' | 'closed';
  openedOn: string;
  priority: 'low' | 'normal' | 'high';
  assignedTo: string | null;
}

// What actually arrives. Every difference from the interface above is something
// the real endpoint really does.
export const TicketFromApi = z.object({
  id: z.number(),

  // sometimes null — a draft that was saved without one
  subject: z.string().nullable(),

  // the documented set, plus whatever else it feels like sending
  status: z.string(),

  // ISO string on most rows, unix milliseconds on at least one
  openedOn: z.union([z.string(), z.number()]),

  // absent on some rows
  priority: z.enum(['low', 'normal', 'high']).optional(),

  // an id, an object, or nothing
  assignedTo: z
    .union([z.string(), z.object({ id: z.string(), name: z.string() })])
    .nullable()
    .optional(),
});

export type TicketFromApi = z.infer<typeof TicketFromApi>;

export const TicketsFromApi = z.array(TicketFromApi);
