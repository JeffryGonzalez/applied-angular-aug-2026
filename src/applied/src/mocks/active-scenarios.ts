/**
 * Active scenario selection for MSW handlers.
 * This file is written by msw-lens — do not edit manually.
 * Keys are "METHOD endpoint", values are scenario names defined in the handler.
 */
const activeScenarios: Record<string, string> = {
  'GET /api/tickets': 'typical',
  'PUT /api/tickets/:id/assignee': 'typical',
  'GET /api/agents/:id': 'typical',
};

export default activeScenarios;
