import type { LiveOffer, Platform, ProductCard as P } from "../types";
import { useCart } from "../store";
import { rupee } from "../lib";
import { Stepper } from "./CartDrawer";

type LiveP = P & { offers?: LiveOffer[]; matchConfidence?: number; packText?: string | null };

export function ProductCardView({
  product,
  platformMap,
}: {
  product: LiveP;
  platformMap?: Record<string, Platform>;
}) {
  const { add, setQty, qtyOf } = useCart();
  const qty = qtyOf(product.id);
  const price = product.bestPrice ?? product.mrp;
  const off =
    product.displayMrp > price ? Math.round(((product.displayMrp - price) / product.displayMrp) * 100) : 0;

  const offers = (product.offers ?? []).filter((o) => o.inStock).sort((a, b) => a.price - b.price);
  const cheapest = offers[0]?.platformId;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 flex flex-col hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="text-5xl h-24 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
          {product.image?.startsWith("http") ? (
            <img src={product.image} alt="" className="h-full w-full object-contain" />
          ) : (
            product.image
          )}
        </div>
        {off > 0 && (
          <span className="absolute top-1 left-1 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {off}% OFF
          </span>
        )}
        <span className="absolute bottom-1 right-1 bg-white/90 border border-slate-200 text-[10px] text-slate-500 px-1.5 py-0.5 rounded-full">
          {product.availableOn} apps
        </span>
      </div>

      <div className="mt-2 flex-1">
        <div className="text-[13px] font-medium leading-snug line-clamp-2 min-h-[34px]">{product.name}</div>
        <div className="text-xs text-slate-400 mt-0.5">{product.unit || product.packText}</div>
      </div>

      {/* live per-platform price comparison */}
      {offers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {offers.slice(0, 5).map((o) => {
            const p = platformMap?.[o.platformId];
            const best = o.platformId === cheapest;
            return (
              <span
                key={o.platformId}
                title={p?.name ?? o.platformId}
                className={`text-[10px] px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 ${
                  best ? "border-brand-300 bg-brand-50 text-brand-700 font-semibold" : "border-slate-200 text-slate-500"
                }`}
              >
                <span>{p?.logo ?? "•"}</span>
                {rupee(o.price)}
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="leading-tight">
          <div className="text-[10px] text-slate-400">from</div>
          <div className="font-bold">{rupee(price)}</div>
          {off > 0 && <div className="text-[11px] text-slate-400 line-through">{rupee(product.displayMrp)}</div>}
        </div>
        {qty === 0 ? (
          <button
            onClick={() => add(product)}
            className="text-brand-700 border border-brand-200 bg-brand-50 hover:bg-brand-100 font-semibold text-sm px-4 py-1.5 rounded-lg"
          >
            ADD
          </button>
        ) : (
          <Stepper qty={qty} onChange={(q) => setQty(product.id, q)} />
        )}
      </div>
    </div>
  );
}
