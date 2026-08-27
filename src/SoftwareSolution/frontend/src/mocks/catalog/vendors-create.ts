import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/vendors';

/**
 * The POST body — matches zCreateVendorModel. Note the nested pointOfContact:
 * the response adds `id` and `createdAt`, which only the server can supply.
 */
type CreateVendorModelBody = {
  name: string;
  url: string;
  pointOfContact: {
    name: string;
    email: string;
    phone: string;
  };
};

/**
 * Sequential ids so a pessimistically added vendor is obvious next to the five
 * seeded vendors in VENDOR_IDS (see vendors.ts) — a new one is always 2nnn.
 */
let sequence = 0;
const nextId = () => {
  const n = `2${(++sequence).toString(16).padStart(3, '0')}`;
  return `0a1b2c3d-${n}-4a00-9000-00000000${n}`;
};

export default [
  http.post<never, CreateVendorModelBody>(ENDPOINT, async ({ request }) => {
    const scenario = activeScenarios[`POST ${ENDPOINT}`] ?? 'created';
    const body = await request.json();

    /** What GET /api/vendors/:id would return for the vendor just created. */
    const created = {
      id: nextId(),
      name: body.name,
      url: body.url,
      pointOfContact: body.pointOfContact,
      createdAt: new Date().toISOString(),
    };

    const createdResponse = (vendor = created) =>
      HttpResponse.json(vendor, {
        status: 201,
        headers: { Location: `/api/vendors/${vendor.id}` },
      });

    switch (scenario) {
      case 'validation-error':
        // ASP.NET validation ProblemDetails. The nested key is the interesting
        // part — mapping PointOfContact.Email back onto a nested form field.
        return HttpResponse.json(
          {
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: {
              Url: ['Vendor URL must be reachable over https.'],
              'PointOfContact.Email': ['A contact with this email is already on file.'],
            },
          },
          { status: 400 },
        );
      case 'conflict':
        return HttpResponse.json(
          {
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.10',
            title: 'Duplicate vendor',
            status: 409,
            detail: `A vendor named "${body.name}" already exists.`,
          },
          { status: 409 },
        );
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
      case 'normalized-url':
        // The server canonicalizes the URL. Only visible if the store adds the
        // response body rather than the form model.
        return createdResponse({
          ...created,
          url: `https://${created.url.replace(/^https?:\/\//, '').replace(/\/+$/, '')}/`,
        });
      case 'contact-missing-phone':
        return createdResponse({
          ...created,
          pointOfContact: { ...created.pointOfContact, phone: '' },
        });
      case 'bodiless-200':
        // Exactly what openapispecs/software-api-v1.json documents today: 200,
        // no body. There is no entity to add — the list has to be reloaded.
        return new HttpResponse(null, { status: 200 });
      case 'created':
      default:
        return createdResponse();
    }
  }),
] as HttpHandler[];
