import { Agent } from './tickets-api';
import { TicketFromApi } from './wire';

// What the screen needs. Written by hand, next to the wire type, on purpose.
//
// Nothing here is optional and nothing here is a union. Every field is a thing
// a template can render without asking a question first.
export interface TicketRow {
  id: number;
  subject: string;
  status: string;
  isArchived: boolean;
  openedOn: Date;
  ageInDays: number;
  priority: 'low' | 'normal' | 'high';

  // The id we would send back, and the label a person reads. They are not the
  // same thing and conflating them is how a select box ends up showing
  // "Unassigned" for every row.
  assignedToId: string;
  assignee: string;
}

const DAY = 86_400_000;

// The only place the two shapes meet. Everything above the line is theirs,
// everything below is ours, and this function is the border crossing.
export function toRow(t: TicketFromApi, now: Date, agents: Agent[] = []): TicketRow {
  const openedOn = typeof t.openedOn === 'number' ? new Date(t.openedOn) : new Date(t.openedOn);

  return {
    id: t.id,
    subject: t.subject ?? '(no subject)',
    status: t.status.toLowerCase(),
    isArchived: t.status.toLowerCase() === 'archived',
    openedOn,
    ageInDays: Math.max(0, Math.floor((now.getTime() - openedOn.getTime()) / DAY)),
    priority: t.priority ?? 'normal',
    assignedToId:
      typeof t.assignedTo === 'string' ? t.assignedTo : (t.assignedTo?.id ?? ''),
    assignee: nameFor(t.assignedTo, agents),
  };
}

// The join the wire type couldn't do for itself: an id means nothing to a
// person. Given the agent list, resolve it; without it, say so honestly rather
// than showing a raw id.
function nameFor(assignedTo: TicketFromApi['assignedTo'], agents: Agent[]) {
  if (assignedTo == null) return 'Unassigned';
  if (typeof assignedTo !== 'string') return assignedTo.name;
  return agents.find((a) => a.id === assignedTo)?.name ?? assignedTo;
}
