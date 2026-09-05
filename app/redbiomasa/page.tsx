import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { MarketplaceListing, Contract } from "@prisma/client";

export default async function REDBIOMASA() {
  const listings = await prisma.marketplaceListing.findMany({
    include: { lot: { include: { resource: true } }, offers: true },
    orderBy: { publishedAt: "desc" },
  });

  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const byStatus = {
    PUBLISHED: listings.filter((l: MarketplaceListing) => l.status === "PUBLISHED").length,
    NEGOTIATING: listings.filter((l: MarketplaceListing) => l.status === "NEGOTIATING").length,
    SOLD: listings.filter((l: MarketplaceListing) => l.status === "SOLD").length,
  };

  const totalValue = contracts.reduce((sum: number, c: Contract) => sum + c.totalValue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏪 REDBIOMASA Marketplace</h1>
        <p className="text-gray-600 mt-2">M12: Biomass Trading Platform - Resource Lot to Delivery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Published Lots</p>
          <p className="text-3xl font-bold text-blue-600">{byStatus.PUBLISHED}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Negotiating</p>
          <p className="text-3xl font-bold text-orange-600">{byStatus.NEGOTIATING}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Sold</p>
          <p className="text-3xl font-bold text-green-600">{byStatus.SOLD}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Contract Value</p>
          <p className="text-3xl font-bold text-purple-600">€{(totalValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Marketplace Listings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">📦 Active Listings</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="p-4 bg-gray-50 rounded border-l-4 border-blue-400 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={listing.status} />
                    <p className="font-bold text-green-600 mt-2">€{listing.askingPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">Quantity</span>
                    <p className="font-semibold">{listing.lot.tonnes} tm</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Quality</span>
                    <p className="font-semibold">{listing.lot.quality || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Offers</span>
                    <p className="font-semibold">{listing.offers.length}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No active listings</p>
          )}
        </div>
      </div>

      {/* Recent Contracts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">📋 Recent Contracts</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <div key={contract.id} className="p-4 bg-gray-50 rounded border-l-4 border-green-400">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{contract.contractNumber}</h3>
                    <p className="text-sm text-gray-600">{contract.buyerName}</p>
                  </div>
                  <StatusBadge status={contract.status} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">Tonnes</span>
                    <p className="font-semibold">{contract.tonnes}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit Price</span>
                    <p className="font-semibold">€{contract.unitPrice}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Value</span>
                    <p className="font-semibold">€{contract.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery</span>
                    <p className="font-semibold text-xs">{contract.deliveryDate?.toLocaleDateString() || 'Pending'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No contracts yet</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-500">
        <p className="text-gray-700 font-semibold">🔄 REDBIOMASA Workflow</p>
        <p className="text-sm text-gray-600 mt-2">Resource lot → Publication → Offer → Negotiation → Contract → Transport → Delivery → Certification</p>
      </div>
    </div>
  );
}
