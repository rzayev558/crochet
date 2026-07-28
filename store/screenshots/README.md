# App Store screenshots

Ready to upload to App Store Connect. Both sets are **1320 × 2868 px** — an
accepted 6.9" iPhone size, which is the only iPhone size App Store Connect
requires. Apple scales it down for smaller devices.

- `en/` — 10 panels, English
- `de/` — 10 panels, German (upload under the German localization)

Upload in filename order; ASC shows the first two or three in search results,
so `01` and `02` do most of the selling.

| # | Panel | Screen |
|---|-------|--------|
| 01 | Never lose your place | Counter, mid-project (84 of 120) |
| 02 | A home for every project | Projects list |
| 03 | *The screen stays awake…* | Quote panel |
| 04 | Count every piece at once | Project detail with three counters |
| 05 | Know your stash by heart | Stash with colour swatches |
| 06 | *No account. No cloud…* | Quote panel |
| 07 | Every pattern, always with you | Pattern library |
| 08 | Learn to crochet, step by step | Learn tab |
| 09 | Clear, unhurried instructions | Lesson detail (single crochet) |
| 10 | *Big type and big buttons…* | Quote panel |

The three quote panels are value statements about the app, not customer
reviews — no invented names, no star ratings. Swap in real App Store reviews
once you have them (`PANELS` in `tools/make_panels.py`).

## Regenerating

The device screens are real captures of a release build running on the iPhone
16 Pro Max simulator, seeded with demo data — not mockups.

A local `npx expo run:ios` build needs Xcode 26 (Expo SDK 57's
`expo-modules-jsi` requires Swift tools 6.2); Xcode 16.x fails. So the build
comes from EAS.

This branch deliberately touches nothing but `store/screenshots/`, so it always
rebases onto master cleanly. That means the build profile it needs is *not*
committed — paste this into `eas.json` under `build` before rebuilding, and drop
it again afterwards:

```json
"screenshot": {
  "distribution": "internal",
  "developmentClient": false,
  "ios": { "simulator": true, "buildConfiguration": "Release" }
},
```

Then:

```sh
# 1. Blank REVENUECAT_IOS_API_KEY in src/entitlements/config.ts so entitlements
#    run in local mode — otherwise every list carries a "x of y free" bar.
#    Restore it right after the upload finishes.
npx eas-cli build --platform ios --profile screenshot --no-wait

# 2. Install the artifact on the simulator
tar -xzf <artifact>.tar.gz
xcrun simctl install <udid> Loop.app
xcrun simctl launch <udid> com.rzayev.loop-crochet   # once, to create the DB

# 3. Seed demo data + capture + compose, per language
tools/seed.sh en && tools/capture.sh shots-en
python3 tools/make_panels.py shots-en en en
```

`tools/seed.sh` writes the demo rows straight into the app's SQLite file and
sets the AsyncStorage flags (onboarding done, Plus on, language). `capture.sh`
cold-launches each screen via a `loop://` deep link — opening one while the app
is already frontmost makes iOS show an "Open in Loop?" prompt that needs a tap.
`make_panels.py` renders the panels with headless Chrome at exact pixel size.

Hard-coded in the scripts: the simulator UDID, the bundle id, and the
`@rzayev558` account. Update those if anything moves.
