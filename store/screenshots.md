# Screenshots

App Store requires screenshots for at least one iPhone size. The simplest
accepted set today:

- **6.9" (iPhone 16 Pro Max)** — 1320 × 2868 px  ← required
- **6.5" (iPhone 11 Pro Max / XS Max)** — 1242 × 2688 px (optional but nice)

Apple scales the 6.9" set down for smaller devices, so one great set is enough
to launch.

## How to capture
1. Run the app on the iPhone 16 Pro Max simulator (`npx expo start`, press `i`,
   pick that device — or use the EAS dev build).
2. Add a couple of demo projects, a counter mid-count, a few colourful yarns and
   a pattern so the screens look alive.
3. In the simulator: **File → Save Screen** (⌘S) or `xcrun simctl io booted
   screenshot shot.png`.

## Suggested 5 shots (with caption ideas)
1. **Counter screen** mid-count with a goal bar — "Tap to count. Never lose your place."
2. **Projects list** with photos — "A home for every project."
3. **Project detail** showing counters + notes + photo — "Counters, notes and a photo, together."
4. **Stash** with colourful yarn thumbnails — "Your whole stash in your pocket."
5. **Paywall** — "Go unlimited with Loop Plus."

## Optional: framed / captioned marketing screenshots
Tools like Fastlane `frameit`, Previewed, or Screenshots.pro add device frames
and captions. Not required — plain simulator screenshots are accepted.
```
xcrun simctl io booted screenshot ~/Desktop/loop-01.png
```
