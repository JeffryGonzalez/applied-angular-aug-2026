import { http, HttpHandler, HttpResponse } from 'msw';

const AGENTS = [
  { id: 'a-1', name: 'R. Okafor', team: 'Desktop' },
  { id: 'a-2', name: 'J. Lindqvist', team: 'Network' },
  { id: 'a-3', name: 'M. Alvarez', team: 'Desktop' },
];

const handlers: HttpHandler[] = [
  http.get('/api/agents', () => HttpResponse.json(AGENTS)),
  http.get('/api/agents/:id', ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params['id']);
    return HttpResponse.json(agent ?? null, { status: agent ? 200 : 404 });
  }),
];

export default handlers;
