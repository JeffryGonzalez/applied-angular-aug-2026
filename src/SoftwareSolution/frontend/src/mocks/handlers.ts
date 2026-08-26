import { HttpHandler } from 'msw';
import catalogHandler from './catalog/catalog';
import vendorsHandler from './catalog/vendors';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [...catalogHandler, ...vendorsHandler];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
