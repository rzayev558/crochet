import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  PLUS_ENTITLEMENT_ID,
  REVENUECAT_ENABLED,
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_IS_TEST_STORE,
} from "./config";

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
  // Why the paywall has nothing to sell. Diagnostic only — an empty offering
  // is almost always App Store Connect config, not the device.
  offeringsError?: string;
  loadingOfferings: boolean;
  init: () => Promise<void>;
  refreshOfferings: () => Promise<void>;
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
  loadingOfferings: false,

  init: async () => {
    if (REVENUECAT_ENABLED) {
      if (REVENUECAT_IS_TEST_STORE) {
        console.warn(
          "[entitlements] Using a RevenueCat TEST STORE key. Purchases are simulated " +
            "and earn nothing. Swap in the appl_ key before any TestFlight or App Store build.",
        );
      }
      const Purchases = loadPurchases();
      if (Purchases) {
        // Once the native module is present we commit to RevenueCat as the
        // source of truth. Anything that fails below leaves the user without
        // Plus — never fall back to the dev provider, which would unlock the
        // whole app from a stale local flag.
        try {
          // Debug logging goes to the device console (Xcode / Console.app) and
          // spells out exactly which products StoreKit refused to return.
          Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
          Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
          Purchases.addCustomerInfoUpdateListener((ci: any) => {
            set({ isPlus: !!ci?.entitlements?.active?.[PLUS_ENTITLEMENT_ID] });
          });
        } catch (e: any) {
          set({
            ready: true,
            source: "revenuecat",
            isPlus: false,
            packages: [],
            offeringsError: `configure failed: ${e?.message ?? String(e)}`,
          });
          return;
        }

        // Both of these can hit the network on a cold install. Offline they
        // either return RevenueCat's cache or throw; the listener above picks
        // up the real answer once connectivity returns.
        let isPlus = false;
        try {
          const info = await Purchases.getCustomerInfo();
          isPlus = !!info?.entitlements?.active?.[PLUS_ENTITLEMENT_ID];
        } catch {
          // Unknown entitlement state: stay locked.
        }

        set({ ready: true, source: "revenuecat", isPlus });
        await get().refreshOfferings();
        return;
      }
    }

    const stored = await AsyncStorage.getItem(DEV_PLUS_KEY);
    set({ ready: true, source: "dev", isPlus: stored === "1", packages: [] });
  },

  refreshOfferings: async () => {
    if (get().source !== "revenuecat" || get().loadingOfferings) return;
    const Purchases = loadPurchases();
    if (!Purchases) return;

    set({ loadingOfferings: true });
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings?.current;
      const packages = (current?.availablePackages ?? []).map(mapPackage);

      // A missing "current" offering and an empty one are different bugs, and
      // the distinction is the whole diagnosis: no current offering means the
      // RevenueCat dashboard isn't set up, while a current offering with zero
      // packages means StoreKit refused to return the products.
      let offeringsError: string | undefined;
      if (!current) {
        const all = Object.keys(offerings?.all ?? {});
        offeringsError = all.length
          ? `No "current" offering. Offerings defined: ${all.join(", ")}. Mark one as Current in RevenueCat.`
          : "No offerings configured in RevenueCat for this app.";
      } else if (packages.length === 0) {
        offeringsError =
          `Offering "${current.identifier}" has no available packages — App Store Connect ` +
          `did not return the products. Check the Paid Applications Agreement, product state, and product IDs.`;
      }

      if (offeringsError) console.warn("[entitlements] " + offeringsError);
      set({ packages, offeringsError, loadingOfferings: false });
    } catch (e: any) {
      const offeringsError = `getOfferings failed: ${e?.message ?? String(e)}`;
      console.warn("[entitlements] " + offeringsError);
      // No packages: the paywall can't sell, but nothing is given away.
      set({ packages: [], offeringsError, loadingOfferings: false });
    }
  },

  purchase: async (pkg) => {
    const { source } = get();

    if (source === "revenuecat") {
      // A package without an rcPackage is a placeholder the paywall rendered
      // because offerings failed to load. Never simulate a purchase here.
      if (!pkg?.rcPackage) return { ok: false, error: "Plans couldn't be loaded. Please try again." };
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
