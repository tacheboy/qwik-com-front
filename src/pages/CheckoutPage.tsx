import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../store";
import { useApp } from "../appContext";
import type { LiveOptimizeResponse, OptimizationPlan, OptimizationResult } from "../types";
import { rupee } from "../lib";
import { Freshness } from "../components/Freshness";

export function CheckoutPage() {
  const { lines, clear } = useCart();
  const { mode, location } = useApp();
  const live = mode === "live";
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [meta, setMeta] = useState<LiveOptimizeResponse["freshness"] | null>(null);
  const [provenance, setProvenance] = useState<LiveOptimizeResponse["provenance"]>({});
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<"split" | "single">("split");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const items = lines.map((l) => ({ productId: l.product.id, quantity: l.quantity }));
  const liveItems = lines.map((l) => ({ productId: l.product.id, name: l.product.name, quantity: l.quantity }));

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    if (live) {
      api.liveOptimize(liveItems, location).then((r) => {
        setResult(r.result);
        setMeta(r.freshness);
        setProvenance(r.provenance);
        setLoading(false);
      });
    } else {
      api.optimize(items).then((r) => {
        setResult(r);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length, live, location.lat, location.lng]);

  if (lines.length === 0) {
    return (
      <Empty />
    );
  }

  if (loading || !result) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="text-4xl animate-pulse">🧮</div>
        <p className="mt-3 font-medium">Crunching prices across 5 apps…</p>
      </div>
    );
  }

  const plan: OptimizationPlan =
    strategy === "single" && result.bestSingle ? result.bestSingle : result.best;
  const isRecommendedSplit = result.best.strategy === "split";

  async function place() {
    setPlacing(true);
    try {
      const { order } = live
        ? await api.liveOrder(liveItems, strategy, location)
        : await api.placeOrder(items, strategy);
      clear();
      navigate(`/orders/${order.id}`);
    } finally {
      setPlacing(false);
    }
  }

  const unmatched = Object.entries(provenance).filter(([, v]) => !v.matched);

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      <Link to="/" className="text-sm text-slate-400 hover:text-brand-600">
        ← Keep shopping
      </Link>

      {/* savings banner */}
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white p-5 sm:p-6">
        <div className="text-sm text-brand-50/80">SmartCart found you the best deal</div>
        <div className="text-3xl sm:text-4xl font-extrabold mt-1">
          You save {rupee(Math.max(result.headlineSavings, 0))}
        </div>
        <div className="text-sm text-brand-50/90 mt-1">
          {result.savingsVsWorst > 0 ? (
            <>vs buying everything from the priciest single app.</>
          ) : (
            <>off MRP, with the cheapest live price picked for every item.</>
          )}
          {result.savingsVsBestSingle > 0 ? (
            <> Splitting saves an extra {rupee(result.savingsVsBestSingle)} over the cheapest single store.</>
          ) : result.bestSingle === null ? (
            <> No single app stocks your whole cart — we combined the best apps for the lowest total.</>
          ) : null}
        </div>
      </div>

      {/* trust strip: where the prices came from + how fresh + match confidence */}
      {live && meta && (
        <div className="mt-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <Freshness
            ageSeconds={meta.maxAgeSeconds}
            liveCount={meta.liveCount}
            usingProxy={meta.usingProxy}
            stale={meta.stale}
            minConfidence={meta.minConfidence}
          />
          <span className="text-[11px] text-slate-400">
            Optimised on real prices at {location.label} · {location.pincode}
          </span>
        </div>
      )}

      {live && unmatched.length > 0 && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800">
          ⚠️ {unmatched.length} item(s) couldn't be matched to live prices right now and were left
          out of the optimization. They'll return once a fresh fetch succeeds.
        </div>
      )}

      {/* strategy toggle */}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <StrategyCard
          active={strategy === "split"}
          onClick={() => setStrategy("split")}
          title={isRecommendedSplit ? "Cheapest split" : "Optimized"}
          badge="Recommended"
          total={result.best.grandTotal}
          subtitle={
            result.best.strategy === "split"
              ? `Across ${result.best.baskets.length} apps · pay the least`
              : `Best single app`
          }
          eta={result.best.etaMinutes}
        />
        <StrategyCard
          active={strategy === "single"}
          onClick={() => result.bestSingle && setStrategy("single")}
          title="Single store"
          badge="One delivery"
          disabled={!result.bestSingle}
          total={result.bestSingle?.grandTotal ?? 0}
          subtitle={
            result.bestSingle
              ? `All from ${result.bestSingle.baskets[0]?.platformName}`
              : "No single app has everything"
          }
          eta={result.bestSingle?.etaMinutes ?? 0}
        />
      </div>

      {/* plan baskets */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-700">{plan.label}</h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            arrives in ~{plan.etaMinutes} min
          </span>
        </div>

        {plan.baskets.map((b) => (
          <div key={b.platformId} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div
              className="px-4 py-3 flex items-center gap-2 border-b border-slate-100"
              style={{ background: `${b.color}14` }}
            >
              <span className="text-xl">{b.logo}</span>
              <span className="font-bold" style={{ color: b.color }}>
                {b.platformName}
              </span>
              <span className="text-xs text-slate-400">· ~{b.etaMinutes} min</span>
              <div className="flex-1" />
              <span className="font-bold">{rupee(b.basketTotal)}</span>
            </div>

            <div className="divide-y divide-slate-50">
              {b.lines.map((l) => (
                <div key={l.productId} className="px-4 py-2.5 flex items-center gap-3">
                  <span className="text-2xl w-9 text-center">{l.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.name}</div>
                    <div className="text-xs text-slate-400">
                      {l.unit} · {rupee(l.unitPrice)} × {l.quantity}
                    </div>
                  </div>
                  {l.lineSavings > 0 && (
                    <span className="text-[11px] text-brand-600 font-medium">save {rupee(l.lineSavings)}</span>
                  )}
                  <span className="text-sm font-semibold w-16 text-right">{rupee(l.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 bg-slate-50/60 text-xs text-slate-500 space-y-1">
              <Row label="Items subtotal" value={rupee(b.itemsSubtotal)} />
              {b.platformFee > 0 && <Row label="Platform fee" value={rupee(b.platformFee)} />}
              <Row label="Handling fee" value={rupee(b.handlingFee)} />
              <Row
                label="Delivery"
                value={b.freeDelivery ? "FREE" : rupee(b.deliveryFee)}
                highlight={b.freeDelivery}
              />
            </div>
          </div>
        ))}
      </div>

      {/* unavailable */}
      {result.unavailable.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="font-semibold text-amber-800 text-sm mb-2">
            ⚠️ {result.unavailable.length} item(s) are out of stock everywhere
          </div>
          {result.unavailable.map((u) => (
            <div key={u.productId} className="text-sm text-amber-900/80 mb-1">
              <span className="font-medium">{u.name}</span>
              {u.alternatives.length > 0 && (
                <span className="text-xs text-amber-700">
                  {" "}
                  — try: {u.alternatives.map((a) => a.name).join(", ")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* sticky pay bar */}
      <div className="sticky bottom-0 mt-6 -mx-4 px-4 py-4 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="leading-tight">
            <div className="text-xs text-slate-400">Total payable</div>
            <div className="text-2xl font-extrabold">{rupee(plan.grandTotal)}</div>
          </div>
          <div className="text-xs text-brand-600 font-medium">
            incl. {rupee(plan.totalFees)} fees · saved {rupee(Math.max(result.headlineSavings, 0))}
          </div>
          <div className="flex-1" />
          <button
            onClick={place}
            disabled={placing}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 sm:px-10 py-3.5 rounded-xl"
          >
            {placing ? "Placing…" : `Place order · ${plan.baskets.length} ${plan.baskets.length > 1 ? "deliveries" : "delivery"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function StrategyCard({
  active,
  onClick,
  title,
  badge,
  total,
  subtitle,
  eta,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  badge: string;
  total: number;
  subtitle: string;
  eta: number;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left rounded-2xl border-2 p-4 transition-all disabled:opacity-50 ${
        active ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-brand-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{title}</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {badge}
        </span>
        <div className="flex-1" />
        <span className="text-xl font-extrabold">{disabled ? "—" : rupee(total)}</span>
      </div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      {!disabled && <div className="text-[11px] text-slate-400 mt-0.5">~{eta} min</div>}
    </button>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={highlight ? "text-brand-600 font-semibold" : "text-slate-600"}>{value}</span>
    </div>
  );
}

function Empty() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl">🛒</div>
      <p className="mt-3 font-medium text-slate-600">Your cart is empty.</p>
      <Link to="/" className="inline-block mt-4 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold">
        Start shopping
      </Link>
    </div>
  );
}
