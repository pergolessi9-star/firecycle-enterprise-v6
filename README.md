# FIRECYCLE AI

Territorial platform for wildfire prevention, forest restoration, evidence, MRV and circular bioeconomy. Built with Next.js 16, React 19, Prisma 7 and PostgreSQL.

## Security status

The application uses first-party email/password authentication, signed JWT sessions in `HttpOnly` cookies, role-based API authorization and audit logs. See [AUTHENTICATION.md](./AUTHENTICATION.md) for the request flow and permission model.

Never commit `.env.local`, database URLs, passwords, JWT secrets or API keys. The repository's `.gitignore` excludes every `.env*` file; only `.env.example` is intended for version control.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and replace every placeholder.
3. Generate a secret of at least 32 random characters with `openssl rand -base64 48`.
4. Run `npx prisma generate` and `npx prisma migrate deploy`.
5. Set strong one-time `SEED_ADMIN_PASSWORD` and `SEED_MANAGER_PASSWORD` values, then run `npx prisma db seed`.
6. Start the application with `npm run dev` and open `http://localhost:3000`.

Anonymous page requests are redirected to `/login`; protected APIs return HTTP 401.

## Production platform: Vercel

The selected platform is Vercel, connected to the GitHub repository. Configure these server-side environment variables separately for Preview and Production:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRY`
- `OPENAI_API_KEY` when the real Copilot integration is enabled
- `OPENAI_BASE_URL` when required

Do not configure secrets with a `NEXT_PUBLIC_` prefix. Use Prisma Postgres or another PostgreSQL service with connection pooling, run `prisma migrate deploy` during release, and create production users through a controlled administrative process rather than retaining seed passwords.

## Verification

```bash
npm run typecheck
npm run build
```

The AI Copilot endpoint remains in mock mode and does not call OpenAI yet.
