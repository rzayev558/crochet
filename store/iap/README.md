# In-App Purchase promotional images

Promotional artwork for the two Loop Plus subscriptions. Used when promoting an
IAP on the App Store product page, for win-back offers, and on the redemption
page when a customer redeems an offer code (iOS 14+).

| File | Product | Notes |
| --- | --- | --- |
| `loop-plus-monthly-1024.png` | `loop.plus.monthly` | Cream colourway |
| `loop-plus-yearly-1024.png`  | `loop.plus.yearly`  | Terracotta colourway, "Best value" badge |

Both meet Apple's requirements: PNG, 1024 × 1024, 72 dpi, RGB, flattened (no
alpha channel) and square corners.

## Regenerating

```
node scripts/gen-iap-promo.mjs
```

The script draws the same yarn-ball mark as `scripts/gen-assets.mjs` and pulls
its colours from `src/theme.ts`, so the art stays in step with the app.

## Why there's no price on the image

One image serves every country and region, and the App Store renders the
localised price alongside it. Baking in "$4.99" would be wrong everywhere else
and would need a new upload on every price change.
