import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://localhost/firecycle_ai',
  },
});
