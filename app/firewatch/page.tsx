import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { AlertBadge, StatusBadge } from "@/components/StatusCard";
import type { FirewatchAlert } from "@prisma/client";

export default async function FIREWATCH() {
  const alerts = await prisma.firewatchAlert.findMany({
    orderBy: { detectedAt: "desc" },
  });

  const criticalCount = alerts.filter((a: FirewatchAlert) => a.severity === "CRITICAL").length;
  const activeCount = alerts.filter((a: FirewatchAlert) => a.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🔥 FIREWATCH</h1>
        <p className="text-gray-600 mt-2">Early Wildfire Detection & Alert System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Active Alerts</p>
          <p className="text-3xl font-bold text-orange-600">{activeCount}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Alerts</p>
          <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{alerts.filter((a: FirewatchAlert) => a.status === "RESOLVED").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Alert Timeline</h2>
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map((alert: FirewatchAlert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertBadge severity={alert.severity as "HIGH" | "CRITICAL" | "LOW" | "MODERATE"} text={alert.severity} />
                      <StatusBadge status={alert.status as any} />
                      <span className="text-xs text-gray-500">{alert.detectedAt.toLocaleString()}</span>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">Territory {alert.territoryId.substring(0, 8)}</span> • 
                      {alert.latitude.toFixed(3)}, {alert.longitude.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Confidence: {(alert.confidence * 100).toFixed(0)}% • 
                      Hotspots: {alert.hotspotCount} • 
                      {alert.affectedHectares ? `Affected: ${alert.affectedHectares.toFixed(0)} ha` : ""}
                    </p>
                    {alert.notes && <p className="text-xs text-gray-700 mt-2 italic">{alert.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{(alert.ignitionProbability || 0).toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">Ignition Prob.</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-600">No alerts detected</div>
          )}
        </div>
      </div>
    </div>
  );
}
