#!/bin/zsh
# Captures raw simulator screenshots of each Loop screen.
# Usage: ./capture.sh <outdir>
set -e

UDID=E7B14CF1-D7C1-4EBB-A522-2C9F1E3E8D84
HOST="loop://"
OUT="${1:?usage: capture.sh <outdir>}"
mkdir -p "$OUT"

# Opening a loop:// URL while Loop is already frontmost makes iOS 18 show an
# "Open in Loop?" confirmation, which needs a tap. Terminating first means the
# URL arrives as a cold-launch deep link instead, with no prompt.
shot() { # shot <route> <name> <settle-seconds>
  # Non-zero when the app isn't running, which is fine.
  xcrun simctl terminate "$UDID" com.rzayev.loop-crochet >/dev/null 2>&1 || true
  sleep 1
  xcrun simctl openurl "$UDID" "$HOST$1"
  sleep "${3:-8}"
  xcrun simctl io "$UDID" screenshot --type=png "$OUT/$2.png" >/dev/null
  echo "captured $2"
}

# A clean, consistent status bar for every shot.
xcrun simctl status_bar "$UDID" override \
  --time "9:41" \
  --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 \
  --batteryState charged --batteryLevel 100

shot "/counter/c1"                "counter"  5
shot "/"                          "projects" 4
shot "/project/p1"                "project"  4
shot "/stash"                     "stash"    4
shot "/patterns"                  "patterns" 4
shot "/learn"                     "learn"    4
shot "/lesson/single-crochet"     "lesson"   4

echo "done -> $OUT"
