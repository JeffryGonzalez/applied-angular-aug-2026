import { HttpHandler } from 'msw';
import ticketsHandler from './tickets/tickets';
import assignHandler from './tickets/assign';
import agentsHandler from './agents/agents';

export const handlers: HttpHandler[] = [
  ...ticketsHandler,
  ...assignHandler,
  ...agentsHandler,
];
