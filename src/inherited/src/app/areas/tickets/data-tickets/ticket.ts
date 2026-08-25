export interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'waiting' | 'closed';
  openedOn: string;

  // unassigned tickets come back without this
  assignedTo?: string;

  // TODO the api doesn't always send priority, made optional so the specs pass
  priority?: 'low' | 'normal' | 'high';

  // set in the list component so the table has something to show
  displayTitle?: string;
  agentName?: string;
  ageInDays?: number;
}
