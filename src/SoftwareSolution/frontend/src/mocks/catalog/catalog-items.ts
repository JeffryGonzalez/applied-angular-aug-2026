import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/vendors/:vendorId/catalog-items';

/**
 * The POST body — matches zCatalogCreateItem. vendorId is in the body *and* the
 * path; the server treats the path as authoritative, which is why the created
 * item below echoes params.vendorId rather than the body's.
 */
type CatalogCreateItemBody = {
  vendorId: string;
  name: string;
};

/**
 * Ids are handed out in sequence instead of randomly so a pessimistic add is
 * obvious in the UI — the row that appears after a POST is always the next
 * `...-1nnn-...` id, and it can't collide with the seeded GET /api/catalog rows.
 */
let sequence = 0;
const nextId = () => {
  const n = `1${(++sequence).toString(16).padStart(3, '0')}`;
  return `0a1b2c3d-${n}-4a00-9000-00000000${n}`;
};

export default [
  http.post<{ vendorId: string }, CatalogCreateItemBody>(ENDPOINT, async ({ request, params }) => {
    const scenario = activeScenarios[`POST ${ENDPOINT}`] ?? 'created';
    const body = await request.json();

    /** What GET /api/catalog/:id would return for the item that was just created. */
    const created = {
      id: nextId(),
      vendorId: params.vendorId,
      name: body.name,
      isDeprecated: false,
    };

    const createdResponse = () =>
      HttpResponse.json(created, {
        status: 201,
        headers: { Location: `/api/catalog/${created.id}` },
      });

    switch (scenario) {
      case 'validation-error':
        // ASP.NET-style validation ProblemDetails — note the PascalCase keys.
        return HttpResponse.json(
          {
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: {
              Name: ['Catalog item names may not begin with a vendor name.'],
            },
          },
          { status: 400 },
        );
      case 'conflict':
        return HttpResponse.json(
          {
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.10',
            title: 'Duplicate catalog item',
            status: 409,
            detail: `This vendor already has a catalog item named "${body.name}".`,
          },
          { status: 409 },
        );
      case 'vendor-not-found':
        // The OpenAPI spec types the 404 body as a bare JSON string, not ProblemDetails.
        return HttpResponse.json(`No vendor with id ${params.vendorId}`, { status: 404 });
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay(3000);
        return createdResponse();
      case 'never-resolves':
        await delay('infinite');
        return createdResponse();
      case 'unknown-vendor-echo':
        // 201, but the item comes back attached to a vendor that isn't in GET /api/vendors.
        return HttpResponse.json(
          { ...created, vendorId: '00000000-0000-4000-8000-000000000000' },
          { status: 201, headers: { Location: `/api/catalog/${created.id}` } },
        );
      case 'renamed-by-server':
        // Servers normalize. The response is the truth, not what was typed.
        return HttpResponse.json(
          { ...created, name: created.name.trim().replace(/\s+/g, ' ').toUpperCase() },
          { status: 201, headers: { Location: `/api/catalog/${created.id}` } },
        );
      case 'deprecated-on-create':
        return HttpResponse.json(
          { ...created, isDeprecated: true },
          { status: 201, headers: { Location: `/api/catalog/${created.id}` } },
        );
      case 'no-content':
        // 201 with an empty body — nothing to pessimistically add.
        return new HttpResponse(null, {
          status: 201,
          headers: { Location: `/api/catalog/${created.id}` },
        });
      case 'created':
      default:
        return createdResponse();
    }
  }),
] as HttpHandler[];
