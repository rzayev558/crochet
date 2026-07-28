/**
 * Fails a production EAS build that still carries a RevenueCat Test Store key.
 *
 * A "test_" key simulates purchases: nothing reaches StoreKit and nothing is
 * earned, and RevenueCat rejects such builds in App Review. It's the right key
 * for local work and the worst possible key to ship, so the only safe place to
 * catch it is the build itself — see REVENUECAT_IS_TEST_STORE in
 * src/entitlements/config.ts.
 *
 * Wired to the eas-build-pre-install npm hook, so it runs on EAS but stays out
 * of the way locally.
 */
import { readFileSync } from "node:fs";

const CONFIG = new URL("../src/entitlements/config.ts", import.meta.url);
// Profiles that produce something a real customer could pay through.
const SHIPPING_PROFILES = new Set(["production", "preview"]);

const profile = process.env.EAS_BUILD_PROFILE;
if (!profile) {
  // Not an EAS build (plain `npm install`) — nothing to police.
  process.exit(0);
}

const source = readFileSync(CONFIG, "utf8");
const match = source.match(/REVENUECAT_IOS_API_KEY\s*=\s*"([^"]*)"/);
if (!match) {
  console.error("[check-revenuecat-key] Could not find REVENUECAT_IOS_API_KEY in config.ts.");
  process.exit(1);
}

const key = match[1].trim();

if (SHIPPING_PROFILES.has(profile) && key.startsWith("test_")) {
  console.error(
    `\n[check-revenuecat-key] Refusing to build profile "${profile}" with a RevenueCat ` +
      `Test Store key ("${key.slice(0, 9)}…").\n` +
      `Test Store purchases are simulated, earn nothing, and are rejected in App Review.\n` +
      `Set the "appl_" production key in src/entitlements/config.ts before building.\n`
  );
  process.exit(1);
}

if (SHIPPING_PROFILES.has(profile) && key === "") {
  console.error(
    `\n[check-revenuecat-key] Refusing to build profile "${profile}" with an empty ` +
      `RevenueCat key — entitlements would fall back to the local dev provider, ` +
      `unlocking Loop Plus for everyone.\n`
  );
  process.exit(1);
}

console.log(`[check-revenuecat-key] ok — profile "${profile}", key prefix "${key.slice(0, 5)}".`);
