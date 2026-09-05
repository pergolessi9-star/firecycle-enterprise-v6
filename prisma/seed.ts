import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  console.log("Seeding FIRECYCLE AI...");

  // Clear existing data
  await prisma.circularUse.deleteMany();
  await prisma.grazingParcel.deleteMany();
  await prisma.negotiation.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.resourceLot.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.circularUse.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.maintenancePlan.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.economicAnalysis.deleteMany();
  await prisma.operationOrder.deleteMany();
  await prisma.mrvRecord.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.firewatchAlert.deleteMany();
  await prisma.satelliteObservation.deleteMany();
  await prisma.satelliteImage.deleteMany();
  await prisma.satelliteConstellation.deleteMany();
  await prisma.infrastructure.deleteMany();
  await prisma.hydrology.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.vegetationData.deleteMany();
  await prisma.forestStand.deleteMany();
  await prisma.biomassResource.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.territorialImpact.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.copilotContext.deleteMany();
  await prisma.user.deleteMany();
  await prisma.territory.deleteMany();

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const managerPassword = process.env.SEED_MANAGER_PASSWORD;
  if (!adminPassword || !managerPassword || adminPassword.length < 12 || managerPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD and SEED_MANAGER_PASSWORD must contain at least 12 characters");
  }

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@firecycle.ai",
      name: "Administrator",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@firecycle.ai",
      name: "Territory Manager",
      passwordHash: await bcrypt.hash(managerPassword, 12),
      role: "MANAGER",
    },
  });

  // Create territories
  const pinofranqueado = await prisma.territory.create({
    data: {
      name: "Pinofranqueado",
      region: "Extremadura",
      province: "Cáceres",
      adminLevel: "municipality",
      latitude: 40.3833,
      longitude: -5.5,
      areaHectares: 7500,
      users: {
        connect: [{ id: admin.id }, { id: manager.id }],
      },
    },
  });

  const lasHurdes = await prisma.territory.create({
    data: {
      name: "Las Hurdes",
      region: "Extremadura",
      province: "Cáceres",
      adminLevel: "district",
      latitude: 40.25,
      longitude: -5.3,
      areaHectares: 45000,
      users: {
        connect: [{ id: admin.id }],
      },
    },
  });

  const caceres = await prisma.territory.create({
    data: {
      name: "Cáceres",
      region: "Extremadura",
      province: "Cáceres",
      adminLevel: "province",
      latitude: 39.47,
      longitude: -6.37,
      areaHectares: 500000,
      users: {
        connect: [{ id: admin.id }],
      },
    },
  });

  // Create satellite constellation
  const sentinel2 = await prisma.satelliteConstellation.create({
    data: {
      name: "Sentinel-2",
      provider: "ESA",
      resolutionMeters: 10,
      revisitDays: 5,
      operationalSince: new Date("2015-06-23"),
    },
  });

  // Create parcels for Pinofranqueado
  const parcel1 = await prisma.parcel.create({
    data: {
      territoryId: pinofranqueado.id,
      name: "Parcela Norte - Pinofranqueado",
      areaHectares: 120,
      ownershipType: "public",
      managementUnit: "Gestión Forestal Sostenible",
      latitude: 40.39,
      longitude: -5.51,
      elevation: 650,
      slope: 15,
      aspect: "N",
      soilType: "Cambisol",
      accessibility: 0.85,
    },
  });

  const parcel2 = await prisma.parcel.create({
    data: {
      territoryId: pinofranqueado.id,
      name: "Parcela Central - Pinofranqueado",
      areaHectares: 85,
      ownershipType: "private",
      managementUnit: "Propietario privado",
      latitude: 40.38,
      longitude: -5.5,
      elevation: 700,
      slope: 20,
      aspect: "S",
      soilType: "Leptosol",
      accessibility: 0.6,
    },
  });

  // Create vegetation data
  await prisma.vegetationData.create({
    data: {
      parcelId: parcel1.id,
      vegetationType: "forest",
      ndvi: 0.65,
      lai: 3.2,
      biomass: 185.5,
      crown_cover: 75,
      groundCover: 30,
      fuelModel: 10,
      lastObservation: new Date(),
    },
  });

  await prisma.vegetationData.create({
    data: {
      parcelId: parcel2.id,
      vegetationType: "shrubland",
      ndvi: 0.52,
      lai: 2.1,
      biomass: 95.3,
      crown_cover: 60,
      groundCover: 45,
      fuelModel: 5,
      lastObservation: new Date(),
    },
  });

  // Create forest stands
  await prisma.forestStand.create({
    data: {
      parcelId: parcel1.id,
      name: "Rodal 1A - Pino Resinero",
      standAge: 35,
      primarySpecies: "Pinus pinaster",
      speciesComposition: JSON.stringify([
        { species: "Pinus pinaster", percentage: 80 },
        { species: "Quercus pyrenaica", percentage: 20 },
      ]),
      density: 450,
      dbh: 28,
      height: 22,
      fuelLoad: 25.5,
      lastInventoryDate: new Date("2024-06-15"),
    },
  });

  // Create risk assessment
  const risk1 = await prisma.riskAssessment.create({
    data: {
      parcelId: parcel1.id,
      territoryId: pinofranqueado.id,
      hazard: 0.72,
      exposure: 0.45,
      vulnerability: 0.58,
      ignitionProbability: 0.35,
      propagationPotential: 0.68,
      severity: 0.65,
      wildcardRiskScore: 0.62,
      riskLevel: "HIGH",
      priorityRank: 2,
      assessedAt: new Date(),
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  // Create satellite image
  const satImage = await prisma.satelliteImage.create({
    data: {
      constellationId: sentinel2.id,
      territoryId: pinofranqueado.id,
      acquisitionTime: new Date("2024-08-15"),
      cloudCover: 5,
      resolution: 10,
      bands: JSON.stringify([
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B11",
        "B12",
      ]),
      url: "https://example.com/sentinel2/s2a_2024_08_15.tif",
      storageLocation: "s3://firecycle-data/sentinel2/pinofranqueado/",
      processedAt: new Date(),
    },
  });

  // Create satellite observations (hotspots)
  await prisma.satelliteObservation.create({
    data: {
      constellationId: sentinel2.id,
      observationType: "hotspot",
      latitude: 40.39,
      longitude: -5.51,
      confidence: 0.82,
      value: 45.3, // temperature anomaly
      acquisitionTime: new Date("2024-08-15"),
      sourceReference: "Sentinel-2 hotspot detection",
    },
  });

  // Create FIREWATCH alert
  const alert1 = await prisma.firewatchAlert.create({
    data: {
      territoryId: pinofranqueado.id,
      latitude: 40.39,
      longitude: -5.51,
      severity: "HIGH",
      confidence: 0.85,
      ignitionProbability: 0.48,
      affectedHectares: 150,
      status: "ACTIVE",
      detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      hotspotCount: 3,
      correlatedSatelliteImages: JSON.stringify([satImage.id]),
      notes: "Múltiples puntos calientes detectados en zona de riesgo alto",
    },
  });

  // Create intervention
  const intervention1 = await prisma.intervention.create({
    data: {
      territoryId: pinofranqueado.id,
      name: "Desbroce mecánico - Parcela Norte",
      description:
        "Desbroce y aclarado de la zona norte de Pinofranqueado para reducir carga de combustible",
      type: "mechanical_clearing",
      priority: 1,
      status: "PLANNED",
      hectares: 120,
      estimatedCost: 18000,
      expectedRiskReduction: 35,
      biomassPotential: 250,
      carbonImpact: 125,
      latitude: 40.39,
      longitude: -5.51,
    },
  });

  // Create biomass resource
  const biomass1 = await prisma.biomassResource.create({
    data: {
      parcelId: parcel1.id,
      territoryId: pinofranqueado.id,
      resourceType: "residues",
      availableTonnes: 220,
      humidity: 45,
      quality: "standard",
      accessibility: 0.85,
      extractionCost: 25,
      marketValue: 55,
      estimatedRevenue: 12100,
      assessmentDate: new Date(),
    },
  });

  // Create resource lot
  const lot1 = await prisma.resourceLot.create({
    data: {
      resourceId: biomass1.id,
      lotNumber: "LOT-2024-001",
      tonnes: 50,
      quality: "standard",
      status: "PUBLISHED",
    },
  });

  // Create marketplace listing
  const listing1 = await prisma.marketplaceListing.create({
    data: {
      lotId: lot1.id,
      title: "Biomasa residual - Pinofranqueado (50 tm)",
      description:
        "Residuos de desbroce mecánico, humedad 45%, acceso directo",
      askingPrice: 2750,
      status: "PUBLISHED",
    },
  });

  // Create an offer
  await prisma.offer.create({
    data: {
      listingId: listing1.id,
      buyerName: "Bioenergía Extremadura S.L.",
      buyerEmail: "compras@bioenergia-ext.es",
      proposedPrice: 2500,
      quantity: 50,
      status: "PENDING",
    },
  });

  // Create grazing parcel
  await prisma.grazingParcel.create({
    data: {
      parcelId: parcel2.id,
      vegetationType: "shrubland",
      fuelLoad: 95.3,
      goatCount: 120,
      sheepCount: 45,
      stockingDensity: 1.95,
      dailyConsumption: 2.5,
      grazingDuration: 180,
      hectaresTreated: 85,
      fuelReduction: 38.2,
      preventiveService: true,
      serviceCost: 8500,
      avoidedMechanicalCost: 12750,
      fireRiskReduction: 40,
    },
  });

  // Create circular uses
  await prisma.circularUse.create({
    data: {
      resourceId: biomass1.id,
      destination: "energy",
      tonnes: 220,
      revenue: 12100,
      processingCost: 1320,
      transportCost: 1100,
      margin: 9680,
      carbonImpact: -55,
      employment: 2,
      recommendation: true,
    },
  });

  await prisma.circularUse.create({
    data: {
      resourceId: biomass1.id,
      destination: "pellets",
      tonnes: 198,
      revenue: 14850,
      processingCost: 2970,
      transportCost: 990,
      margin: 10890,
      carbonImpact: -50,
      employment: 3,
      recommendation: false,
    },
  });

  // Create territorial impact
  await prisma.territorialImpact.create({
    data: {
      territoryId: pinofranqueado.id,
      employment: 12,
      income: 185000,
      carbonSequestered: 850,
      biodiversityScore: 0.72,
      socialAcceptance: 0.85,
      environmentalBenefit: 0.78,
    },
  });

  // Create assets for maintenance tracking
  const asset1 = await prisma.asset.create({
    data: {
      name: "Excavadora CAT 320",
      assetType: "equipment",
      status: "OPERATIONAL",
      condition: 0.85,
      lastMaintenanceDate: new Date("2024-07-15"),
      nextMaintenanceDate: new Date("2024-10-15"),
    },
  });

  await prisma.maintenancePlan.create({
    data: {
      assetId: asset1.id,
      frequency: "quarterly",
      lastInspectionDate: new Date("2024-07-15"),
      nextScheduledDate: new Date("2024-10-15"),
    },
  });

  // Create contract
  await prisma.contract.create({
    data: {
      territoryId: pinofranqueado.id,
      contractNumber: "CNT-2024-001",
      buyerName: "Bioenergía Extremadura S.L.",
      buyerEmail: "ventas@bioenergia-ext.es",
      resource: "Biomasa residual - desbroce",
      tonnes: 100,
      unitPrice: 55,
      totalValue: 5500,
      deliveryLocation: "Polígono Industrial La Albuera, Cáceres",
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
