import { defineConfig } from '@hey-api/openapi-ts'; // TODO: Install This npm i -D @hey-api/openapi-ts

export default defineConfig({
  input: ['./openapispecs/helpdesk.json'],
  output: [
    {
      path: 'src/app/areas/shared/api/',
      postProcess: ['prettier'],
      clean: true,
    },
  ],
  plugins: [
    'zod',
    {
      name: '@hey-api/typescript',
      throwOnError: true,
      bundle: false,
    },
  ],
});
