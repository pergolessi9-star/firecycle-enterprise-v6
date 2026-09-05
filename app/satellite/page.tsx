import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { SatelliteConstellation, SatelliteObservation } from "@prisma/client";

export default async function Satellite() {
  const constellations = await prisma.satelliteConstellation.findMany({
    include: { images: { take: 3 } },
  });

  const observations = await prisma.satelliteObservation.findMany({
    orderBy: { acquisitionTime: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🛰️ Satellite Intelligence</h1>
        <p className="text-gray-600 mt-2">M00-SAT: Satellite Constellation Data & Observations</p>
      </div>

      {/* Constellations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Satellite Constellations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {constellations.map((constellation: SatelliteConstellation & { images: Array<any> }) => (
            <div key={constellation.id} className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg">{constellation.name}</h3>
              <p className="text-sm text-gray-600">Provider: {constellation.provider}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Resolution</p>
                  <p className="font-semibold">{constellation.resolutionMeters}m</p>
                </div>
                <div>
                  <p className="text-gray-600">Revisit</p>
                  <p className="font-semibold">{constellation.revisitDays} days</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Recent Images: {constellation.images.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Observations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Observations</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {observations.length > 0 ? (
            observations.map((obs: SatelliteObservation) => (
              <div key={obs.id} className="p-3 bg-gray-50 rounded border-l-2 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold capitalize">{obs.observationType}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {obs.latitude.toFixed(3)}, {obs.longitude.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-600">{obs.acquisitionTime.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{(obs.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-600">Confidence</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No observations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
