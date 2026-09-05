# FIRECYCLE AI authentication

## Components

- `proxy.ts`: optimistic session check and redirect to `/login` for protected pages.
- `src/lib/auth.ts`: JWT creation and verification, session cookie configuration and role types.
- `src/lib/api-auth.ts`: authoritative API authentication and role checks.
- `app/api/auth/login/route.ts`: validates credentials, checks the bcrypt hash, issues the cookie and records login.
- `app/api/auth/logout/route.ts`: records logout and expires the cookie.
- `app/api/auth/me/route.ts`: returns the authenticated user's safe profile.
- `prisma/schema.prisma`: users, roles, territory assignments and audit records.

## Request flow

1. A visitor requests a protected page.
2. `proxy.ts` verifies the signed session cookie. Missing or invalid sessions are redirected to `/login`.
3. The login route validates the body with Zod and retrieves the user by normalized email.
4. `bcrypt.compare` verifies the submitted password against `passwordHash`; plaintext passwords are never stored.
5. `jose` signs an HS256 JWT containing the user ID, email, display name and role, plus issued-at and expiry claims.
6. The route stores the JWT in `firecycle_session`, an `HttpOnly`, `SameSite=Lax`, root-scoped cookie. Production cookies are also `Secure`.
7. Every API route calls `authorize()` independently. The proxy is not treated as the authorization boundary.
8. Mutating routes check the role, validate the body and write an `AuditLog` containing actor, action, entity and request metadata.

## Roles

| Capability | ADMIN | MANAGER | ANALYST | OPERATOR | VIEWER |
| --- | --- | --- | --- | --- | --- |
| View protected modules | Yes | Yes | Yes | Yes | Yes |
| Create territories | Yes | Yes | No | No | No |
| Create FIREWATCH alerts | Yes | Yes | No | Yes | No |
| Use Copilot | Yes | Yes | Yes | Yes | Yes |

Future APIs must use `authorize(request)` for authenticated access or `authorize(request, [roles])` for restricted access. Territory-level filtering should be added when assignments become operational.

## Credential handling

- `DATABASE_URL` and `JWT_SECRET` exist only on the server.
- `JWT_SECRET` must contain at least 32 characters and must be rotated if exposed.
- Passwords are hashed with bcrypt cost factor 12 before insertion.
- Seed passwords come from one-time environment variables; placeholders are rejected.
- The browser cannot read the session JWT because the cookie is `HttpOnly`.
- `OPENAI_API_KEY` remains server-side and is currently unused because Copilot is simulated.
- `CopilotContext.sessionId` identifies a conversation, not an authentication session.

## Response behavior

- `401 Authentication required`: no valid session.
- `403 Insufficient permissions`: valid session, disallowed role.
- `400 Invalid email or password`: malformed login payload.
- `401 Invalid email or password`: credentials do not match; the response does not reveal whether the email exists.

## Production hardening still recommended

- Add rate limiting and progressive delay to login attempts.
- Add CSRF protection for high-impact mutations if cross-site integrations are introduced.
- Add password reset, account suspension, token revocation and optional MFA.
- Filter territorial records by the `UserTerritories` relation.
- Forward structured audit events to protected, append-only storage.
