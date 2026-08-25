// Which scenario each endpoint is currently serving.
//
// Change a value here and reload — no application code changes. That is the
// point: your app did not get worse, the server got honest.
const activeScenarios: Record<string, string> = {
  '/api/tickets': 'typical',
  '/api/tickets/:id/assignee': 'typical',
};

export default activeScenarios;
