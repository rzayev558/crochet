# Loop — App Store listing

Copy-paste fields for App Store Connect. Character limits noted in ().

The fields under "English (U.S.)" and "German (Germany)" are per-locale: adding
a locale in App Store Connect means filling in *every* one of them for that
locale, or the version can't be submitted. Everything below the locale sections
is set once for the app as a whole.

# English (U.S.) — primary

## Name (30)
Loop: Crochet & Knitting

## Subtitle (30)
Row counter, projects & stash

## Promotional text (170) — editable anytime without review
The cosy way to keep your place. Tap to count rows, organise every project, and
catalogue your yarn stash — all offline, all in one calm little app.

## Keywords (100, comma-separated, no spaces)
stitch,yarn,wool,pattern,tracker,amigurumi,granny,knit,skein,crafting,hook,gauge,wip,needle,rows

Apple already indexes the name and subtitle, so "crochet", "knitting", "row",
"counter", "project" and "stash" are deliberately left out — the earlier list
repeated them and came to 105 characters, five over the limit.

## Description
Loop is the warm, uncomplicated companion for crochet and knitting.

COUNT WITHOUT LOSING YOUR PLACE
• A giant tap-anywhere row counter with a gentle buzz on every stitch
• The screen stays awake while your hands are full
• Set a row goal and watch the progress fill
• Count by any step for lace and pattern repeats

A HOME FOR EVERY PROJECT
• Group counters, notes and a photo for each thing you're making
• Mark projects in-progress or finished
• Everything saved on your device, instantly

YOUR STASH, ALWAYS WITH YOU
• Catalogue every skein — brand, colourway, weight, fibre and how much is left
• Snap a photo and tag a colour so you can match on the go

YOUR PATTERN LIBRARY
• Import pattern PDFs or photos, or save a link
• Keep notes on hook size, gauge and modifications

LEARN TO CROCHET
• Eight short lessons, from holding the hook to reading a pattern

Loop works completely offline — no account required, nothing to sign up for.

LOOP PLUS
Upgrade to Loop Plus for unlimited projects, counters, stash items and patterns.
A monthly or yearly subscription; cancel anytime in your App Store settings.

## What's New (v1.0.0)
The first release of Loop! Row counting, projects, yarn stash and a pattern
library — cosy and offline. We'd love your feedback.

# German (Germany)

The wording matches what the app actually says in German — "Vorrat", "Muster",
"Zähler", "Knäuel" — so the listing and the screenshots use one vocabulary.

## Name (30)
Loop: Häkeln & Stricken

## Subtitle (30)
Reihenzähler, Projekte, Garn

## Promotional text (170) — editable anytime without review
Behalte entspannt den Überblick. Zähle Reihen mit einem Tipp, ordne jedes
Projekt und katalogisiere deinen Garnvorrat — offline, in einer ruhigen kleinen
App.

## Keywords (100, comma-separated, no spaces)
maschenzähler,wolle,vorrat,muster,amigurumi,handarbeit,knäuel,masche,anleitung,strickprojekt,diy

Apple already indexes the words in the name and subtitle, so "häkeln",
"stricken", "reihenzähler", "garn" and "projekte" are deliberately left out —
repeating them would burn characters that buy nothing.

## Description
Loop ist der warme, unkomplizierte Begleiter fürs Häkeln und Stricken.

ZÄHLEN, OHNE DEN FADEN ZU VERLIEREN
• Ein riesiger Zähler — tippe irgendwo, mit sanftem Summen bei jeder Reihe
• Der Bildschirm bleibt an, während deine Hände beschäftigt sind
• Setze ein Reihenziel und sieh dem Fortschritt beim Wachsen zu
• Zähle in beliebigen Schritten, für Lochmuster und Rapporte

EIN ZUHAUSE FÜR JEDES PROJEKT
• Zähler, Notizen und ein Foto für jedes deiner Werkstücke, an einem Ort
• Markiere Projekte als „In Arbeit" oder „Fertig"
• Alles sofort auf deinem Gerät gespeichert

DEIN VORRAT, IMMER DABEI
• Katalogisiere jedes Knäuel — Marke, Farbe, Stärke, Faser und Restmenge
• Mach ein Foto und vergib eine Farbe, damit du unterwegs abgleichen kannst

DEINE MUSTERSAMMLUNG
• Importiere Anleitungen als PDF oder Foto, oder speichere einen Link
• Notiere Nadelstärke, Maschenprobe und deine Änderungen

HÄKELN LERNEN
• Acht kurze Lektionen — vom Halten der Nadel bis zum Lesen einer Anleitung

Loop funktioniert komplett offline — kein Konto nötig, keine Anmeldung.

LOOP PLUS
Mit Loop Plus bekommst du unbegrenzt Projekte, Zähler, Garne und Muster. Als
Monats- oder Jahresabo; jederzeit in den App-Store-Einstellungen kündbar.

## What's New (v1.0.0)
Die erste Version von Loop! Reihen zählen, Projekte, Garnvorrat und eine
Mustersammlung — gemütlich und offline. Wir freuen uns über dein Feedback.

# Shared across all locales

## Category
Primary: Lifestyle
Secondary: Utilities

## Age rating
4+

## Support & marketing URLs
Support URL:   https://rzayev558.github.io/crochet/support/
Marketing URL: https://rzayev558.github.io/crochet/
Privacy Policy URL: https://rzayev558.github.io/crochet/privacy/

All three are served by GitHub Pages from the `docs/` folder of this repo.

## App Privacy answers (nutrition label)
Loop itself collects nothing: everything lives on-device, there are no accounts
and no analytics. But RevenueCat is now live, and it makes real network calls —
so "No, we do not collect data from this app" is no longer a true answer and
must not be selected.

Declare instead:
- Purchases → Purchase History
  - Used for: App Functionality
  - Linked to the user's identity: No
  - Used for tracking: No

RevenueCat also sends an anonymous app user id it generates on-device. Check
their current App Privacy guidance before answering, in case Identifiers →
User ID has to be declared alongside the above:
https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy

The hosted privacy policy (docs/privacy/) already describes all of this; only
the questionnaire needs to be brought in line.

## In-app purchases to configure
- loop.plus.monthly  — auto-renewable subscription
- loop.plus.yearly   — auto-renewable subscription (mark as best value)
Group them in one subscription group ("Loop Plus") with an entitlement named
"plus" in RevenueCat.
