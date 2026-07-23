/**
 * RevenueCat configuration.
 *
 * Leave the key empty to run in DEV mode: entitlements are stored locally and
 * you can toggle "Loop Plus" from the Settings screen. This is what runs in
 * Expo Go, where native purchases aren't available.
 *
 * To go live with real App Store subscriptions:
 *   1. Create an app + products in RevenueCat (https://app.revenuecat.com)
 *   2. Paste the iOS public SDK key below (starts with "appl_")
 *   3. Name your entitlement "plus" (or change PLUS_ENTITLEMENT_ID)
 *   4. Build a dev client or EAS build (RevenueCat can't run in Expo Go)
 *
 * The rest of the app doesn't change — the entitlements store detects the key
 * and switches from the dev provider to RevenueCat automatically.
 */
export const REVENUECAT_IOS_API_KEY = ""; // e.g. "appl_XXXXXXXXXXXXXXXXXXXX"

export const PLUS_ENTITLEMENT_ID = "plus";

/** True when a real key is present, so we should use RevenueCat. */
export const REVENUECAT_ENABLED = REVENUECAT_IOS_API_KEY.trim().length > 0;
