import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  plugins: [tsconfigPaths()],

  test: {
    globals: true,
    coverage: { all: false },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/functions/**/*.test.ts'],
          environment: 'node',
        },
      },

      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/routes/**/*.e2e.test.ts'],
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
