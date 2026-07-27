/**
 * Legal links.
 *
 * App Store guideline 3.1.2 requires a paywall to show functional links to the
 * terms of use and the privacy policy, alongside the subscription title,
 * length and price. Both URLs must be publicly reachable at review time.
 *
 * TERMS_URL is Apple's standard EULA, which is acceptable when you don't have
 * your own. PRIVACY_URL must point at a page you host — the source text lives
 * in store/privacy-policy.md.
 */

/** Apple's standard End User Licence Agreement. */
export const TERMS_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

/**
 * Served by GitHub Pages from the docs/ folder of this repo. The same URL goes
 * in App Store Connect → App Privacy → Privacy Policy URL.
 */
export const PRIVACY_URL = "https://rzayev558.github.io/crochet/privacy/";

/** Apple requires a reachable support page for every listing. */
export const SUPPORT_URL = "https://rzayev558.github.io/crochet/support/";
