"use client";

export function StatusCard({
  title,
  value,
  unit,
  color = "bg-blue-500",
}: {
  title: string;
  value: number | string;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        {unit && <span className="text-gray-500 ml-2">{unit}</span>}
      </div>
    </div>
  );
}

export function AlertBadge({
  severity,
  text,
}: {
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  text: string;
}) {
  const colors = {
    LOW: "bg-green-100 text-green-800",
    MODERATE: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[severity]}`}>
      {text}
    </span>
  );
}

export function RiskLevel({ level }: { level: string }) {
  const colors = {
    LOW: "text-green-600",
    MODERATE: "text-yellow-600",
    HIGH: "text-orange-600",
    CRITICAL: "text-red-600",
  };

  return <span className={`font-semibold ${colors[level as keyof typeof colors] || "text-gray-600"}`}>{level}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    MONITORED: "bg-blue-100 text-blue-800",
    ESCALATED: "bg-orange-100 text-orange-800",
    RESOLVED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-800",
    ISSUED: "bg-blue-100 text-blue-800",
    IN_EXECUTION: "bg-orange-100 text-orange-800",
    IN_TRANSIT: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    PROPOSED: "bg-gray-100 text-gray-800",
    PLANNED: "bg-blue-100 text-blue-800",
    SCHEDULED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-orange-100 text-orange-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}
