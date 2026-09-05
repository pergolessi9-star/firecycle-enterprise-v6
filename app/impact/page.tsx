import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import type { TerritorialImpact } from "@prisma/client";

export default async function Impact() {
  const impacts = await prisma.territorialImpact.findMany({
    include: { territory: true },
  });

  const totalEmployment = impacts.reduce((sum: number, i: TerritorialImpact) => sum + (i.employment || 0), 0);
  const totalIncome = impacts.reduce((sum: number, i: TerritorialImpact) => sum + (i.income || 0), 0);
  const avgCarbon = impacts.reduce((sum: number, i: TerritorialImpact) => sum + (i.carbonSequestered || 0), 0) / Math.max(impacts.length, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌍 Territorial Impact Engine</h1>
        <p className="text-gray-600 mt-2">M07: Environmental, Social, Employment & Economic KPIs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Employment Created</p>
          <p className="text-3xl font-bold text-blue-600">{totalEmployment}</p>
          <p className="text-xs text-gray-600">jobs</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Income</p>
          <p className="text-3xl font-bold text-green-600">€{(totalIncome / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
          <p className="text-gray-600 text-sm">Avg Carbon</p>
          <p className="text-3xl font-bold text-emerald-600">{avgCarbon.toFixed(0)}</p>
          <p className="text-xs text-gray-600">CO2e tonnes/territory</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Territories</p>
          <p className="text-3xl font-bold text-purple-600">{impacts.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Impact Summary by Territory</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {impacts.length > 0 ? (
            impacts.map((impact: TerritorialImpact & { territory: typeof impacts[0]['territory'] }) => (
              <div key={impact.id} className="p-4 bg-gray-50 rounded border-l-4 border-blue-400">
                <h3 className="font-bold text-lg">{impact.territory.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mt-3">
                  <div>
                    <span className="text-gray-600">Employment</span>
                    <p className="font-semibold">{impact.employment || 0} jobs</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Income</span>
                    <p className="font-semibold">€{((impact.income || 0) / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbon</span>
                    <p className="font-semibold">{(impact.carbonSequestered || 0).toFixed(0)} t</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Biodiversity</span>
                    <p className="font-semibold">{((impact.biodiversityScore || 0) * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Social Accept.</span>
                    <p className="font-semibold">{((impact.socialAcceptance || 0) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No impact assessments</p>
          )}
        </div>
      </div>
    </div>
  );
}
