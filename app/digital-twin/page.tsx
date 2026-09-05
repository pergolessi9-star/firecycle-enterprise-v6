import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { Parcel, ForestStand, VegetationData, GrazingParcel } from "@prisma/client";

export default async function DigitalTwin() {
  const parcels = await prisma.parcel.findMany({
    include: { forestStands: true, vegetation: true, grazingParcels: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌍 Digital Twin</h1>
        <p className="text-gray-600 mt-2">M01: Territorial Digital Replica - Parcels, Forest, Vegetation, Infrastructure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Parcels Mapped</p>
          <p className="text-3xl font-bold text-blue-600">{parcels.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Forest Stands</p>
          <p className="text-3xl font-bold text-green-600">{parcels.reduce((sum: number, p: Parcel & { forestStands: ForestStand[] }) => sum + p.forestStands.length, 0)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">With Grazing</p>
          <p className="text-3xl font-bold text-purple-600">{parcels.filter((p: Parcel & { grazingParcels: GrazingParcel[] }) => p.grazingParcels.length > 0).length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Total Hectares</p>
          <p className="text-3xl font-bold text-orange-600">{parcels.reduce((sum: number, p: Parcel) => sum + p.areaHectares, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Territorial Parcels</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {parcels.length > 0 ? (
            parcels.map((parcel) => (
              <div key={parcel.id} className="p-4 bg-gray-50 rounded border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{parcel.name}</h3>
                    <p className="text-sm text-gray-600">{parcel.ownershipType || 'Unspecified'} • {parcel.managementUnit || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mt-3">
                  <div>
                    <span className="text-gray-600">Area</span>
                    <p className="font-semibold">{parcel.areaHectares} ha</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Elevation</span>
                    <p className="font-semibold">{parcel.elevation || 'N/A'} m</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Slope</span>
                    <p className="font-semibold">{parcel.slope || 'N/A'}°</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Aspect</span>
                    <p className="font-semibold">{parcel.aspect || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Stands</span>
                    <p className="font-semibold">{parcel.forestStands.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Accessibility</span>
                    <p className="font-semibold">{((parcel.accessibility || 0) * 100).toFixed(0)}%</p>
                  </div>
                </div>
                {parcel.vegetation && (
                  <div className="mt-3 p-2 bg-white rounded text-xs">
                    <p className="text-gray-600">Vegetation: {parcel.vegetation.vegetationType}</p>
                    <p className="text-gray-600">Biomass: {(parcel.vegetation.biomass || 0).toFixed(1)} t/ha</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No parcels mapped</p>
          )}
        </div>
      </div>
    </div>
  );
}
