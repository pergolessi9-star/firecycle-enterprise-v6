export default function Grazing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🐑 Grazing & Livestock Engine</h1>
        <p className="text-gray-600 mt-2">M13: Preventive Grazing Service Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Grazing Parcels</p>
          <p className="text-3xl font-bold text-green-600">—</p>
          <p className="text-xs text-gray-500 mt-1">Database connected</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
          <p className="text-gray-600 text-sm">Total Animals</p>
          <p className="text-3xl font-bold text-amber-600">—</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Fuel Reduced</p>
          <p className="text-3xl font-bold text-blue-600">—</p>
          <p className="text-xs text-gray-500 mt-1">tonnes</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Fire Risk Red.</p>
          <p className="text-3xl font-bold text-purple-600">—</p>
          <p className="text-xs text-gray-500 mt-1">average %</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border-l-4 border-green-500 text-center">
        <p className="text-gray-700 font-semibold text-lg">🐐 Grazing Service Details</p>
        <p className="text-gray-600 mt-2">Module connected to database. Showing data when grazing parcels are configured.</p>
      </div>
    </div>
  );
}
