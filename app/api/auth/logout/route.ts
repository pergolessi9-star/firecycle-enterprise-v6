import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestMetadata } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = await getRequestSession(request);
  if (user) {
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGOUT",
        entityType: "Session",
        entityId: user.id,
        ...requestMetadata(request),
      },
    });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
