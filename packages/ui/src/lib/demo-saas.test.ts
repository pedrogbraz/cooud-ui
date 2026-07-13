import { describe, expect, it } from "vitest";
import {
  ACTIVITY,
  BRAND,
  CURRENT_PLAN_ID,
  INVOICES,
  KPIS,
  PLANS,
  planById,
  REVENUE_SERIES,
  TEAM,
  USAGE_METERS,
  USER,
} from "./demo-saas.js";

describe("demo-saas dataset invariants", () => {
  it("has a non-empty brand default", () => {
    expect(typeof BRAND).toBe("string");
    expect(BRAND.length).toBeGreaterThan(0);
  });

  it("ships four KPIs with valid trends", () => {
    expect(KPIS.length).toBe(4);
    for (const k of KPIS) {
      expect(k.label.length).toBeGreaterThan(0);
      expect(k.value.length).toBeGreaterThan(0);
      expect(["up", "down"]).toContain(k.trend);
    }
  });

  it("the revenue series is monthly and ends at the total-revenue KPI value", () => {
    expect(REVENUE_SERIES.length).toBe(7);
    const last = REVENUE_SERIES[REVENUE_SERIES.length - 1];
    expect(last?.month).toBe("Jul");
    expect(last?.revenue).toBe(84_210);
    const revenueKpi = KPIS.find((k) => k.label === "Total revenue");
    expect(revenueKpi?.value).toBe("$84,210");
  });

  it("every activity row is well-formed with a valid status", () => {
    expect(ACTIVITY.length).toBeGreaterThan(0);
    const ids = ACTIVITY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ACTIVITY) {
      expect(a.email).toContain("@");
      expect(["Paid", "Pending", "Refunded"]).toContain(a.status);
    }
  });

  it("ships a five-person team with exactly one owner and unique ids", () => {
    expect(TEAM.length).toBe(5);
    const ids = TEAM.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(TEAM.filter((m) => m.role === "Owner").length).toBe(1);
    for (const m of TEAM) {
      expect(m.email).toContain("@");
      expect(["Owner", "Admin", "Member"]).toContain(m.role);
    }
  });

  it("the demo user is the team owner", () => {
    expect(USER.role).toBe("Owner");
    const owner = TEAM.find((m) => m.role === "Owner");
    expect(USER.email).toBe(owner?.email);
  });

  it("every invoice is well-formed", () => {
    expect(INVOICES.length).toBeGreaterThan(0);
    const ids = INVOICES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const inv of INVOICES) {
      expect(inv.amount).toMatch(/^\$[\d,]+\.\d{2}$/);
      expect(["Paid", "Pending"]).toContain(inv.status);
    }
  });

  it("usage meters are coherent (used ≤ limit, value tracks the ratio)", () => {
    expect(USAGE_METERS.length).toBe(3);
    const ids = USAGE_METERS.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const u of USAGE_METERS) {
      expect(u.used).toBeLessThanOrEqual(u.limit);
      expect(u.value).toBeGreaterThanOrEqual(0);
      expect(u.value).toBeLessThanOrEqual(100);
      // The rendered percent is within a rounding point of used/limit.
      const ratio = Math.round((u.used / u.limit) * 100);
      expect(Math.abs(u.value - ratio)).toBeLessThanOrEqual(1);
    }
  });

  it("ships three plans with a single popular one and monotonic pricing", () => {
    expect(PLANS.length).toBe(3);
    const ids = PLANS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PLANS.filter((p) => p.popular).length).toBe(1);
    for (const p of PLANS) {
      expect(p.annual).toBeLessThanOrEqual(p.monthly);
      expect(p.features.length).toBeGreaterThan(0);
    }
  });

  it("the current plan id resolves to a real plan", () => {
    expect(planById(CURRENT_PLAN_ID)).toBeDefined();
    expect(planById("nope")).toBeUndefined();
  });
});
