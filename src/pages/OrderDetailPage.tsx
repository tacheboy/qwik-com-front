import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import type { Order } from "../types";
import { rupee, STATUS_LABEL, STATUS_STEPS } from "../lib";

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    const tick = () => api.order(id).then((o) => alive && setOrder(o)).catch(() => {});
    tick();
    const t = setInterval(tick, 3000); // live status polling
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  if (!order)
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400">Loading order…</div>;

  const allDelivered = order.subOrders.every((s) => s.status === "delivered");

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      <Link to="/orders" className="text-sm text-slate-400 hover:text-brand-600">
        ← All orders
      </Link>

      <div className="mt-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white p-5">
        <div className="text-sm text-brand-50/80">Order #{order.id}</div>
        <div className="text-2xl font-extrabold mt-1">
          {allDelivered ? "🎉 All delivered!" : "We're placing your orders"}
        </div>
        <div className="text-sm text-brand-50/90 mt-1">
          Paid {rupee(order.grandTotal)} across {order.subOrders.length} app
          {order.subOrders.length > 1 ? "s" : ""}
          {order.totalSavings > 0 && <> · you saved {rupee(order.totalSavings)}</>}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {order.subOrders.map((s) => {
          const stepIdx = STATUS_STEPS.indexOf(s.status);
          return (
            <div key={s.trackingId} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.logo}</span>
                <span className="font-bold" style={{ color: s.color }}>
                  {s.platformName}
                </span>
                <span className="text-xs text-slate-400">· {s.trackingId}</span>
                <div className="flex-1" />
                <span className="font-bold">{rupee(s.basketTotal)}</span>
              </div>

              {/* progress tracker */}
              <div className="mt-4 flex items-center">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          i <= stepIdx ? "text-white" : "bg-slate-100 text-slate-400"
                        }`}
                        style={i <= stepIdx ? { background: s.color } : undefined}
                      >
                        {i < stepIdx ? "✓" : i + 1}
                      </div>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className="h-0.5 flex-1 mx-1"
                        style={{ background: i < stepIdx ? s.color : "#e2e8f0" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium mt-2" style={{ color: s.color }}>
                {STATUS_LABEL[s.status]}
                {s.status !== "delivered" && (
                  <span className="text-slate-400 font-normal"> · ETA ~{s.etaMinutes} min</span>
                )}
              </div>

              <div className="mt-3 border-t border-slate-50 pt-2 space-y-1">
                {s.lines.map((l) => (
                  <div key={l.productId} className="flex items-center gap-2 text-sm">
                    <span>{l.image}</span>
                    <span className="flex-1 truncate text-slate-600">
                      {l.name} <span className="text-slate-300">×{l.quantity}</span>
                    </span>
                    <span className="text-slate-500">{rupee(l.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center mt-5">
        Statuses update live. In production these reflect real order events from each partner app.
      </p>
    </div>
  );
}
