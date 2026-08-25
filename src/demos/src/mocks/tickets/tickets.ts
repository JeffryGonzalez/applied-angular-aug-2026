import { delay, http, HttpHandler, HttpResponse } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/tickets';

// What the API documentation promises, and what you get on a good day.
const typical = [
  { id: 4101, subject: 'Badge reader offline at dock 3', status: 'open',    openedOn: '2026-08-11T09:12:00Z', priority: 'high',   assignedTo: 'a-2' },
  { id: 4102, subject: 'Cannot print packing slips',     status: 'waiting', openedOn: '2026-08-14T14:02:00Z', priority: 'normal', assignedTo: 'a-1' },
  { id: 4103, subject: 'Laptop will not join wifi',      status: 'open',    openedOn: '2026-08-19T11:05:00Z', priority: 'normal', assignedTo: null  },
  { id: 4104, subject: 'Shared drive missing',           status: 'closed',  openedOn: '2026-07-30T08:44:00Z', priority: 'low',    assignedTo: 'a-3' },
  { id: 4105, subject: 'Phone system dropping calls',    status: 'open',    openedOn: '2026-08-21T16:30:00Z', priority: 'high',   assignedTo: 'a-2' },
];

// The same endpoint, on a Tuesday. Nothing here is invented for effect — each
// one is a thing a real API really does.
//
//  4102  assignedTo is an object instead of an id, and priority is missing
//  4103  subject is null, and openedOn is unix milliseconds rather than ISO
//  4104  status is a value that is not in the documented set
const lying = [
  { id: 4101, subject: 'Badge reader offline at dock 3', status: 'open',    openedOn: '2026-08-11T09:12:00Z', priority: 'high', assignedTo: 'a-2' },
  { id: 4102, subject: 'Cannot print packing slips',     status: 'waiting', openedOn: '2026-08-14T14:02:00Z',                   assignedTo: { id: 'a-1', name: 'R. Okafor' } },
  { id: 4103, subject: null,                             status: 'open',    openedOn: 1787137500000,          priority: 'normal', assignedTo: null },
  { id: 4104, subject: 'Shared drive missing',           status: 'ARCHIVED', openedOn: '2026-07-30T08:44:00Z', priority: 'low',  assignedTo: 'a-3' },
  { id: 4105, subject: 'Phone system dropping calls',    status: 'open',    openedOn: '2026-08-21T16:30:00Z', priority: 'high', assignedTo: 'a-2' },
];

const payloads: Record<string, unknown> = { typical, lying, empty: [] };

const handlers: HttpHandler[] = [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[ENDPOINT] ?? 'typical';

    if (scenario === 'slow') await delay(2000);
    if (scenario === 'error') return new HttpResponse(null, { status: 500 });
    if (scenario === 'missing') return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(payloads[scenario] ?? typical);
  }),
];

export default handlers;
