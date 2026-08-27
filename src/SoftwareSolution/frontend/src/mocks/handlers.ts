import { HttpHandler } from 'msw';
import catalogHandler from './catalog/catalog';
import catalogItemsHandler from './catalog/catalog-items';
import vendorsHandler from './catalog/vendors';
import vendorsCreateHandler from './catalog/vendors-create';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [
  ...catalogHandler,
  ...catalogItemsHandler,
  ...vendorsHandler,
  ...vendorsCreateHandler,
];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
