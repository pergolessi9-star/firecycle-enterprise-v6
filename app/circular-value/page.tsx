export default function CircularValue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">♻️ Circular Value Engine</h1>
        <p className="text-gray-600 mt-2">M14: Multi-Destination Optimization & Value Maximization</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center border-l-4 border-green-500">
        <p className="text-gray-700 font-semibold">🔄 Circular Economy Destinations</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-left">
          <div className="bg-white p-3 rounded shadow">
            <p className="font-semibold text-sm">Biomass Energy</p>
            <p className="text-xs text-gray-600 mt-1">Direct combustion</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="font-semibold text-sm">Pellets</p>
            <p className="text-xs text-gray-600 mt-1">Compressed fuel</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="font-semibold text-sm">Biochar</p>
            <p className="text-xs text-gray-600 mt-1">Soil amendment</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="font-semibold text-sm">Timber</p>
            <p className="text-xs text-gray-600 mt-1">Construction</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-6">For each resource, evaluates: revenue, cost, margin, carbon impact, employment, territorial ROI</p>
      </div>
    </div>
  );
}
