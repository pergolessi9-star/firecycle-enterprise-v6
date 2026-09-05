import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE, sessionMaxAgeSeconds } from "@/lib/auth";
import { requestMetadata } from "@/lib/api-auth";

const LoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = await createSessionToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entityType: "Session",
      entityId: user.id,
      ...requestMetadata(request),
    },
  });
  return response;
}
