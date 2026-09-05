import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { EconomicAnalysis, Intervention } from "@prisma/client";

export default async function Economics() {
  const analyses = await prisma.economicAnalysis.findMany({
    include: { intervention: true },
    orderBy: { createdAt: "desc" },
  });

  const totalCapex = analyses.reduce((sum: number, a: EconomicAnalysis) => sum + (a.capex || 0), 0);
  const totalRoi = analyses.reduce((sum: number, a: EconomicAnalysis) => sum + (a.roi || 0), 0) / Math.max(analyses.length, 1);
  const avgPayback = analyses.reduce((sum: number, a: EconomicAnalysis) => sum + (a.paybackYears || 0), 0) / Math.max(analyses.length, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💰 Economic Engine</h1>
        <p className="text-gray-600 mt-2">M06: Cost, Investment, ROI & Financial Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total CAPEX</p>
          <p className="text-3xl font-bold text-green-600">€{(totalCapex / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Avg ROI</p>
          <p className="text-3xl font-bold text-blue-600">{totalRoi.toFixed(1)}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Avg Payback</p>
          <p className="text-3xl font-bold text-purple-600">{avgPayback.toFixed(1)}</p>
          <p className="text-xs text-gray-600">years</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Analyses</p>
          <p className="text-3xl font-bold text-orange-600">{analyses.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Economic Analysis Registry</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {analyses.length > 0 ? (
            analyses.map((analysis) => (
              <div key={analysis.id} className="p-4 bg-gray-50 rounded border-l-4 border-green-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{analysis.intervention.name}</p>
                    <p className="text-sm text-gray-600">{analysis.intervention.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{analysis.roi?.toFixed(1)}% ROI</p>
                    <p className="text-xs text-gray-600">{analysis.paybackYears?.toFixed(1)} yr payback</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">CAPEX</span>
                    <p className="font-semibold">€{(analysis.capex || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">OPEX</span>
                    <p className="font-semibold">€{(analysis.opex || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue</span>
                    <p className="font-semibold">€{(analysis.revenues || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin</span>
                    <p className="font-semibold">€{(analysis.margin || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No economic analyses</p>
          )}
        </div>
      </div>
    </div>
  );
}
