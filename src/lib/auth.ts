import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "firecycle_session";

export const ROLES = ["ADMIN", "MANAGER", "ANALYST", "OPERATOR", "VIEWER"] as const;
export type AppRole = (typeof ROLES)[number];

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
};

type SessionPayload = SessionUser & { sub: string };

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export function sessionMaxAgeSeconds() {
  const configured = process.env.JWT_EXPIRY ?? "7d";
  const match = /^(\d+)([smhd])$/.exec(configured);
  if (!match) return 60 * 60 * 24 * 7;
  const value = Number(match[1]);
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as "s" | "m" | "h" | "d"];
  return value * multiplier;
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds())
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const candidate = payload as unknown as SessionPayload;
    if (!candidate.sub || !candidate.email || !ROLES.includes(candidate.role)) return null;
    return {
      id: candidate.sub,
      email: candidate.email,
      name: candidate.name ?? null,
      role: candidate.role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function getRequestSession(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export function hasRole(user: SessionUser, allowed: readonly AppRole[]) {
  return allowed.includes(user.role);
}
