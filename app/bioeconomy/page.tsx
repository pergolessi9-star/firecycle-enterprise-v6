import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { BiomassResource, Parcel, Territory } from "@prisma/client";

export default async function Bioeconomy() {
  const biomassResources = await prisma.biomassResource.findMany({
    include: { parcel: true, territory: true },
    orderBy: { estimatedRevenue: "desc" },
  });

  const totalAvailable = biomassResources.reduce((sum: number, b: BiomassResource & { parcel: Parcel; territory: Territory }) => sum + b.availableTonnes, 0);
  const totalValue = biomassResources.reduce((sum: number, b: BiomassResource & { parcel: Parcel; territory: Territory }) => sum + (b.estimatedRevenue || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌳 Bioeconomy Resource Engine</h1>
        <p className="text-gray-600 mt-2">M11: Territorial Inventory & Resource Valuation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Available</p>
          <p className="text-3xl font-bold text-green-600">{totalAvailable.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">tonnes</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Market Value</p>
          <p className="text-3xl font-bold text-blue-600">€{(totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Resources</p>
          <p className="text-3xl font-bold text-purple-600">{biomassResources.length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Avg Market Value</p>
          <p className="text-3xl font-bold text-orange-600">€{biomassResources.length > 0 ? ((totalValue / biomassResources.length) / 1000).toFixed(0) : 0}k</p>
        </div>
      </div>

      {/* Resource Types */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(new Set(biomassResources.map((b: BiomassResource & { parcel: Parcel; territory: Territory }) => b.resourceType))).map((type: string | undefined) => {
          const count = biomassResources.filter((b: BiomassResource & { parcel: Parcel; territory: Territory }) => b.resourceType === type).length;
          const tonnes = biomassResources.filter((b: BiomassResource & { parcel: Parcel; territory: Territory }) => b.resourceType === type).reduce((sum: number, b: BiomassResource & { parcel: Parcel; territory: Territory }) => sum + b.availableTonnes, 0);
          return (
            <div key={type} className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500">
              <p className="text-gray-600 text-sm capitalize">{type}</p>
              <p className="text-2xl font-bold mt-1">{count}</p>
              <p className="text-xs text-gray-600 mt-2">{tonnes.toLocaleString()} tm available</p>
            </div>
          );
        })}
      </div>

      {/* Resource Inventory */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Resource Inventory</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {biomassResources.length > 0 ? (
            biomassResources.map((resource) => (
              <div key={resource.id} className="p-4 bg-gray-50 rounded border-l-4 border-green-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold capitalize">{resource.resourceType}</p>
                    <p className="text-sm text-gray-600">{resource.territory.name} • {resource.parcel.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">€{(resource.estimatedRevenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Estimated</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs mt-3">
                  <div>
                    <span className="text-gray-600">Tonnes</span>
                    <p className="font-semibold">{resource.availableTonnes.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Humidity</span>
                    <p className="font-semibold">{(resource.humidity || 0).toFixed(0)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Extract Cost</span>
                    <p className="font-semibold">€{(resource.extractionCost || 0).toFixed(0)}/tm</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Market Price</span>
                    <p className="font-semibold">€{(resource.marketValue || 0).toFixed(0)}/tm</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No resources registered</p>
          )}
        </div>
      </div>
    </div>
  );
}
