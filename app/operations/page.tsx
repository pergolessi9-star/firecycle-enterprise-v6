import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusCard";
import { OperationOrder } from "@prisma/client";

export default async function Operations() {
  const orders = await prisma.operationOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { intervention: true },
    take: 20,
  });

  const byStatus = {
    DRAFT: orders.filter((o: OperationOrder) => o.status === "DRAFT").length,
    ISSUED: orders.filter((o: OperationOrder) => o.status === "ISSUED").length,
    IN_EXECUTION: orders.filter((o: OperationOrder) => o.status === "IN_EXECUTION").length,
    COMPLETED: orders.filter((o: OperationOrder) => o.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Operations Engine</h1>
        <p className="text-gray-600 mt-2">M05: Work Order Execution & Control</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
          <p className="text-gray-600 text-sm">Draft</p>
          <p className="text-3xl font-bold">{byStatus.DRAFT}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Issued</p>
          <p className="text-3xl font-bold text-blue-600">{byStatus.ISSUED}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">In Execution</p>
          <p className="text-3xl font-bold text-orange-600">{byStatus.IN_EXECUTION}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{byStatus.COMPLETED}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Operation Orders</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="p-4 bg-gray-50 rounded border-l-4 border-gray-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{order.code}</p>
                    <p className="text-sm text-gray-600">{order.intervention.name}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">Team</span>
                    <p className="font-semibold">{order.team || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Issued</span>
                    <p className="text-xs">{order.issuedAt?.toLocaleDateString() || 'Pending'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Started</span>
                    <p className="text-xs">{order.startedAt?.toLocaleDateString() || 'Not started'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No operation orders</p>
          )}
        </div>
      </div>
    </div>
  );
}
