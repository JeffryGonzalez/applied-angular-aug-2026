import { delay, http, HttpHandler, HttpResponse } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/tickets/:id/assignee';

const handlers: HttpHandler[] = [
  http.put(ENDPOINT, async ({ params, request }) => {
    const scenario = activeScenarios[ENDPOINT] ?? 'typical';
    const body = (await request.json()) as { assignedTo: string };

    // long enough to navigate away from, which is the whole point
    if (scenario === 'slow' || scenario === 'fails-late') await delay(2500);
    else await delay(400);

    if (scenario === 'fails-late' || scenario === 'fails') {
      return HttpResponse.json(
        { message: 'That agent is at capacity.' },
        { status: 409 },
      );
    }

    return HttpResponse.json({ id: Number(params['id']), assignedTo: body.assignedTo });
  }),
];

export default handlers;
