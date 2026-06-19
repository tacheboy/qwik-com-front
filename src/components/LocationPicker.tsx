import { useState } from "react";
import { useApp } from "../appContext";
import type { GeoArea } from "../types";

export function LocationPicker() {
  const { location, areas, setLocation } = useApp();
  const [open, setOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);

  function detect() {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // nearest known area for the label/pincode, real lat/lng for the fetch
        const near = nearest(areas, pos.coords.latitude, pos.coords.longitude);
        setLocation({
          label: "My location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          pincode: near?.pincode ?? "560034",
          city: near?.city ?? "Bengaluru",
        });
        setDetecting(false);
        setOpen(false);
      },
      () => setDetecting(false),
      { timeout: 8000 },
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-slate-600 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-slate-50"
      >
        <span>📍</span>
        <div className="leading-tight text-left">
          <div className="text-[10px] text-slate-400">Deliver to</div>
          <div className="font-medium max-w-[120px] truncate">
            {location.label} · {location.pincode || location.city}
          </div>
        </div>
        <span className="text-slate-300">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-40 p-2 animate-pop">
            <button
              onClick={detect}
              className="w-full text-left text-sm font-medium text-brand-700 px-3 py-2 rounded-lg hover:bg-brand-50"
            >
              {detecting ? "Detecting…" : "📡 Use my current location"}
            </button>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 px-3 pt-2 pb-1">
              Bengaluru areas
            </div>
            <div className="max-h-64 overflow-y-auto scroll-thin">
              {areas.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    setLocation(a);
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-slate-50 ${
                    a.label === location.label ? "text-brand-700 font-semibold" : "text-slate-600"
                  }`}
                >
                  {a.label} <span className="text-slate-400 text-xs">· {a.pincode}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function nearest(areas: GeoArea[], lat: number, lng: number): GeoArea | null {
  let best: GeoArea | null = null;
  let bestD = Infinity;
  for (const a of areas) {
    const d = (a.lat - lat) ** 2 + (a.lng - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return best;
}
