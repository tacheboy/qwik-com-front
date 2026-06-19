export interface Platform {
  id: string;
  name: string;
  color: string;
  logo: string;
  platformFee: number;
  handlingFee: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  etaMinutes: number;
  rating: number;
}

export interface GeoArea {
  label: string;
  lat: number;
  lng: number;
  pincode: string;
  city: string;
}

export interface LiveOffer {
  platformId: string;
  externalId: string;
  price: number;
  mrp: number | null;
  inStock: boolean;
  etaMinutes: number | null;
  observedAt: string;
  source: string;
}

export interface PlatformFetchMeta {
  platformId: string;
  ok: boolean;
  status: string;
  count: number;
}

export interface LiveProductsResponse {
  location: GeoArea;
  query: string;
  freshness: {
    fetchedAt: string;
    ageSeconds: number;
    fromCache: boolean;
    usingProxy: boolean;
    liveCount: number;
    stale: boolean;
  };
  platforms: PlatformFetchMeta[];
  items: (ProductCard & {
    packText: string | null;
    matchConfidence: number;
    offers: LiveOffer[];
  })[];
}

export interface LiveOptimizeResponse {
  location: GeoArea;
  result: OptimizationResult;
  provenance: Record<string, { matched: boolean; confidence: number; via: string }>;
  freshness: {
    maxAgeSeconds: number;
    usingProxy: boolean;
    liveCount: number;
    stale: boolean;
    minConfidence: number;
    platforms: PlatformFetchMeta[];
  };
}

export interface ProductCard {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  unit: string;
  image: string;
  mrp: number;
  tags: string[];
  alternatives: string[];
  bestPrice: number | null;
  bestPlatform: string | null;
  displayMrp: number;
  availableOn: number;
}

export interface Category {
  name: string;
  image: string;
  count: number;
}

export interface AllocatedLine {
  productId: string;
  name: string;
  brand: string;
  unit: string;
  image: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  lineTotal: number;
  lineSavings: number;
}

export interface PlatformBasket {
  platformId: string;
  platformName: string;
  color: string;
  logo: string;
  lines: AllocatedLine[];
  itemsSubtotal: number;
  platformFee: number;
  handlingFee: number;
  deliveryFee: number;
  freeDelivery: boolean;
  surgeApplied: number;
  basketTotal: number;
  etaMinutes: number;
}

export interface OptimizationPlan {
  label: string;
  strategy: "split" | "single";
  baskets: PlatformBasket[];
  itemsSubtotal: number;
  totalFees: number;
  grandTotal: number;
  etaMinutes: number;
}

export interface UnavailableItem {
  productId: string;
  name: string;
  quantity: number;
  alternatives: { productId: string; name: string; reason: string }[];
}

export interface OptimizationResult {
  best: OptimizationPlan;
  bestSingle: OptimizationPlan | null;
  singleOptions: OptimizationPlan[];
  savingsVsMrp: number;
  savingsVsWorst: number;
  savingsVsBestSingle: number;
  headlineSavings: number;
  unavailable: UnavailableItem[];
}

export type SubOrderStatus =
  | "placing"
  | "confirmed"
  | "packing"
  | "out_for_delivery"
  | "delivered";

export interface SubOrder {
  platformId: string;
  platformName: string;
  color: string;
  logo: string;
  lines: AllocatedLine[];
  basketTotal: number;
  status: SubOrderStatus;
  etaMinutes: number;
  trackingId: string;
}

export interface Order {
  id: string;
  createdAt: string;
  strategy: "split" | "single";
  subOrders: SubOrder[];
  grandTotal: number;
  totalSavings: number;
}
