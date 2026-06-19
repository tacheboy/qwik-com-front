import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { useApp } from "../appContext";
import type { Category, LiveProductsResponse, Platform, ProductCard } from "../types";
import { ProductCardView } from "../components/ProductCard";
import { Freshness } from "../components/Freshness";

const POPULAR = ["milk", "bread", "eggs", "atta", "banana", "curd", "chips", "oil", "rice", "maggi"];

export function HomePage() {
  const { mode, location, ready } = useApp();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const platformMap = useMemo(
    () => Object.fromEntries(platforms.map((p) => [p.id, p])),
    [platforms],
  );

  useEffect(() => {
    api.platforms().then(setPlatforms);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <Hero platforms={platforms} live={mode === "live"} />
      {ready && (mode === "live" ? <LiveBrowser platformMap={platformMap} key={location.label + location.lat} /> : <MockBrowser />)}
    </div>
  );
}

// ---------------- LIVE MODE: search-driven real prices ----------------
function LiveBrowser({ platformMap }: { platformMap: Record<string, Platform> }) {
  const { location } = useApp();
  const [q, setQ] = useState("milk");
  const [data, setData] = useState<LiveProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!q.trim()) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(false);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      api
        .liveProducts(q.trim(), location)
        .then((r) => {
          setData(r);
          setLoading(false);
        })
        .catch(() => {
          setErr(true);
          setLoading(false);
        });
    }, 350);
    return () => clearTimeout(debounce.current);
  }, [q, location]);

  const blocked = data && data.items.length === 0 && data.platforms.every((p) => !p.ok);

  return (
    <>
      <SearchBar q={q} setQ={setQ} live />
      <div className="flex gap-2 overflow-x-auto scroll-thin pt-3 pb-1">
        {POPULAR.map((p) => (
          <button
            key={p}
            onClick={() => setQ(p)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border capitalize ${
              q === p ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {data && (
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2">
          <Freshness
            ageSeconds={data.freshness.ageSeconds}
            liveCount={data.freshness.liveCount}
            usingProxy={data.freshness.usingProxy}
            stale={data.freshness.stale}
          />
          <div className="flex gap-1 flex-wrap">
            {data.platforms.map((p) => (
              <span
                key={p.platformId}
                title={`${p.platformId}: ${p.status} (${p.count})`}
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  p.ok ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                {platformMap[p.platformId]?.logo} {platformMap[p.platformId]?.name?.split(" ")[0] ?? p.platformId}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 mb-3">
        <h2 className="font-bold text-slate-700 capitalize">{q ? `"${q}"` : "Search for groceries"}</h2>
        {data && <span className="text-xs text-slate-400">{data.items.length} matched products</span>}
      </div>

      {err ? (
        <Notice tone="red" title="Couldn't reach the API" body="Is the backend running on :4000?" />
      ) : loading && !data ? (
        <Grid skeleton />
      ) : blocked ? (
        <Notice
          tone="amber"
          title="No live prices for this search yet"
          body="On the free (no-proxy) tier the platforms often block direct requests. Run the Python ingester (ingest/ingest.py) from an Indian IP, or set PROXY_URL, then npm run ingest:apply. The app keeps last-known prices when a refetch is blocked."
        />
      ) : data && data.items.length > 0 ? (
        <Grid>
          {data.items.map((p) => (
            <ProductCardView key={p.id} product={p} platformMap={platformMap} />
          ))}
        </Grid>
      ) : (
        <Notice tone="slate" title="No matches" body="Try another search term." />
      )}
    </>
  );
}

// ---------------- MOCK MODE: catalog browse (demo data) ----------------
function MockBrowser() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<ProductCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    api.categories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      api.products({ q, category: activeCat, limit: 40 }).then((r) => {
        setItems(r.items);
        setTotal(r.total);
        setLoading(false);
      });
    }, 180);
    return () => clearTimeout(debounce.current);
  }, [q, activeCat]);

  return (
    <>
      <SearchBar q={q} setQ={setQ} />
      <div className="flex gap-2 overflow-x-auto scroll-thin pt-3 pb-1">
        <Chip active={!activeCat} onClick={() => setActiveCat(undefined)} label="All" emoji="🛒" />
        {categories.map((c) => (
          <Chip
            key={c.name}
            active={activeCat === c.name}
            onClick={() => setActiveCat(activeCat === c.name ? undefined : c.name)}
            label={c.name}
            emoji={c.image}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 mb-3">
        <h2 className="font-bold text-slate-700">{activeCat ?? (q ? `Results for "${q}"` : "Popular near you")}</h2>
        <span className="text-xs text-slate-400">{total} products</span>
      </div>

      {loading && items.length === 0 ? (
        <Grid skeleton />
      ) : items.length === 0 ? (
        <Notice tone="slate" title="No products found" body="Try another search." />
      ) : (
        <Grid>
          {items.map((p) => (
            <ProductCardView key={p.id} product={p} />
          ))}
        </Grid>
      )}
    </>
  );
}

// ---------------- shared bits ----------------
function SearchBar({ q, setQ, live }: { q: string; setQ: (v: string) => void; live?: boolean }) {
  return (
    <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-[#f7f8fa]/90 backdrop-blur">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={live ? "Search real prices — milk, atta, eggs…" : 'Search "milk", "atta", "chips"…'}
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>
    </div>
  );
}

function Grid({ children, skeleton }: { children?: React.ReactNode; skeleton?: boolean }) {
  if (skeleton)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 h-64 animate-pulse" />
        ))}
      </div>
    );
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{children}</div>;
}

function Notice({ tone, title, body }: { tone: "amber" | "red" | "slate"; title: string; body: string }) {
  const c =
    tone === "amber"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : tone === "red"
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-white border-slate-200 text-slate-500";
  return (
    <div className={`border rounded-2xl p-5 text-center ${c}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-sm mt-1 opacity-90 max-w-xl mx-auto">{body}</div>
    </div>
  );
}

function Hero({ platforms, live }: { platforms: Platform[]; live?: boolean }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white p-5 sm:p-7 mb-4 overflow-hidden relative">
      <div className="relative z-10 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
          One cart. The cheapest way to actually buy it.
        </h1>
        <p className="text-brand-50/90 mt-2 text-sm sm:text-base">
          {live
            ? "Real prices, pulled live from every quick-commerce app for your exact location. We match the same product across apps and split your cart for the lowest total."
            : "Add everything you need. We compare prices, fees & delivery across every quick-commerce app and split your cart so you pay the least — then place the orders for you."}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {platforms.map((p) => (
            <span key={p.id} className="bg-white/15 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>{p.logo}</span>
              {p.name}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 text-[120px] opacity-20 select-none">🛒</div>
    </div>
  );
}

function Chip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
      }`}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}
