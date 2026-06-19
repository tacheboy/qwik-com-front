import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductCard } from "./types";

export interface CartLine {
  product: ProductCard;
  quantity: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  estTotal: number;
  add: (product: ProductCard) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  qtyOf: (productId: string) => number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "smartcart.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const add = (product: ProductCard) =>
      setLines((prev) => {
        const found = prev.find((l) => l.product.id === product.id);
        if (found) return prev.map((l) => (l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l));
        return [...prev, { product, quantity: 1 }];
      });
    const setQty = (productId: string, qty: number) =>
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => l.product.id !== productId)
          : prev.map((l) => (l.product.id === productId ? { ...l, quantity: qty } : l)),
      );
    const remove = (productId: string) => setLines((prev) => prev.filter((l) => l.product.id !== productId));
    const clear = () => setLines([]);
    const qtyOf = (productId: string) => lines.find((l) => l.product.id === productId)?.quantity ?? 0;
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const estTotal = lines.reduce((s, l) => s + (l.product.bestPrice ?? l.product.mrp) * l.quantity, 0);
    return { lines, count, estTotal, add, setQty, remove, clear, qtyOf };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
