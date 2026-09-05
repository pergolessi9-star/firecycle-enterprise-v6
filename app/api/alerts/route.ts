import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize, requestMetadata } from "@/lib/api-auth";
import { z } from "zod";

const AlertSchema = z.object({
  territoryId: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  severity: z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]).default("MODERATE"),
  confidence: z.number().min(0).max(1),
  ignitionProbability: z.number().min(0).max(1).optional().nullable(),
  affectedHectares: z.number().nonnegative().optional().nullable(),
  status: z.enum(["ACTIVE", "MONITORED", "ESCALATED", "RESOLVED"]).default("ACTIVE"),
  hotspotCount: z.number().int().positive().default(1),
  correlatedSatelliteImages: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const alerts = await prisma.firewatchAlert.findMany({
      include: { territory: true },
      orderBy: { detectedAt: "desc" },
    });
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorize(request, ["ADMIN", "MANAGER", "OPERATOR"]);
    if (auth.response) return auth.response;
    const body = AlertSchema.parse(await request.json());
    const alert = await prisma.firewatchAlert.create({
      data: body,
      include: { territory: true },
    });
    await prisma.auditLog.create({ data: { userId: auth.user.id, action: "CREATE", entityType: "FirewatchAlert", entityId: alert.id, changes: JSON.stringify(body), ...requestMetadata(request) } });
    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
