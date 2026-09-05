import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import type { Evidence } from "@prisma/client";

export default async function Evidence() {
  const evidence = await prisma.evidence.findMany({
    orderBy: { timestamp: "desc" },
    include: { parcel: true, intervention: true, riskAssessment: true },
  });

  const byState = {
    PENDING: evidence.filter((e: Evidence) => e.verificationState === "PENDING").length,
    VERIFIED: evidence.filter((e: Evidence) => e.verificationState === "VERIFIED").length,
    REJECTED: evidence.filter((e: Evidence) => e.verificationState === "REJECTED").length,
  };

  const byType = evidence.reduce((acc: Record<string, number>, e: Evidence) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📋 Evidence Engine</h1>
        <p className="text-gray-600 mt-2">M02: Evidence Registry & Provenance Tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Records</p>
          <p className="text-3xl font-bold text-blue-600">{evidence.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Verified</p>
          <p className="text-3xl font-bold text-green-600">{byState.VERIFIED}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{byState.PENDING}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{byState.REJECTED}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Evidence by Type</h2>
          <div className="space-y-2">
           {Object.entries(byType).map(([type, count]: [string, number]) => (
              <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm capitalize">{type}</span>
                <span className="font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Verification Status</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-blue-600">{byState.PENDING}</p>
              <p className="text-xs text-gray-600 mt-1">{byState.PENDING > 0 ? 'Action needed' : 'All caught up'}</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Verified & Certified</p>
              <p className="text-2xl font-bold text-green-600">{byState.VERIFIED}</p>
              <p className="text-xs text-gray-600 mt-1">Ready for MRV</p>
            </div>
          </div>
        </div>

        {/* Sources Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Evidence Sources</h2>
          <div className="space-y-2">
           {Array.from(new Set(evidence.map((e: Evidence) => e.source))).map((source: string | undefined) => (
              <div key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{source}</span>
               <span className="text-xs text-gray-600">{evidence.filter((e: Evidence) => e.source === source).length} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Registry */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Evidence Registry</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {evidence.length > 0 ? (
            evidence.map((record) => (
              <div key={record.id} className="p-4 bg-gray-50 rounded border-l-4 border-gray-300">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm capitalize">{record.type}</p>
                    <p className="text-xs text-gray-600">{record.source}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    record.verificationState === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    record.verificationState === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.verificationState}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {record.timestamp.toLocaleDateString()} • 
                  Confidence: {(record.confidence || 0) * 100}%
                  {record.parcel && ` • Parcel: ${record.parcel.name}`}
                </p>
                {record.dataHash && <p className="text-xs text-gray-500 mt-1 font-mono truncate">Hash: {record.dataHash.slice(0, 16)}...</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No evidence records</p>
          )}
        </div>
      </div>
    </div>
  );
}
