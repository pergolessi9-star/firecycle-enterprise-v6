import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import type { MrvRecord } from "@prisma/client";

export default async function MRV() {
  const mrvRecords = await prisma.mrvRecord.findMany({
    orderBy: { timestamp: "desc" },
    include: { intervention: true },
  });

  const verifiedCount = mrvRecords.filter((m: MrvRecord) => m.certificationReady).length;
  const totalCarbon = mrvRecords.reduce((sum: number, m: MrvRecord) => sum + (m.carbonMeasured || 0), 0);
  const totalBiomass = mrvRecords.reduce((sum: number, m: MrvRecord) => sum + (m.biomassMeasured || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📝 MRV</h1>
        <p className="text-gray-600 mt-2">M08: Monitoring, Reporting & Verification System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Records</p>
          <p className="text-3xl font-bold text-green-600">{mrvRecords.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Certified Ready</p>
          <p className="text-3xl font-bold text-blue-600">{verifiedCount}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
          <p className="text-gray-600 text-sm">Carbon Measured</p>
          <p className="text-3xl font-bold text-emerald-600">{totalCarbon.toLocaleString()}</p>
          <p className="text-xs text-gray-600">t CO2e</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Biomass Measured</p>
          <p className="text-3xl font-bold text-purple-600">{totalBiomass.toLocaleString()}</p>
          <p className="text-xs text-gray-600">tonnes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">MRV Records</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mrvRecords.length > 0 ? (
            mrvRecords.map((record) => (
              <div key={record.id} className="p-4 bg-gray-50 rounded border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{record.intervention.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{record.recordType}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${record.certificationReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {record.certificationReady ? 'Certified Ready' : 'Pending'}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">Carbon</span>
                    <p className="font-semibold">{(record.carbonMeasured || 0).toFixed(0)} t</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Biomass</span>
                    <p className="font-semibold">{(record.biomassMeasured || 0).toFixed(0)} t</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Red.</span>
                    <p className="font-semibold">{(record.riskReduction || 0).toFixed(0)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Veg. Change</span>
                    <p className="font-semibold">{(record.vegetationChange || 0).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No MRV records</p>
          )}
        </div>
      </div>
    </div>
  );
}
