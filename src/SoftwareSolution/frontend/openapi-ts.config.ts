import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: ['./openapispecs/software-api-v1.json'],
  output: [
    {
      path: 'src/app/areas/shared/api/',
      postProcess: ['prettier', 'eslint'],
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
