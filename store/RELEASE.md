# Shipping Loop to the App Store

A checklist from "runs in Expo Go" to "live on the store". Because your local
Xcode (16.2) is older than Expo SDK 57 needs, all real builds go through **EAS
Build** (cloud) — no local Xcode upgrade required.

## 0. One-time setup
```bash
npm i -g eas-cli
eas login                 # your Expo account
eas init                  # links this repo to an EAS project (writes the id to app.json)
```
Enrol in the Apple Developer Program ($99/yr) and create the app in
App Store Connect (bundle id: `com.rzayev.loop-crochet`).

## 1. See it on your simulator (no Xcode upgrade)
```bash
eas build --profile development --platform ios
```
EAS returns a `.app`. Drag it onto your running simulator (or `eas build:run
-p ios`). This build includes the dev client + RevenueCat, so you can test real
purchases with sandbox accounts.

## 2. Turn on real subscriptions
1. In App Store Connect, create two auto-renewable subscriptions in one group:
   `loop.plus.monthly`, `loop.plus.yearly`.
2. In RevenueCat: add the app, attach those products, create an entitlement
   named `plus`, and copy the iOS public SDK key.
3. Paste the key into `src/entitlements/config.ts` → `REVENUECAT_IOS_API_KEY`.
   The app switches from the dev toggle to real purchases automatically.

## 3. TestFlight / production build
```bash
eas build --profile production --platform ios
eas submit --profile production --platform ios
```
Fill in the three `YOUR_…` fields in `eas.json` first (Apple ID, ASC app id,
team id).

## 4. Store listing
- Copy fields from `store/app-store-listing.md` into App Store Connect.
- Host `store/privacy-policy.md` somewhere public and set the Privacy Policy URL.
- App Privacy → "No data collected" (until you add analytics).
- Upload screenshots (see `store/screenshots.md`).

## 5. Regenerate icons after any art tweak
```bash
node scripts/gen-assets.mjs
```

## Notes
- `expo-doctor` (`npx expo-doctor`) is a good pre-submit sanity check.
- Bump `version` in `app.json` for each public release; `buildNumber` is
  auto-incremented by the production profile.
