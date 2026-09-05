import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { FirewatchAlert, Intervention, RiskAssessment } from "@prisma/client";

export default async function CommandCenter() {
  const territories = await prisma.territory.findMany({
    include: {
      alerts: { orderBy: { detectedAt: "desc" }, take: 5 },
      interventions: { orderBy: { priority: "asc" }, take: 5 },
      riskAssessments: { orderBy: { priorityRank: "asc" }, take: 5 },
    },
  });

  const firstTerritory = territories[0];

  if (!firstTerritory) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No territories configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎯 Command Center</h1>
        <p className="text-gray-600 mt-2">Operational headquarters integrating all modules</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-900">{firstTerritory.name}</h2>
        <p className="text-blue-700">{firstTerritory.region} / {firstTerritory.province}</p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Area</p>
            <p className="font-bold">{firstTerritory.areaHectares.toLocaleString()} ha</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Lat</p>
            <p className="font-bold">{firstTerritory.latitude.toFixed(3)}</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Lon</p>
            <p className="font-bold">{firstTerritory.longitude.toFixed(3)}</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Alerts</p>
            <p className="font-bold text-red-600">{firstTerritory.alerts.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">🔥 Active Alerts</h2>
          <div className="space-y-2">
            {firstTerritory.alerts.map((alert: FirewatchAlert) => (
              <div key={alert.id} className="p-2 bg-red-50 rounded border-l-2 border-red-500">
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <p className="font-semibold">Severity: {alert.severity}</p>
                    <p className="text-xs text-gray-600">{alert.latitude.toFixed(2)}, {alert.longitude.toFixed(2)}</p>
                  </div>
                  <p className="font-bold text-red-600">{(alert.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">🔧 Interventions</h2>
          <div className="space-y-2">
            {firstTerritory.interventions.map((intervention: Intervention) => (
              <div key={intervention.id} className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <p className="font-semibold line-clamp-1">{intervention.name.slice(0, 20)}</p>
                    <p className="text-xs text-gray-600">{intervention.hectares} ha</p>
                  </div>
                  <StatusBadge status={intervention.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">📊 Risk Summary</h2>
          <div className="space-y-2">
            {firstTerritory.riskAssessments.map((risk: RiskAssessment) => (
              <div key={risk.id} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">Risk Score</p>
                  <span className="font-bold text-orange-600">{(risk.wildcardRiskScore * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-gray-600">Level: {risk.riskLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-12 text-center">
        <p className="text-gray-700 text-lg font-semibold">🗺️ Interactive Map</p>
        <p className="text-gray-600 text-sm mt-2">Mapping integration available</p>
      </div>
    </div>
  );
}
