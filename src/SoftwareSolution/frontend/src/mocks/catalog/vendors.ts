import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/vendors';

/**
 * Shared with the /api/catalog handler so catalog items point at vendors that
 * actually exist — the catalog/vendor join in CatalogStore depends on it.
 */
export const VENDOR_IDS = {
  acme: '2f4c0b1a-1c2d-4e3f-9a6b-7c8d9e0f1a2b',
  northwind: '7b3e5d90-4a1f-4c62-8d5e-0b9a1c2d3e4f',
  contoso: 'c1d2e3f4-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
  fabrikam: '9e8d7c6b-5a4f-4e3d-8c2b-1a0f9e8d7c6b',
  litware: '4d5e6f70-8a9b-4c1d-9e2f-3a4b5c6d7e8f',
} as const;

const typicalResponse = [
  {
    id: VENDOR_IDS.acme,
    name: 'Acme Integrations',
    url: 'https://developer.acme-integrations.example.com',
    pointOfContact: {
      name: 'Dana Whitfield',
      email: 'dana.whitfield@acme-integrations.example.com',
      phone: '+1-614-555-0142',
    },
    createdAt: '2021-03-17T14:22:05Z',
  },
  {
    id: VENDOR_IDS.northwind,
    name: 'Northwind Traders',
    url: 'https://api.northwindtraders.example.com',
    pointOfContact: {
      name: 'Marcus Oyelaran',
      email: 'marcus.oyelaran@northwindtraders.example.com',
      phone: '+1-206-555-0178',
    },
    createdAt: '2019-11-04T09:05:41Z',
  },
  {
    id: VENDOR_IDS.contoso,
    name: 'Contoso Data Systems',
    url: 'https://developers.contosodata.example.com',
    pointOfContact: {
      name: 'Priya Raghunathan',
      email: 'priya.raghunathan@contosodata.example.com',
      phone: '+1-312-555-0119',
    },
    createdAt: '2022-06-28T17:48:12Z',
  },
  {
    id: VENDOR_IDS.fabrikam,
    name: 'Fabrikam Logistics',
    url: 'https://partners.fabrikamlogistics.example.com',
    pointOfContact: {
      name: 'Tomasz Wieczorek',
      email: 'tomasz.wieczorek@fabrikamlogistics.example.com',
      phone: '+1-773-555-0163',
    },
    createdAt: '2020-08-09T11:31:57Z',
  },
  {
    id: VENDOR_IDS.litware,
    name: 'Litware Analytics',
    url: 'https://docs.litwareanalytics.example.com',
    pointOfContact: {
      name: 'Simone Achterberg',
      email: 'simone.achterberg@litwareanalytics.example.com',
      phone: '+1-503-555-0126',
    },
    createdAt: '2023-01-22T08:14:30Z',
  },
];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'slow':
        await delay(3000);
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
