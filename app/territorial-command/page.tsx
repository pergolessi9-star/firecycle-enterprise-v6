import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { BiomassResource, Contract, GrazingParcel } from "@prisma/client";

export default async function TerritorialBioeconomyCommandCenter() {
  const biomassResources = await prisma.biomassResource.findMany({ take: 5 });
  const contracts = await prisma.contract.findMany({ take: 5 });
  const grazingParcels = await prisma.grazingParcel.findMany({ take: 5 });

  const totalBiomass = biomassResources.reduce((sum: number, b: BiomassResource) => sum + b.availableTonnes, 0);
  const totalValue = biomassResources.reduce((sum: number, b: BiomassResource) => sum + (b.estimatedRevenue || 0), 0);
  const totalGrazing = grazingParcels.reduce((sum: number, g: GrazingParcel) => sum + (g.fuelReduction || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💼 Territorial Bioeconomy Command Center</h1>
        <p className="text-gray-600 mt-2">M15: Integrated Bioeconomy Management & Executive Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Available Biomass</p>
          <p className="text-3xl font-bold text-green-600">{totalBiomass.toLocaleString()}</p>
          <p className="text-xs text-gray-600">tonnes</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Market Value</p>
          <p className="text-3xl font-bold text-blue-600">€{(totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Active Contracts</p>
          <p className="text-3xl font-bold text-purple-600">{contracts.length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Grazing Fuel Red.</p>
          <p className="text-3xl font-bold text-orange-600">{totalGrazing.toFixed(0)}</p>
          <p className="text-xs text-gray-600">tonnes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">📦 Biomass Resources</h2>
          <div className="space-y-2">
            {biomassResources.map((resource: BiomassResource) => (
              <div key={resource.id} className="p-2 bg-green-50 rounded text-sm">
                <p className="font-semibold capitalize">{resource.resourceType}</p>
                <p className="text-xs text-gray-600">{resource.availableTonnes} tm • €{(resource.marketValue || 0)}/tm</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">📋 Active Contracts</h2>
          <div className="space-y-2">
            {contracts.map((contract: Contract) => (
              <div key={contract.id} className="p-2 bg-blue-50 rounded text-sm">
                <p className="font-semibold">{contract.contractNumber}</p>
                <p className="text-xs text-gray-600">{contract.tonnes} tm • €{contract.totalValue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
