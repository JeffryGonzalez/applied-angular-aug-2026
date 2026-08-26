export interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'waiting' | 'closed';
  openedOn: string;
  assignedTo?: string;
  priority?: 'low' | 'normal' | 'high';
}

export type TicketViewModel = Ticket & {
  displayTitle: string;
  agentName: string;
  ageInDays: { days: number; hours: number; minutes: number };
};
