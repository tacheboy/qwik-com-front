import type {
  Category,
  GeoArea,
  LiveOptimizeResponse,
  LiveProductsResponse,
  Order,
  OptimizationResult,
  Platform,
  ProductCard,
} from "./types";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

export interface SearchResponse {
  total: number;
  items: ProductCard[];
  limit: number;
  offset: number;
}

export const api = {
  health: () =>
    get<{ status: string; dataMode: string; usingProxy: boolean }>("/api/health"),
  areas: () => get<{ city: string; areas: GeoArea[]; default: GeoArea }>("/api/location/areas"),
  liveProducts: (q: string, loc: GeoArea) => {
    const qs = new URLSearchParams({
      q,
      lat: String(loc.lat),
      lng: String(loc.lng),
      pincode: loc.pincode,
    });
    return get<LiveProductsResponse>(`/api/live/products?${qs.toString()}`);
  },
  liveOptimize: (
    items: { productId: string; name: string; quantity: number }[],
    loc: GeoArea,
  ) =>
    post<LiveOptimizeResponse>("/api/live/optimize", {
      items,
      lat: loc.lat,
      lng: loc.lng,
      pincode: loc.pincode,
    }),
  liveOrder: (
    items: { productId: string; name: string; quantity: number }[],
    strategy: "split" | "single",
    loc: GeoArea,
  ) =>
    post<{ order: Order; savings: number }>("/api/live/orders", {
      items,
      strategy,
      lat: loc.lat,
      lng: loc.lng,
      pincode: loc.pincode,
    }),
  platforms: () => get<{ platforms: Platform[] }>("/api/platforms").then((r) => r.platforms),
  categories: () => get<{ categories: Category[] }>("/api/categories").then((r) => r.categories),
  products: (params: { q?: string; category?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    return get<SearchResponse>(`/api/products?${qs.toString()}`);
  },
  optimize: (items: { productId: string; quantity: number }[]) =>
    post<OptimizationResult>("/api/optimize", { items }),
  placeOrder: (items: { productId: string; quantity: number }[], strategy: "split" | "single") =>
    post<{ order: Order; savings: number }>("/api/orders", { items, strategy }),
  orders: () => get<{ orders: Order[] }>("/api/orders").then((r) => r.orders),
  order: (id: string) => get<{ order: Order }>(`/api/orders/${id}`).then((r) => r.order),
};
