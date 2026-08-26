// What the API documentation promises. Written from the docs, by hand, before
// anyone looked at a real response.
export interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'waiting' | 'closed';
  openedOn: string;
  priority: 'low' | 'normal' | 'high';
  assignedTo: string | null;
}
