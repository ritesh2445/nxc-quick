import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory persistent inventory state
let inventoryData = {
  metalBlanks: [
    {
      id: "mb-pitch-black",
      finish: "pitch_black",
      label: "Pitch Black PVD",
      grade: "SUS304 Surgical Grade Stainless Steel",
      thickness: "0.80 mm",
      weight: "24.5 g",
      inStock: 142,
      reserved: 18,
      threshold: 30,
      unitCostINR: 420,
      supplierBatch: "LOT-2026-PB-09",
      lastRestocked: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    },
    {
      id: "mb-silver",
      finish: "silver",
      label: "Silver Chromium",
      grade: "SUS304 Hand-Brushed Surgical Steel",
      thickness: "0.80 mm",
      weight: "24.2 g",
      inStock: 98,
      reserved: 12,
      threshold: 25,
      unitCostINR: 380,
      supplierBatch: "LOT-2026-SL-11",
      lastRestocked: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    },
    {
      id: "mb-gold",
      finish: "gold",
      label: "24K Champagne Gold",
      grade: "PVD Vapor Gold Coated Brass-Alloy",
      thickness: "0.82 mm",
      weight: "26.1 g",
      inStock: 64,
      reserved: 9,
      threshold: 20,
      unitCostINR: 650,
      supplierBatch: "LOT-2026-GD-04",
      lastRestocked: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
    {
      id: "mb-royal-red",
      finish: "royal_red",
      label: "Royal Crimson Red",
      grade: "Anodized Aerospace Aluminum-Steel Infill",
      thickness: "0.80 mm",
      weight: "23.8 g",
      inStock: 41,
      reserved: 7,
      threshold: 20,
      unitCostINR: 580,
      supplierBatch: "LOT-2026-RR-02",
      lastRestocked: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    },
    {
      id: "mb-cobalt-blue",
      finish: "cobalt_blue",
      label: "Cobalt Blue Sapphire",
      grade: "Vacuum Ionization Sapphire Coated SUS304",
      thickness: "0.80 mm",
      weight: "24.4 g",
      inStock: 53,
      reserved: 5,
      threshold: 20,
      unitCostINR: 590,
      supplierBatch: "LOT-2026-CB-03",
      lastRestocked: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    },
  ],
  nfcComponents: [
    {
      id: "nfc-ntag216",
      name: "NTAG216 Microchip Reel",
      spec: "13.56 MHz High-Coercivity / 888 Bytes EEPROM",
      inStock: 420,
      reserved: 51,
      threshold: 100,
      unit: "chips",
      status: "optimal",
    },
    {
      id: "nfc-ferrite-shield",
      name: "Anti-Metal Ferrite Attenuation Sheets",
      spec: "0.15mm Sintered Ferrite for RF Isolation on Metal",
      inStock: 390,
      reserved: 51,
      threshold: 80,
      unit: "sheets",
      status: "optimal",
    },
  ],
  packaging: [
    {
      id: "pack-obsidian-box",
      name: "Obsidian Black Magnetic Gift Box",
      spec: "Matte soft-touch exterior with Gold Foil Stamp",
      inStock: 210,
      reserved: 24,
      threshold: 50,
      unit: "boxes",
      status: "optimal",
    },
    {
      id: "pack-velvet-sleeve",
      name: "Atelier Velvet Travel Sleeve",
      spec: "Midnight black velvet with embossed NXC monogram",
      inStock: 165,
      reserved: 16,
      threshold: 40,
      unit: "sleeves",
      status: "optimal",
    },
  ],
  workshopHardware: {
    laserSourceHours: 1240.5,
    laserPowerOutput: "49.8W / 50W (99.6% calibrated)",
    lensCondition: "Optimal - Cleaned 3h ago",
    cncBitsRemaining: 18,
    lastMaintenance: "2026-09-18",
  },
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: inventoryData,
      totalBlanksInStock: inventoryData.metalBlanks.reduce((sum, b) => sum + b.inStock, 0),
      totalBlanksReserved: inventoryData.metalBlanks.reduce((sum, b) => sum + b.reserved, 0),
      lowStockAlerts: inventoryData.metalBlanks.filter((b) => b.inStock <= b.threshold),
    });
  } catch (err) {
    console.error("Admin inventory GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, id, delta, inStock, threshold } = body;

    if (!category || !id) {
      return NextResponse.json({ error: "Category and item ID required" }, { status: 400 });
    }

    if (category === "metalBlanks") {
      const item = inventoryData.metalBlanks.find((b) => b.id === id);
      if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

      if (typeof delta === "number") item.inStock = Math.max(0, item.inStock + delta);
      if (typeof inStock === "number") item.inStock = Math.max(0, inStock);
      if (typeof threshold === "number") item.threshold = threshold;
      item.lastRestocked = new Date().toISOString();

      return NextResponse.json({ success: true, item });
    }

    if (category === "nfcComponents") {
      const item = inventoryData.nfcComponents.find((c) => c.id === id);
      if (!item) return NextResponse.json({ error: "Component not found" }, { status: 404 });

      if (typeof delta === "number") item.inStock = Math.max(0, item.inStock + delta);
      if (typeof inStock === "number") item.inStock = Math.max(0, inStock);
      if (typeof threshold === "number") item.threshold = threshold;

      return NextResponse.json({ success: true, item });
    }

    if (category === "packaging") {
      const item = inventoryData.packaging.find((p) => p.id === id);
      if (!item) return NextResponse.json({ error: "Packaging not found" }, { status: 404 });

      if (typeof delta === "number") item.inStock = Math.max(0, item.inStock + delta);
      if (typeof inStock === "number") item.inStock = Math.max(0, inStock);
      if (typeof threshold === "number") item.threshold = threshold;

      return NextResponse.json({ success: true, item });
    }

    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  } catch (err) {
    console.error("Admin inventory PATCH error:", err);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
