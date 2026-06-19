export function ageLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

export function Freshness({
  ageSeconds,
  liveCount,
  usingProxy,
  stale,
  minConfidence,
}: {
  ageSeconds: number;
  liveCount: number;
  usingProxy: boolean;
  stale?: boolean;
  minConfidence?: number;
}) {
  const fresh = !stale && ageSeconds < 300 && liveCount > 0;
  const dot = stale ? "🟠" : liveCount === 0 ? "⚪" : fresh ? "🟢" : "🟡";
  return (
    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500">
      <span className="font-medium">
        {dot}{" "}
        {liveCount === 0
          ? "No live feed"
          : stale
            ? "Last known prices"
            : `Live from ${liveCount} app${liveCount > 1 ? "s" : ""}`}
      </span>
      <span className="text-slate-300">·</span>
      <span>updated {ageLabel(ageSeconds)}</span>
      {minConfidence != null && (
        <>
          <span className="text-slate-300">·</span>
          <span title="How confident we are these are the same product across apps">
            match {Math.round(minConfidence * 100)}%
          </span>
        </>
      )}
      {!usingProxy && (
        <span className="text-amber-600" title="No proxy configured — some apps may rate-limit/block">
          · no-proxy
        </span>
      )}
    </div>
  );
}
