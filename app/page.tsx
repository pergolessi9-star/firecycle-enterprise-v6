import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusCard, AlertBadge } from "@/components/StatusCard";
import type { FirewatchAlert, RiskAssessment } from "@prisma/client";

export default async function Dashboard() {
  try {
    const [
      territories,
      alerts,
      interventions,
      parcels,
      riskAssessments,
      evidence,
      contracts,
    ] = await Promise.all([
      prisma.territory.findMany(),
      prisma.firewatchAlert.findMany({ take: 10, orderBy: { detectedAt: "desc" } }),
      prisma.intervention.findMany({ take: 10, orderBy: { priority: "asc" } }),
      prisma.parcel.findMany({ take: 5 }),
      prisma.riskAssessment.findMany({ take: 5 }),
      prisma.evidence.findMany({ take: 5, orderBy: { timestamp: "desc" } }),
      prisma.contract.findMany({ take: 5 }),
    ]);

    const activeAlerts = alerts.filter((a: FirewatchAlert) => a.status === "ACTIVE").length;
    const highRiskParcels = riskAssessments.filter(
      (r: RiskAssessment) => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL"
    ).length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FIRECYCLE AI Dashboard</h1>
          <p className="text-gray-600 mt-2">Territorial Forest Intelligence & Bioeconomy Platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard
            title="Territories"
            value={territories.length}
            color="text-blue-600"
          />
          <StatusCard
            title="Active Alerts"
            value={activeAlerts}
            color="text-red-600"
          />
          <StatusCard
            title="High Risk Parcels"
            value={highRiskParcels}
            color="text-orange-600"
          />
          <StatusCard
            title="Interventions"
            value={interventions.length}
            color="text-green-600"
          />
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔥 Recent FIREWATCH Alerts</h2>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert: FirewatchAlert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4 border-orange-500"
                >
                  <div>
                    <p className="font-semibold">
                      Alert @ {alert.latitude.toFixed(2)}, {alert.longitude.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {alert.detectedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <AlertBadge severity={alert.severity as "HIGH" | "CRITICAL" | "LOW" | "MODERATE"} text={alert.severity} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active alerts</p>
          )}
        </div>

        {/* Territories Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📍 Territories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {territories.map((territory: typeof territories[0]) => (
              <div
                key={territory.id}
                className="p-4 border rounded hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{territory.name}</h3>
                <p className="text-sm text-gray-600">
                  {territory.region} / {territory.province}
                </p>
                <p className="text-sm font-medium mt-2">
                  📊 {territory.areaHectares.toLocaleString()} ha
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📋 Pending Contracts</h2>
            <p className="text-3xl font-bold text-green-600">{contracts.length}</p>
            <p className="text-gray-600 text-sm mt-2">Active marketplace contracts</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📝 Evidence Records</h2>
            <p className="text-3xl font-bold text-blue-600">{evidence.length}</p>
            <p className="text-gray-600 text-sm mt-2">Verified and verified-pending</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Error loading dashboard. Please ensure database is connected.</p>
      </div>
    );
  }
}
