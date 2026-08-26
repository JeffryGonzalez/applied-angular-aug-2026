import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';
import { VENDOR_IDS } from './vendors';

const ENDPOINT = '/api/catalog';

const typicalResponse = [
  {
    id: '0a1b2c3d-0001-4a00-9000-000000000001',
    vendorId: VENDOR_IDS.contoso,
    name: 'Identity Gateway',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0002-4a00-9000-000000000002',
    vendorId: VENDOR_IDS.acme,
    name: 'Ledger Sync',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0003-4a00-9000-000000000003',
    vendorId: VENDOR_IDS.litware,
    name: 'Report Builder',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0004-4a00-9000-000000000004',
    vendorId: VENDOR_IDS.northwind,
    name: 'Batch Importer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0005-4a00-9000-000000000005',
    vendorId: VENDOR_IDS.acme,
    name: 'Webhook Relay',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0006-4a00-9000-000000000006',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Legacy SOAP Bridge',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0007-4a00-9000-000000000007',
    vendorId: VENDOR_IDS.litware,
    name: 'Order Feed',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0008-4a00-9000-000000000008',
    vendorId: VENDOR_IDS.contoso,
    name: 'Inventory Snapshot',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0009-4a00-9000-000000000009',
    vendorId: VENDOR_IDS.northwind,
    name: 'Shipping Rate Engine',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000a-4a00-9000-00000000000a',
    vendorId: VENDOR_IDS.northwind,
    name: 'Supplier Directory',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000b-4a00-9000-00000000000b',
    vendorId: VENDOR_IDS.acme,
    name: 'Returns Processor',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-000c-4a00-9000-00000000000c',
    vendorId: VENDOR_IDS.litware,
    name: 'Tax Calculator',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000d-4a00-9000-00000000000d',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Catalog Search Index',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000e-4a00-9000-00000000000e',
    vendorId: VENDOR_IDS.contoso,
    name: 'Payment Vault',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-000f-4a00-9000-00000000000f',
    vendorId: VENDOR_IDS.acme,
    name: 'Fraud Signals',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0010-4a00-9000-000000000010',
    vendorId: VENDOR_IDS.northwind,
    name: 'Statement Renderer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0011-4a00-9000-000000000011',
    vendorId: VENDOR_IDS.litware,
    name: 'Card Tokenizer',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0012-4a00-9000-000000000012',
    vendorId: VENDOR_IDS.fabrikam,
    name: 'Dispute Workflow',
    isDeprecated: true,
  },
  {
    id: '0a1b2c3d-0013-4a00-9000-000000000013',
    vendorId: VENDOR_IDS.contoso,
    name: 'Settlement Export',
    isDeprecated: false,
  },
  {
    id: '0a1b2c3d-0014-4a00-9000-000000000014',
    vendorId: VENDOR_IDS.acme,
    name: 'Audit Trail Viewer',
    isDeprecated: false,
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
