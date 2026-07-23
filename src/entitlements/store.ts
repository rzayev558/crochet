import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { PLUS_ENTITLEMENT_ID, REVENUECAT_ENABLED, REVENUECAT_IOS_API_KEY } from "./config";

const DEV_PLUS_KEY = "loop.dev.plus";

export type PurchasePackage = {
  id: string;
  title: string;
  priceString: string;
  period: "monthly" | "yearly" | "other";
  // The raw RevenueCat package, present only in RevenueCat mode.
  rcPackage?: unknown;
};

export type PurchaseResult = { ok: boolean; cancelled?: boolean; error?: string };

type EntitlementsState = {
  ready: boolean;
  isPlus: boolean;
  source: "revenuecat" | "dev";
  packages: PurchasePackage[];
  purchasing: boolean;
  init: () => Promise<void>;
  purchase: (pkg?: PurchasePackage) => Promise<PurchaseResult>;
  restore: () => Promise<PurchaseResult>;
  devSetPlus: (v: boolean) => Promise<void>;
};

// Loaded lazily so Expo Go (no native module) never evaluates it.
function loadPurchases(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("react-native-purchases").default;
  } catch {
    return null;
  }
}

function mapPackage(p: any): PurchasePackage {
  const type = p?.packageType;
  return {
    id: p?.identifier ?? "pkg",
    title: p?.product?.title ?? "Loop Plus",
    priceString: p?.product?.priceString ?? "",
    period: type === "MONTHLY" ? "monthly" : type === "ANNUAL" ? "yearly" : "other",
    rcPackage: p,
  };
}

export const useEntitlements = create<EntitlementsState>()((set, get) => ({
  ready: false,
  isPlus: false,
  source: "dev",
  packages: [],
  purchasing: false,

  init: async () => {
    if (REVENUECAT_ENABLED) {
      const Purchases = loadPurchases();
      if (Purchases) {
        try {
          Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
          const info = await Purchases.getCustomerInfo();
          const offerings = await Purchases.getOfferings();
          const pkgs = (offerings?.current?.availablePackages ?? []).map(mapPackage);
          Purchases.addCustomerInfoUpdateListener((ci: any) => {
            set({ isPlus: !!ci?.entitlements?.active?.[PLUS_ENTITLEMENT_ID] });
          });
          set({
            ready: true,
            source: "revenuecat",
            isPlus: !!info?.entitlements?.active?.[PLUS_ENTITLEMENT_ID],
            packages: pkgs,
          });
          return;
        } catch {
          // Fall through to dev mode if RevenueCat init fails.
        }
      }
    }

    const stored = await AsyncStorage.getItem(DEV_PLUS_KEY);
    set({ ready: true, source: "dev", isPlus: stored === "1", packages: [] });
  },

  purchase: async (pkg) => {
    const { source } = get();

    if (source === "revenuecat" && pkg?.rcPackage) {
      const Purchases = loadPurchases();
      if (!Purchases) return { ok: false, error: "Purchases unavailable" };
      set({ purchasing: true });
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg.rcPackage);
        const isPlus = !!customerInfo?.entitlements?.active?.[PLUS_ENTITLEMENT_ID];
        set({ isPlus, purchasing: false });
        return { ok: isPlus };
      } catch (e: any) {
        set({ purchasing: false });
        if (e?.userCancelled) return { ok: false, cancelled: true };
        return { ok: false, error: e?.message ?? "Purchase failed" };
      }
    }

    // Dev mode: simulate a successful purchase.
    await get().devSetPlus(true);
    return { ok: true };
  },

  restore: async () => {
    const { source } = get();
    if (source === "revenuecat") {
      const Purchases = loadPurchases();
      if (!Purchases) return { ok: false, error: "Purchases unavailable" };
      try {
        const info = await Purchases.restorePurchases();
        const isPlus = !!info?.entitlements?.active?.[PLUS_ENTITLEMENT_ID];
        set({ isPlus });
        return { ok: isPlus };
      } catch (e: any) {
        return { ok: false, error: e?.message ?? "Restore failed" };
      }
    }
    const stored = await AsyncStorage.getItem(DEV_PLUS_KEY);
    const isPlus = stored === "1";
    set({ isPlus });
    return { ok: isPlus };
  },

  devSetPlus: async (v) => {
    await AsyncStorage.setItem(DEV_PLUS_KEY, v ? "1" : "0");
    set({ isPlus: v });
  },
}));
