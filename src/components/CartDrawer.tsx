import { useCart } from "../store";
import { rupee } from "../lib";

export function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { lines, setQty, remove, estTotal, count, clear } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="font-bold text-lg">Your cart {count > 0 && `(${count})`}</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 text-slate-400 gap-2">
            <div className="text-5xl">🛒</div>
            <div className="font-medium text-slate-600">Your cart is empty</div>
            <div className="text-sm">Add items and we'll find the cheapest way to buy them.</div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scroll-thin px-3 py-2">
            {lines.map((l) => (
              <div key={l.product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg shrink-0">
                  {l.product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.product.name}</div>
                  <div className="text-xs text-slate-400">{l.product.unit}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    from {rupee(l.product.bestPrice ?? l.product.mrp)} · {l.product.availableOn} apps
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stepper qty={l.quantity} onChange={(q) => setQty(l.product.id, q)} />
                  <button
                    onClick={() => remove(l.product.id)}
                    className="text-[11px] text-slate-300 hover:text-red-500"
                  >
                    remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-slate-200 p-4 space-y-3 shrink-0">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Indicative item total</span>
              <span className="font-medium text-slate-700">{rupee(estTotal)}</span>
            </div>
            <p className="text-xs text-slate-400">
              Final price, fees & best split are computed at checkout across all 5 apps.
            </p>
            <button
              onClick={onCheckout}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              ✨ Optimize & checkout
            </button>
            <button onClick={clear} className="w-full text-xs text-slate-400 hover:text-slate-600">
              clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export function Stepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center bg-brand-50 border border-brand-100 rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(qty - 1)}
        className="w-7 h-7 text-brand-700 font-bold hover:bg-brand-100"
      >
        −
      </button>
      <span className="w-7 text-center text-sm font-semibold text-brand-700">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 text-brand-700 font-bold hover:bg-brand-100"
      >
        +
      </button>
    </div>
  );
}
