import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../store";
import { useApp } from "../appContext";
import { CartDrawer } from "./CartDrawer";
import { LocationPicker } from "./LocationPicker";
import { rupee } from "../lib";

export function Layout() {
  const { count, estTotal } = useCart();
  const { mode } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🛒</span>
            <div className="leading-tight">
              <div className="font-extrabold text-lg tracking-tight">
                Smart<span className="text-brand-600">Cart</span>
              </div>
              <div className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
                one cart · every q-comm app
              </div>
            </div>
          </Link>

          <div className="hidden sm:block">
            <LocationPicker />
          </div>

          <div className="flex-1" />

          <span
            className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
              mode === "live"
                ? "bg-brand-50 text-brand-700"
                : "bg-amber-50 text-amber-700"
            }`}
            title={
              mode === "live"
                ? "Showing real prices fetched from the platforms"
                : "Showing generated demo prices. Start the API with DATA_MODE=live for real prices."
            }
          >
            {mode === "live" ? "● LIVE prices" : "● DEMO data"}
          </span>

          <Link
            to="/orders"
            className="text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            Orders
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <span>🛍️</span>
            {count > 0 ? (
              <span>
                {count} item{count > 1 ? "s" : ""} · {rupee(estTotal)}
              </span>
            ) : (
              <span>Cart</span>
            )}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center animate-pop">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-400 flex flex-wrap gap-2 justify-between">
          <span>SmartCart — we don't sell, we optimize. Orders are placed for you on partner apps.</span>
          <span>Prices indicative · demo data</span>
        </div>
      </footer>

      <CartDrawer open={open} onClose={() => setOpen(false)} onCheckout={useGoCheckout(setOpen)} />
    </div>
  );
}

function useGoCheckout(setOpen: (v: boolean) => void) {
  const navigate = useNavigate();
  return () => {
    setOpen(false);
    navigate("/checkout");
  };
}
