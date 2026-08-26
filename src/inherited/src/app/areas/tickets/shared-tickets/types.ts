import { Ticket } from '../data-tickets/ticket';

export type TicketViewModel = Ticket & {
  displayTitle: string;
  agentName: string;
  ageInDays: { days: number; hours: number; minutes: number };
};
