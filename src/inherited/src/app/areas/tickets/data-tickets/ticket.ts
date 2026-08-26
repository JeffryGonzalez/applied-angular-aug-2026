export interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'waiting' | 'closed';
  openedOn: string;
  assignedTo?: string;
  priority?: 'low' | 'normal' | 'high';
}
