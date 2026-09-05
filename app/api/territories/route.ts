import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize, requestMetadata } from "@/lib/api-auth";
import { z } from "zod";

const TerritorySchema = z.object({
  name: z.string().min(2).max(160),
  region: z.string().min(2).max(120),
  province: z.string().min(2).max(120),
  adminLevel: z.string().max(80).optional().nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  areaHectares: z.number().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const territories = await prisma.territory.findMany();
    return NextResponse.json(territories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch territories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorize(request, ["ADMIN", "MANAGER"]);
    if (auth.response) return auth.response;
    const body = TerritorySchema.parse(await request.json());
    const territory = await prisma.territory.create({
      data: body,
    });
    await prisma.auditLog.create({ data: { userId: auth.user.id, action: "CREATE", entityType: "Territory", entityId: territory.id, changes: JSON.stringify(body), ...requestMetadata(request) } });
    return NextResponse.json(territory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create territory" },
      { status: 500 }
    );
  }
}
