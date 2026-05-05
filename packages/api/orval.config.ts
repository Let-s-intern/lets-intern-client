import { defineConfig } from 'orval';

export default defineConfig({
  letscareer: {
    input: { target: './openapi.json' },
    output: {
      target: './src/generated',
      mode: 'tags-split',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: './src/mutator.ts',
          name: 'customAxios',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
        // tag 'xxx-v-1-controller' / 'xxx-v-1-admin-controller' → 'xxx' 정리
        transformer: (verb) => ({
          ...verb,
          tags: (verb.tags || []).map((t) =>
            t
              .replace(/-v-\d+-(admin-)?controller$/, '')
              .replace(/^\d+\.\s*/, ''),
          ),
        }),
      },
      prettier: false,
      clean: true,
    },
  },
});
