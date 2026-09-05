import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { RiskLevel, StatusBadge } from "@/components/StatusCard";
import type { RiskAssessment } from "@prisma/client";

export default async function Risk() {
  const assessments = await prisma.riskAssessment.findMany({
    orderBy: { priorityRank: "asc" },
  });

  const criticalCount = assessments.filter((a: RiskAssessment) => a.riskLevel === "CRITICAL").length;
  const highCount = assessments.filter((a: RiskAssessment) => a.riskLevel === "HIGH").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Risk Engine</h1>
        <p className="text-gray-600 mt-2">M03: Wildfire Risk Assessment & Territorial Prioritization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Critical Risk</p>
          <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">High Risk</p>
          <p className="text-3xl font-bold text-orange-600">{highCount}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Assessments</p>
          <p className="text-3xl font-bold text-blue-600">{assessments.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Low Risk</p>
          <p className="text-3xl font-bold text-green-600">{assessments.filter((a: RiskAssessment) => a.riskLevel === "LOW").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Risk Prioritization Matrix</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {assessments.length > 0 ? (
            assessments.map((assessment: RiskAssessment, idx: number) => (
              <div key={assessment.id} className="p-3 bg-gray-50 rounded border-l-4 border-gray-300 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-200 text-gray-900 font-bold px-2 py-1 rounded text-xs">
                        #{assessment.priorityRank || idx + 1}
                      </span>
                      <RiskLevel level={assessment.riskLevel} />
                      <span className="text-xs text-gray-600">
                        Risk Assessment #{assessment.id.substring(0, 8)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-gray-600">Hazard:</span>
                        <p className="font-semibold">{(assessment.hazard * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Exposure:</span>
                        <p className="font-semibold">{(assessment.exposure * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Vulnerability:</span>
                        <p className="font-semibold">{(assessment.vulnerability * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <p className="font-semibold">{(assessment.wildcardRiskScore * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No risk assessments</p>
          )}
        </div>
      </div>
    </div>
  );
}
