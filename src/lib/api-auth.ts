import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestSession, hasRole, type AppRole, type SessionUser } from "@/lib/auth";

type AuthResult =
  | { user: SessionUser; response?: never }
  | { user?: never; response: NextResponse };

export async function authorize(
  request: NextRequest,
  allowedRoles?: readonly AppRole[],
): Promise<AuthResult> {
  const user = await getRequestSession(request);
  if (!user) {
    return { response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }
  if (allowedRoles && !hasRole(user, allowedRoles)) {
    return { response: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }) };
  }
  return { user };
}

export function requestMetadata(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
  };
}
