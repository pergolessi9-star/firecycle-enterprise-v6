import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { Asset } from "@prisma/client";

export default async function Maintenance() {
  const assets = await prisma.asset.findMany({
    include: { maintenancePlan: true, inspections: { take: 3, orderBy: { inspectionDate: "desc" } } },
  });

  const operationalCount = assets.filter((a: Asset) => a.status === "OPERATIONAL").length;
  const avgCondition = assets.reduce((sum: number, a: Asset) => sum + (a.condition || 0), 0) / Math.max(assets.length, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🔧 Predictive Maintenance</h1>
        <p className="text-gray-600 mt-2">M09: Asset Health & Maintenance Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Operational</p>
          <p className="text-3xl font-bold text-green-600">{operationalCount}</p>
          <p className="text-xs text-gray-600">of {assets.length} assets</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Avg Condition</p>
          <p className="text-3xl font-bold text-blue-600">{(avgCondition * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">With Plans</p>
          <p className="text-3xl font-bold text-orange-600">{assets.filter(a => a.maintenancePlan).length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-purple-600">{assets.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Asset Inventory</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <div key={asset.id} className="p-4 bg-gray-50 rounded border-l-4 border-gray-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{asset.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{asset.assetType}</p>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-3">
                  <div>
                    <span className="text-gray-600">Condition</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${((asset.condition || 0) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 font-semibold">{((asset.condition || 0) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Maint.</span>
                    <p className="font-semibold text-xs">{asset.lastMaintenanceDate?.toLocaleDateString() || 'Never'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Maint.</span>
                    <p className="font-semibold text-xs">{asset.nextMaintenanceDate?.toLocaleDateString() || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Plan</span>
                    <p className="font-semibold">{asset.maintenancePlan ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No assets registered</p>
          )}
        </div>
      </div>
    </div>
  );
}
