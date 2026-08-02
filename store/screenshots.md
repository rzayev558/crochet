# Screenshots & app previews

## Where the assets live

```
~/Downloads/Crochet/Screenshots/
  EN/  9 × PNG  +  loop_app_preview_v2.mp4
  DE/  9 × PNG  +  loop_app_preview.mp4
  {EN,DE}/_original/   pre-resize copies of the two *_Preview.png
```

`~/Downloads` is not a durable home for release assets — they aren't in git and
Downloads gets cleared. Move them somewhere backed up before the next release,
or commit them if you don't mind the ~14 MB.

## Sizes App Store Connect accepts

| Asset | Required size | Notes |
|---|---|---|
| iPhone 6.9" screenshot | **1320 × 2868** | the only size you need — Apple scales it down for smaller devices |
| iPhone 6.9" app preview | **1320 × 2868** | portrait; 886 × 1920 also accepted |
| App preview duration | **15–30 s** | hard limit, enforced at upload |

Max 10 screenshots per locale per size. The current set is 9.

Both are metadata, not part of the build: they upload in the listing and can be
replaced later without a new binary and without a new review, as long as the
version is still editable.

## Current status

**Screenshots — ready.** All 18 files are 1320 × 2868.

The seven numbered PNGs were exported at that size directly. The two
`*_Preview.png` came out at 853 × 1844 (DE: 852 × 1847), which App Store Connect
rejects, and were upscaled to spec:

```bash
# sharp is already a devDependency; fit:"cover" trims the ~0.5% aspect
# mismatch instead of padding it, which would show as bars.
sharp(src).resize(1320, 2868, { fit: "cover", position: "centre", kernel: "lanczos3" })
```

Being a 1.55× upscale they're a little softer than the rest. If you re-export
them from source at 1320 × 2868, that goes away.

**App previews — not usable yet.** Both are ~7 s at 1080 × 2340 / 1080 × 1920,
which are Android frame sizes. They fail on duration *and* dimensions, and get
rejected at upload rather than at review.

Previews are optional, so v1.0.0 can ship without them and add them in a later
metadata-only update.

Note that Apple requires app previews to be **captured from the app running**
(guideline 2.3.10) — screen recordings, not rendered motion graphics or device
mockups. To capture real footage:

```bash
xcrun simctl io booted recordVideo --codec h264 preview.mov   # ⌃C to stop
```

Run it on the iPhone 16 Pro Max simulator so the native recording is already
1320 × 2868, then trim to 15–30 s.

## Re-capturing screenshots

1. Run on the **iPhone 16 Pro Max** simulator (`npx expo start`, press `i`).
2. Seed demo content so the screens look alive — a few projects with photos, a
   counter mid-count, a colourful stash, a pattern.
3. Set the status bar to Apple's canonical 09:41:
   ```bash
   xcrun simctl status_bar booted override --time 09:41 \
     --cellularBars 4 --wifiBars 3 --batteryState charged --batteryLevel 100
   ```
4. Capture: `xcrun simctl io booted screenshot shot.png`
5. Repeat with the app language set to German for the DE set.

## Compliance note

Shots 03, 06 and 10 are typographic quote cards with no app UI in them. Apple's
guidance is that screenshots show the app in use, so purely marketing cards sit
outside the letter of that rule. In practice they're common and usually pass —
and if they ever don't, the fix is metadata-only and doesn't need a new build.
