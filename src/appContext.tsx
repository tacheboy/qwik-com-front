import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";
import type { GeoArea } from "./types";

interface AppMeta {
  /** "mock" | "live" */
  mode: string;
  usingProxy: boolean;
  location: GeoArea;
  areas: GeoArea[];
  setLocation: (a: GeoArea) => void;
  ready: boolean;
}

const Ctx = createContext<AppMeta | null>(null);
const LOC_KEY = "smartcart.location.v1";

const FALLBACK: GeoArea = {
  label: "Koramangala",
  lat: 12.9352,
  lng: 77.6245,
  pincode: "560034",
  city: "Bengaluru",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState("mock");
  const [usingProxy, setUsingProxy] = useState(false);
  const [areas, setAreas] = useState<GeoArea[]>([FALLBACK]);
  const [location, setLocationState] = useState<GeoArea>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOC_KEY) ?? "null") || FALLBACK;
    } catch {
      return FALLBACK;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([api.health().catch(() => null), api.areas().catch(() => null)]).then(
      ([health, areasResp]) => {
        if (health) {
          setMode(health.dataMode ?? "mock");
          setUsingProxy(!!health.usingProxy);
        }
        if (areasResp) {
          setAreas(areasResp.areas);
          if (!localStorage.getItem(LOC_KEY)) setLocationState(areasResp.default);
        }
        setReady(true);
      },
    );
  }, []);

  const setLocation = (a: GeoArea) => {
    setLocationState(a);
    localStorage.setItem(LOC_KEY, JSON.stringify(a));
  };

  const value = useMemo<AppMeta>(
    () => ({ mode, usingProxy, location, areas, setLocation, ready }),
    [mode, usingProxy, location, areas, ready],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
