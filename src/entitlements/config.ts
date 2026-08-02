/**
 * RevenueCat configuration.
 *
 * With no key resolved the app runs in DEV mode: entitlements are stored
 * locally and you can toggle "Loop Plus" from the Settings screen. This is what
 * runs in Expo Go, where native purchases aren't available.
 *
 * Real App Store subscriptions need, on top of the key below:
 *   - products in App Store Connect, with the Paid Applications Agreement signed
 *   - those products imported into RevenueCat and attached to the "plus"
 *     entitlement, with one offering marked Current
 *   - a dev client or EAS build (RevenueCat can't run in Expo Go)
 *
 * To buy without being charged, sign in to a sandbox tester on the device under
 * Settings -> Developer -> Sandbox Apple Account.
 *
 * The rest of the app doesn't change — the entitlements store detects the key
 * and switches from the dev provider to RevenueCat automatically.
 */
// Public SDK keys — designed to ship inside the client, not secrets.
//
// The App Store key is the default everywhere, so a dev build and a TestFlight
// build exercise the same StoreKit path; only the sandbox-vs-production
// environment differs, and Apple decides that from how the app was signed.
//
// The Test Store key is opt-in via the env var below. It simulates purchases
// inside RevenueCat and never reaches StoreKit, which is the only way to buy
// something in the iOS Simulator — but it validates none of the App Store
// Connect setup. The SDK also refuses to run it in a release build: it shows a
// "Wrong API Key" alert and terminates the app.
//
//   EXPO_PUBLIC_REVENUECAT_IOS_KEY=test_fIWIWdWiobcEypwwvaAUCfyZRwo npx expo start
const APP_STORE_KEY = "appl_VRMUuQhPlafjvneGPpIcxRqwrQI";

export const REVENUECAT_IOS_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() || APP_STORE_KEY;

export const PLUS_ENTITLEMENT_ID = "plus";

/** True when a real key is present, so we should use RevenueCat. */
export const REVENUECAT_ENABLED = REVENUECAT_IOS_API_KEY.trim().length > 0;

/**
 * RevenueCat's Test Store keys start with "test_". The SDK routes purchases by
 * key prefix, so a "test_" key means simulated purchases that never touch
 * StoreKit and earn nothing. RevenueCat rejects these in App Review, so this
 * must never reach a store build — use the "appl_" key for anything shippable.
 */
export const REVENUECAT_IS_TEST_STORE = REVENUECAT_IOS_API_KEY.trim().startsWith("test_");
