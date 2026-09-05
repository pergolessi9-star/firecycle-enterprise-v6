import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { Intervention } from "@prisma/client";

export default async function Interventions() {
  const interventions = await prisma.intervention.findMany({
    orderBy: { priority: "asc" },
    include: { territory: true },
  });

  const byStatus = {
    PROPOSED: interventions.filter((i: Intervention) => i.status === "PROPOSED").length,
    PLANNED: interventions.filter((i: Intervention) => i.status === "PLANNED").length,
    IN_PROGRESS: interventions.filter((i: Intervention) => i.status === "IN_PROGRESS").length,
    COMPLETED: interventions.filter((i: Intervention) => i.status === "COMPLETED").length,
  };

  const totalHectares = interventions.reduce((sum: number, i: Intervention) => sum + i.hectares, 0);
  const totalCost = interventions.reduce((sum: number, i: Intervention) => sum + (i.estimatedCost || 0), 0);
  const totalRiskReduction = interventions.reduce((sum: number, i: Intervention) => sum + (i.expectedRiskReduction || 0), 0) / Math.max(interventions.length, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🔧 Interventions</h1>
        <p className="text-gray-600 mt-2">M04: Intervention Portfolio Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Hectares</p>
          <p className="text-3xl font-bold text-blue-600">{totalHectares.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Estimated Investment</p>
          <p className="text-3xl font-bold text-green-600">€{(totalCost / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Avg Risk Reduction</p>
          <p className="text-3xl font-bold text-purple-600">{totalRiskReduction.toFixed(0)}%</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
          <p className="text-gray-600 text-sm">Total Interventions</p>
          <p className="text-3xl font-bold text-indigo-600">{interventions.length}</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <p className="text-gray-600 text-sm">Proposed</p>
          <p className="text-2xl font-bold text-gray-700">{byStatus.PROPOSED}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
          <p className="text-gray-600 text-sm">Planned</p>
          <p className="text-2xl font-bold text-blue-600">{byStatus.PLANNED}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-orange-600">{byStatus.IN_PROGRESS}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">{byStatus.COMPLETED}</p>
        </div>
      </div>

      {/* Intervention List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Priority-Sorted Interventions</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {interventions.length > 0 ? (
            interventions.map((intervention) => (
              <div key={intervention.id} className="p-4 bg-gray-50 rounded border-l-4 border-gray-300 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{intervention.name}</h3>
                    <p className="text-sm text-gray-600">{intervention.territory.name} • {intervention.type}</p>
                  </div>
                  <StatusBadge status={intervention.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mt-2">
                  <div>
                    <span className="text-gray-600">Priority</span>
                    <p className="font-semibold">#{intervention.priority}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Area</span>
                    <p className="font-semibold">{intervention.hectares} ha</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Cost</span>
                    <p className="font-semibold">€{(intervention.estimatedCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Red.</span>
                    <p className="font-semibold">{(intervention.expectedRiskReduction || 0).toFixed(0)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location</span>
                    <p className="font-semibold text-xs">{intervention.latitude.toFixed(2)}, {intervention.longitude.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No interventions planned</p>
          )}
        </div>
      </div>
    </div>
  );
}
