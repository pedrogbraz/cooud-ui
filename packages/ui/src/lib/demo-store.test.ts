import { describe, expect, it } from "vitest";
import {
  BRAND,
  CART,
  ORDERS,
  PRODUCTS,
  productById,
  RATING_DISTRIBUTION,
  RATING_SUMMARY,
  REVIEWS,
  USER,
} from "./demo-store.js";

describe("demo-store dataset invariants", () => {
  it("has a non-empty brand default", () => {
    expect(typeof BRAND).toBe("string");
    expect(BRAND.length).toBeGreaterThan(0);
  });

  it("ships ~12 products with unique stable ids", () => {
    expect(PRODUCTS.length).toBe(12);
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every product carries the fields blocks read", () => {
    for (const p of PRODUCTS) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.price).toMatch(/^\$[\d,]+\.\d{2}$/);
      expect(p.priceValue).toBeGreaterThan(0);
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.reviews).toBeGreaterThanOrEqual(0);
      expect(p.category.length).toBeGreaterThan(0);
      expect(p.initials.length).toBeGreaterThan(0);
      expect(p.gradient).toContain("from-");
    }
  });

  it("productById resolves a known id and rejects an unknown one", () => {
    expect(productById("aurora")?.name).toBe("Aurora Wireless Headphones");
    expect(productById("nope")).toBeUndefined();
  });

  it("keeps the canonical Aurora headphone at $349", () => {
    const aurora = productById("aurora");
    expect(aurora?.price).toBe("$349.00");
    expect(aurora?.priceValue).toBe(349);
  });

  it("every cart line references an existing product", () => {
    for (const line of CART) {
      expect(productById(line.productId), `cart line ${line.productId}`).toBeDefined();
      expect(line.qty).toBeGreaterThan(0);
    }
  });

  it("ships the five demo orders with unique ids", () => {
    expect(ORDERS.length).toBe(5);
    const ids = ORDERS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("#CD-58291");
  });

  it("every order item references an existing product", () => {
    for (const order of ORDERS) {
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalValue).toBeGreaterThan(0);
      for (const line of order.items) {
        expect(
          productById(line.productId),
          `order ${order.id} item ${line.productId}`,
        ).toBeDefined();
        expect(line.qty).toBeGreaterThan(0);
      }
    }
  });

  it("the rating distribution sums to 100%", () => {
    const total = RATING_DISTRIBUTION.reduce((sum, bar) => sum + bar.percent, 0);
    expect(total).toBe(100);
    expect(RATING_DISTRIBUTION.map((b) => b.stars)).toEqual(["5", "4", "3", "2", "1"]);
  });

  it("the rating summary is coherent (average in range, count matches string)", () => {
    expect(RATING_SUMMARY.averageValue).toBeGreaterThanOrEqual(0);
    expect(RATING_SUMMARY.averageValue).toBeLessThanOrEqual(5);
    expect(RATING_SUMMARY.average).toBe(String(RATING_SUMMARY.averageValue));
    expect(RATING_SUMMARY.countValue).toBe(1284);
    expect(RATING_SUMMARY.count).toBe("1,284");
  });

  it("ships six reviews with unique ids and valid ratings", () => {
    expect(REVIEWS.length).toBe(6);
    const ids = REVIEWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of REVIEWS) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
      expect(r.name.length).toBeGreaterThan(0);
      expect(r.body.length).toBeGreaterThan(0);
    }
  });

  it("exposes a demo user", () => {
    expect(USER.name.length).toBeGreaterThan(0);
    expect(USER.email).toContain("@");
  });
});
