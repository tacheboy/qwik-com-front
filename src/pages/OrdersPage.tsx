import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Order } from "../types";
import { rupee, STATUS_LABEL } from "../lib";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400">Loading…</div>;

  if (orders.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl">📦</div>
        <p className="mt-3 font-medium text-slate-600">No orders yet.</p>
        <Link to="/" className="inline-block mt-4 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold">
          Start shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      <h1 className="font-bold text-xl mb-4">Your orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link
            key={o.id}
            to={`/orders/${o.id}`}
            className="block bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">#{o.id}</div>
                <div className="text-xs text-slate-400">
                  {new Date(o.createdAt).toLocaleString("en-IN")} ·{" "}
                  {o.subOrders.length} {o.subOrders.length > 1 ? "deliveries" : "delivery"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{rupee(o.grandTotal)}</div>
                {o.totalSavings > 0 && (
                  <div className="text-xs text-brand-600 font-medium">saved {rupee(o.totalSavings)}</div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {o.subOrders.map((s) => (
                <span
                  key={s.trackingId}
                  className="text-[11px] font-medium px-2 py-1 rounded-full"
                  style={{ background: `${s.color}1a`, color: s.color }}
                >
                  {s.logo} {s.platformName} · {STATUS_LABEL[s.status]}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
