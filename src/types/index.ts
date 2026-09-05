export type UserRole = "ADMIN" | "MANAGER" | "ANALYST" | "OPERATOR" | "VIEWER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface Territory {
  id: string;
  name: string;
  region: string;
  province: string;
  latitude: number;
  longitude: number;
  areaHectares: number;
  createdAt: Date;
}

export interface Parcel {
  id: string;
  territoryId: string;
  name: string;
  areaHectares: number;
  latitude: number;
  longitude: number;
  elevation?: number;
  slope?: number;
}

export interface Intervention {
  id: string;
  territoryId: string;
  name: string;
  type: string;
  status: string;
  hectares: number;
  priority: number;
  latitude: number;
  longitude: number;
}

export interface FirewatchAlert {
  id: string;
  territoryId: string;
  latitude: number;
  longitude: number;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  confidence: number;
  status: "ACTIVE" | "MONITORED" | "ESCALATED" | "RESOLVED";
  detectedAt: Date;
}

export interface RiskAssessment {
  id: string;
  parcelId?: string;
  territoryId: string;
  wildcardRiskScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  priorityRank?: number;
}

export interface Evidence {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  verificationState: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface Contract {
  id: string;
  contractNumber: string;
  buyerName: string;
  tonnes: number;
  totalValue: number;
  status: "ACTIVE" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED";
}
