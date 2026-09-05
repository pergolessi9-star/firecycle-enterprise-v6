import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/api-auth";
import { z } from "zod";

const CopilotSchema = z.object({
  message: z.string().min(1).max(4000),
  context: z.object({ selectedTerritory: z.string().max(160).optional() }).passthrough().default({}),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if (auth.response) return auth.response;
    const { context } = CopilotSchema.parse(await request.json());

    // TODO: Integrate with OpenAI-compatible API
    // For now, return a mock response
    const mockResponses = [
      `Analyzing situation in ${context.selectedTerritory}. Risk assessment shows moderate wildfire hazard. Recommend priority interventions in high-risk parcels.`,
      `The current biomass inventory shows 220 tonnes available. Highest value destination is energy (€12,100 revenue). Processing time: 3-4 weeks.`,
      `Grazing service feasibility: 40% fuel reduction expected from 165 animals over 180 days. Cost: €8,500. Avoided mechanical clearing: €12,750. ROI positive.`,
      `FIREWATCH detected 3 hotspots with 85% confidence. Ignition probability: 48%. Recommend monitoring escalation to CRITICAL if confidence increases.`,
      `Risk prioritization: Parcel Norte is #2 priority (score: 0.62). Intervention cost €18,000 would reduce risk by 35%. Expected carbon impact: 125t CO2e.`,
    ];

    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process copilot request" },
      { status: 500 }
    );
  }
}
