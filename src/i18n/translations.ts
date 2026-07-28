/**
 * Translation dictionaries.
 *
 * `en` is the source of truth: every key the app uses lives here. `de` is
 * typed against it, so TypeScript flags any missing German string. Keys are
 * flat dot-paths grouped by screen. Use {placeholders} for interpolation —
 * see `translate()` in ./index.
 */

export const en = {
  // Root gate + navigation
  "gate.loading": "Getting your projects ready…",
  "gate.dbError": "Couldn't open the database.",
  "nav.settings": "Settings",
  "nav.yarn": "Yarn",
  "nav.pattern": "Pattern",

  // Tabs
  "tabs.projects": "Projects",
  "tabs.stash": "Stash",
  "tabs.patterns": "Patterns",
  "tabs.learn": "Learn",

  // Shared / common
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.save": "Save",
  "common.reset": "Reset",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.back": "Back",

  // Units (used in the free-limit bar and counts)
  "units.projects": "projects",
  "units.yarns": "yarns",
  "units.patterns": "patterns",
  "units.counters": "counters",

  // Free-limit bar: "2 of 2 free projects"
  "freeLimit.bar": "{used} of {limit} free {label}",
  "freeLimit.upgrade": "Upgrade",

  // Onboarding
  "onboarding.slide1.title": "Never lose your place",
  "onboarding.slide1.body":
    "A giant tap-to-count button with a gentle buzz on every row. The screen stays awake while your hands are busy.",
  "onboarding.slide2.title": "A home for every project",
  "onboarding.slide2.body":
    "Group counters, notes and a photo for each thing you're making — sweaters, blankets, granny squares.",
  "onboarding.slide3.title": "Your stash & patterns",
  "onboarding.slide3.body":
    "Catalogue every skein and keep your patterns in one place. All offline, always with you.",
  "onboarding.skip": "Skip",
  "onboarding.next": "Next",
  "onboarding.start": "Start counting",

  // Projects tab
  "projects.emptyTitle": "Start a project",
  "projects.emptyBody":
    "Group your counters, notes and a photo for each thing you're making — a sweater, a blanket, a granny square.",
  "projects.new": "New project",
  "projects.finished": "Finished",
  "projects.counterOne": "counter",
  "projects.counterOther": "counters",

  // Stash tab
  "stash.emptyTitle": "Your yarn stash",
  "stash.emptyBody":
    "Keep track of every skein — brand, colorway, weight and how much you have left. Snap a photo so you can match colors on the go.",
  "stash.addYarn": "Add yarn",
  "stash.yarnFallback": "Yarn",
  "stash.skeinOne": "skein",
  "stash.skeinOther": "skeins",

  // Patterns tab
  "patterns.emptyTitle": "Pattern library",
  "patterns.emptyBody":
    "Save the patterns you're working from — import a PDF, snap a photo of a page, or keep a link. Everything in one place, offline.",
  "patterns.addPattern": "Add pattern",
  "patterns.link": "Link",

  // Craft labels
  "craft.crochet": "Crochet",
  "craft.knit": "Knit",

  // Yarn weights — the standard names, used in both languages by German
  // crafters too, so the German column repeats them on purpose.
  "weight.lace": "Lace",
  "weight.fingering": "Fingering",
  "weight.sport": "Sport",
  "weight.dk": "DK",
  "weight.worsted": "Worsted",
  "weight.aran": "Aran",
  "weight.bulky": "Bulky",
  "weight.super_bulky": "Super Bulky",

  // Project detail
  "project.namePlaceholder": "Project name",
  "project.inProgress": "In progress",
  "project.finished": "Finished",
  "project.counters": "Counters",
  "project.noCounters": "No counters yet. Add one to start counting rows.",
  "project.counterOfTarget": "{count} of {target}",
  "project.counterRows": "{count} rows",
  "project.notes": "Notes",
  "project.notesPlaceholder": "Hook size, gauge, modifications…",
  "project.delete": "Delete project",
  "project.deleteTitle": "Delete project?",
  "project.deleteBody": "\"{name}\" and its counters will be removed.",
  "project.counterDefault": "Counter {n}",

  // Counter screen
  "counter.gone": "This counter no longer exists.",
  "counter.goalReached": "Goal reached 🎉",
  "counter.ofTarget": "of {target}",
  "counter.perTap": "+{step} per tap",
  "counter.tapHint": "tap anywhere to count",
  "counter.subtract": "Subtract",
  "counter.add": "Add",
  "counter.resetTitle": "Reset to zero?",
  "counter.resetBody": "\"{name}\" will go back to 0.",
  "counter.settingsTitle": "Counter settings",
  "counter.name": "Name",
  "counter.rowsPerTap": "Rows per tap",
  "counter.goalOptional": "Goal (optional)",
  "counter.delete": "Delete counter",
  "counter.deleteTitle": "Delete this counter?",
  "counter.deleteBody": "\"{name}\" will be removed.",

  // Yarn editor
  "yarn.addTitle": "Add yarn",
  "yarn.editTitle": "Edit yarn",
  "yarn.colorway": "Colorway",
  "yarn.colorwayPlaceholder": "e.g. Dusty Rose",
  "yarn.brand": "Brand",
  "yarn.brandPlaceholder": "e.g. Cascade 220",
  "yarn.weight": "Weight",
  "yarn.fiber": "Fiber",
  "yarn.fiberPlaceholder": "e.g. 100% merino wool",
  "yarn.skeins": "Skeins",
  "yarn.yardsPerSkein": "Yards / skein",
  "yarn.colorTag": "Colour tag",
  "yarn.notesPlaceholder": "Dye lot, where you bought it…",
  "yarn.addToStash": "Add to stash",
  "yarn.delete": "Delete yarn",
  "yarn.deleteTitle": "Delete yarn?",
  "yarn.deleteBody": "\"{name}\" will be removed.",

  // Pattern editor
  "pattern.addTitle": "Add pattern",
  "pattern.editTitle": "Edit pattern",
  "pattern.title": "Title",
  "pattern.titlePlaceholder": "e.g. Granny Square Blanket",
  "pattern.craft": "Craft",
  "pattern.file": "Pattern file",
  "pattern.attachedFile": "Attached file",
  "pattern.import": "Import a PDF or image",
  "pattern.sourceLink": "Source link",
  "pattern.openLink": "Open link",
  "pattern.fullLinkTitle": "Add a full link",
  "pattern.fullLinkBody": "Include https:// so we can open it.",
  "pattern.notesPlaceholder": "Hook size, gauge, yardage…",
  "pattern.save": "Save pattern",
  "pattern.delete": "Delete pattern",
  "pattern.deleteTitle": "Delete pattern?",
  "pattern.deleteBody": "\"{name}\" will be removed.",

  // Common field
  "field.notes": "Notes",

  // Paywall
  "paywall.title": "Loop Plus",
  "paywall.alreadyPlus": "You're on Loop Plus — thank you! Everything's unlocked.",
  "paywall.reachedLimit": "You've reached the free limit for {label}. ",
  "paywall.unlockAll": "Unlock the whole app with Loop Plus.",
  "paywall.yearly": "Yearly",
  "paywall.monthly": "Monthly",
  "paywall.perMonth": "per month, billed monthly",
  "paywall.perYear": "per year, billed annually",
  "paywall.bestValue": "Best value",
  "paywall.devNote": "Dev mode — this simulates a purchase, no real charge.",
  "paywall.pleaseWait": "Please wait…",
  "paywall.continue": "Continue",
  "paywall.restore": "Restore purchases",
  "paywall.fine":
    "Payment is charged to your Apple Account at confirmation. Your subscription renews automatically for the same price and period unless you cancel at least 24 hours before the current period ends. Manage or cancel in your App Store settings.",
  "paywall.terms": "Terms of Use",
  "paywall.privacy": "Privacy Policy",
  "paywall.purchaseErrorTitle": "Couldn't complete purchase",
  "paywall.plansUnavailable":
    "Plans couldn't be loaded. Check your connection and try again.",
  "paywall.retry": "Try again",
  "paywall.restoreOkTitle": "Loop Plus restored",
  "paywall.restoreOkBody": "Welcome back — everything's unlocked again.",
  "paywall.restoreNoneTitle": "Nothing to restore",
  "paywall.restoreNoneBody":
    "We couldn't find an active Loop Plus subscription on this Apple Account.",
  "paywall.restoreErrorTitle": "Couldn't restore purchases",

  // Plus benefits
  "plus.benefit1": "Unlimited projects & counters",
  "plus.benefit2": "Unlimited yarn stash & patterns",
  "plus.benefit3": "Every future Plus feature included",

  // Settings
  "settings.title": "Settings",
  "settings.loopPlus": "Loop Plus",
  "settings.freePlan": "Free plan",
  "settings.plusStatusSub": "Everything's unlocked. Thanks for supporting Loop!",
  "settings.freeStatusSub": "Upgrade to remove all limits and unlock every feature.",
  "settings.upgradeCta": "Upgrade to Loop Plus",
  "settings.restore": "Restore purchases",
  "settings.restoredTitle": "Restored",
  "settings.restoredBody": "Loop Plus is active again.",
  "settings.nothingRestoreTitle": "Nothing to restore",
  "settings.nothingRestoreBody": "No previous purchase was found.",
  "settings.developer": "Developer",
  "settings.simulatePlus": "Simulate Loop Plus",
  "settings.devHint":
    "No RevenueCat key set, so purchases are simulated locally. Add a key in src/entitlements/config.ts and build natively for real subscriptions.",
  "settings.version": "Loop v{version}",
  "settings.language": "Language",

  // Language picker
  "language.title": "Language",
  "language.system": "System default",
  "language.en": "English",
  "language.de": "Deutsch",

  // Learn tab
  "learn.heroTitle": "Learn to crochet",
  "learn.heroBody":
    "Short, step-by-step lessons — from holding the hook to reading a pattern. Work through them in order, or dip into whatever you need.",
  "learn.minutes": "{n} min",
  "learn.stepOne": "{n} step",
  "learn.stepOther": "{n} steps",
  "learn.upNext": "Up next",
  "learn.unavailable": "This lesson isn't available.",
  "learn.doneTitle": "That's the last lesson!",
  "learn.doneBody":
    "You've got the fundamentals. Start a project and keep these lessons handy for reference.",

  // Lesson levels + section blurbs
  "level.Basics": "Basics",
  "level.Stitches": "Stitches",
  "level.Reference": "Reference",
  "level.blurb.Basics": "Start here — hands, first loops, and chains.",
  "level.blurb.Stitches": "The stitches you'll use in almost every project.",
  "level.blurb.Reference": "Handy guides to keep coming back to.",
} as const;

export type TranslationKey = keyof typeof en;

export const de: Record<TranslationKey, string> = {
  // Root gate + navigation
  "gate.loading": "Deine Projekte werden vorbereitet…",
  "gate.dbError": "Die Datenbank konnte nicht geöffnet werden.",
  "nav.settings": "Einstellungen",
  "nav.yarn": "Garn",
  "nav.pattern": "Muster",

  // Tabs
  "tabs.projects": "Projekte",
  "tabs.stash": "Vorrat",
  "tabs.patterns": "Muster",
  "tabs.learn": "Lernen",

  // Shared / common
  "common.cancel": "Abbrechen",
  "common.delete": "Löschen",
  "common.save": "Speichern",
  "common.reset": "Zurücksetzen",
  "common.edit": "Bearbeiten",
  "common.add": "Hinzufügen",
  "common.back": "Zurück",

  // Units
  "units.projects": "Projekten",
  "units.yarns": "Garnen",
  "units.patterns": "Mustern",
  "units.counters": "Zählern",

  // Free-limit bar
  "freeLimit.bar": "{used} von {limit} kostenlosen {label}",
  "freeLimit.upgrade": "Upgraden",

  // Onboarding
  "onboarding.slide1.title": "Verliere nie deine Stelle",
  "onboarding.slide1.body":
    "Ein riesiger Zähl-Button mit sanftem Summen bei jeder Reihe. Der Bildschirm bleibt an, während deine Hände beschäftigt sind.",
  "onboarding.slide2.title": "Ein Zuhause für jedes Projekt",
  "onboarding.slide2.body":
    "Bündle Zähler, Notizen und ein Foto für alles, was du machst — Pullover, Decken, Granny Squares.",
  "onboarding.slide3.title": "Dein Vorrat & deine Muster",
  "onboarding.slide3.body":
    "Katalogisiere jedes Knäuel und halte deine Muster an einem Ort. Alles offline, immer dabei.",
  "onboarding.skip": "Überspringen",
  "onboarding.next": "Weiter",
  "onboarding.start": "Los geht's",

  // Projects tab
  "projects.emptyTitle": "Starte ein Projekt",
  "projects.emptyBody":
    "Bündle deine Zähler, Notizen und ein Foto für alles, was du machst — einen Pullover, eine Decke, ein Granny Square.",
  "projects.new": "Neues Projekt",
  "projects.finished": "Fertig",
  "projects.counterOne": "Zähler",
  "projects.counterOther": "Zähler",

  // Stash tab
  "stash.emptyTitle": "Dein Garnvorrat",
  "stash.emptyBody":
    "Behalte jedes Knäuel im Blick — Marke, Farbe, Stärke und wie viel du noch hast. Mach ein Foto, um Farben unterwegs abzugleichen.",
  "stash.addYarn": "Garn hinzufügen",
  "stash.yarnFallback": "Garn",
  "stash.skeinOne": "Knäuel",
  "stash.skeinOther": "Knäuel",

  // Patterns tab
  "patterns.emptyTitle": "Musterbibliothek",
  "patterns.emptyBody":
    "Speichere die Muster, mit denen du arbeitest — importiere ein PDF, fotografiere eine Seite oder hinterlege einen Link. Alles an einem Ort, offline.",
  "patterns.addPattern": "Muster hinzufügen",
  "patterns.link": "Link",

  // Craft labels
  "craft.crochet": "Häkeln",
  "craft.knit": "Stricken",

  // Yarn weights — kept in the standard English naming, which German patterns
  // and yarn labels use as well.
  "weight.lace": "Lace",
  "weight.fingering": "Fingering",
  "weight.sport": "Sport",
  "weight.dk": "DK",
  "weight.worsted": "Worsted",
  "weight.aran": "Aran",
  "weight.bulky": "Bulky",
  "weight.super_bulky": "Super Bulky",

  // Project detail
  "project.namePlaceholder": "Projektname",
  "project.inProgress": "In Arbeit",
  "project.finished": "Fertig",
  "project.counters": "Zähler",
  "project.noCounters": "Noch keine Zähler. Füge einen hinzu, um Reihen zu zählen.",
  "project.counterOfTarget": "{count} von {target}",
  "project.counterRows": "{count} Reihen",
  "project.notes": "Notizen",
  "project.notesPlaceholder": "Nadelstärke, Maschenprobe, Änderungen…",
  "project.delete": "Projekt löschen",
  "project.deleteTitle": "Projekt löschen?",
  "project.deleteBody": "\"{name}\" und seine Zähler werden entfernt.",
  "project.counterDefault": "Zähler {n}",

  // Counter screen
  "counter.gone": "Diesen Zähler gibt es nicht mehr.",
  "counter.goalReached": "Ziel erreicht 🎉",
  "counter.ofTarget": "von {target}",
  "counter.perTap": "+{step} pro Tipp",
  "counter.tapHint": "Tippe irgendwo zum Zählen",
  "counter.subtract": "Abziehen",
  "counter.add": "Hinzufügen",
  "counter.resetTitle": "Auf null zurücksetzen?",
  "counter.resetBody": "\"{name}\" wird wieder auf 0 gesetzt.",
  "counter.settingsTitle": "Zähler-Einstellungen",
  "counter.name": "Name",
  "counter.rowsPerTap": "Reihen pro Tipp",
  "counter.goalOptional": "Ziel (optional)",
  "counter.delete": "Zähler löschen",
  "counter.deleteTitle": "Diesen Zähler löschen?",
  "counter.deleteBody": "\"{name}\" wird entfernt.",

  // Yarn editor
  "yarn.addTitle": "Garn hinzufügen",
  "yarn.editTitle": "Garn bearbeiten",
  "yarn.colorway": "Farbe",
  "yarn.colorwayPlaceholder": "z. B. Altrosa",
  "yarn.brand": "Marke",
  "yarn.brandPlaceholder": "z. B. Cascade 220",
  "yarn.weight": "Stärke",
  "yarn.fiber": "Faser",
  "yarn.fiberPlaceholder": "z. B. 100 % Merinowolle",
  "yarn.skeins": "Knäuel",
  "yarn.yardsPerSkein": "Meter / Knäuel",
  "yarn.colorTag": "Farbmarkierung",
  "yarn.notesPlaceholder": "Färbepartie, wo du es gekauft hast…",
  "yarn.addToStash": "Zum Vorrat hinzufügen",
  "yarn.delete": "Garn löschen",
  "yarn.deleteTitle": "Garn löschen?",
  "yarn.deleteBody": "\"{name}\" wird entfernt.",

  // Pattern editor
  "pattern.addTitle": "Muster hinzufügen",
  "pattern.editTitle": "Muster bearbeiten",
  "pattern.title": "Titel",
  "pattern.titlePlaceholder": "z. B. Granny-Square-Decke",
  "pattern.craft": "Handwerk",
  "pattern.file": "Musterdatei",
  "pattern.attachedFile": "Angehängte Datei",
  "pattern.import": "PDF oder Bild importieren",
  "pattern.sourceLink": "Quelllink",
  "pattern.openLink": "Link öffnen",
  "pattern.fullLinkTitle": "Vollständigen Link angeben",
  "pattern.fullLinkBody": "Füge https:// hinzu, damit wir ihn öffnen können.",
  "pattern.notesPlaceholder": "Nadelstärke, Maschenprobe, Lauflänge…",
  "pattern.save": "Muster speichern",
  "pattern.delete": "Muster löschen",
  "pattern.deleteTitle": "Muster löschen?",
  "pattern.deleteBody": "\"{name}\" wird entfernt.",

  // Common field
  "field.notes": "Notizen",

  // Paywall
  "paywall.title": "Loop Plus",
  "paywall.alreadyPlus": "Du hast Loop Plus — danke! Alles ist freigeschaltet.",
  "paywall.reachedLimit": "Du hast das kostenlose Limit für {label} erreicht. ",
  "paywall.unlockAll": "Schalte mit Loop Plus die ganze App frei.",
  "paywall.yearly": "Jährlich",
  "paywall.monthly": "Monatlich",
  "paywall.perMonth": "pro Monat, monatliche Abrechnung",
  "paywall.perYear": "pro Jahr, jährliche Abrechnung",
  "paywall.bestValue": "Bester Wert",
  "paywall.devNote": "Dev-Modus — dies simuliert einen Kauf, keine echte Zahlung.",
  "paywall.pleaseWait": "Bitte warten…",
  "paywall.continue": "Weiter",
  "paywall.restore": "Käufe wiederherstellen",
  "paywall.fine":
    "Die Zahlung wird bei Bestätigung deinem Apple-Account belastet. Das Abo verlängert sich automatisch zum gleichen Preis und Zeitraum, sofern du nicht spätestens 24 Stunden vor Ende des laufenden Zeitraums kündigst. Verwalten oder kündigen kannst du in deinen App-Store-Einstellungen.",
  "paywall.terms": "Nutzungsbedingungen",
  "paywall.privacy": "Datenschutz",
  "paywall.purchaseErrorTitle": "Kauf konnte nicht abgeschlossen werden",
  "paywall.plansUnavailable":
    "Die Tarife konnten nicht geladen werden. Prüfe deine Verbindung und versuche es erneut.",
  "paywall.retry": "Erneut versuchen",
  "paywall.restoreOkTitle": "Loop Plus wiederhergestellt",
  "paywall.restoreOkBody": "Willkommen zurück — alles ist wieder freigeschaltet.",
  "paywall.restoreNoneTitle": "Nichts wiederherzustellen",
  "paywall.restoreNoneBody":
    "Wir konnten für diesen Apple-Account kein aktives Loop-Plus-Abo finden.",
  "paywall.restoreErrorTitle": "Käufe konnten nicht wiederhergestellt werden",

  // Plus benefits
  "plus.benefit1": "Unbegrenzte Projekte & Zähler",
  "plus.benefit2": "Unbegrenzter Garnvorrat & Muster",
  "plus.benefit3": "Jede zukünftige Plus-Funktion inklusive",

  // Settings
  "settings.title": "Einstellungen",
  "settings.loopPlus": "Loop Plus",
  "settings.freePlan": "Kostenloser Tarif",
  "settings.plusStatusSub": "Alles ist freigeschaltet. Danke, dass du Loop unterstützt!",
  "settings.freeStatusSub":
    "Upgrade, um alle Limits zu entfernen und jede Funktion freizuschalten.",
  "settings.upgradeCta": "Upgrade auf Loop Plus",
  "settings.restore": "Käufe wiederherstellen",
  "settings.restoredTitle": "Wiederhergestellt",
  "settings.restoredBody": "Loop Plus ist wieder aktiv.",
  "settings.nothingRestoreTitle": "Nichts wiederherzustellen",
  "settings.nothingRestoreBody": "Kein früherer Kauf gefunden.",
  "settings.developer": "Entwickler",
  "settings.simulatePlus": "Loop Plus simulieren",
  "settings.devHint":
    "Kein RevenueCat-Schlüssel gesetzt, daher werden Käufe lokal simuliert. Füge einen Schlüssel in src/entitlements/config.ts hinzu und baue nativ für echte Abos.",
  "settings.version": "Loop v{version}",
  "settings.language": "Sprache",

  // Language picker
  "language.title": "Sprache",
  "language.system": "Systemstandard",
  "language.en": "English",
  "language.de": "Deutsch",

  // Learn tab
  "learn.heroTitle": "Häkeln lernen",
  "learn.heroBody":
    "Kurze Schritt-für-Schritt-Lektionen — vom Halten der Nadel bis zum Lesen einer Anleitung. Arbeite sie der Reihe nach durch oder pick dir heraus, was du brauchst.",
  "learn.minutes": "{n} Min.",
  "learn.stepOne": "{n} Schritt",
  "learn.stepOther": "{n} Schritte",
  "learn.upNext": "Als Nächstes",
  "learn.unavailable": "Diese Lektion ist nicht verfügbar.",
  "learn.doneTitle": "Das war die letzte Lektion!",
  "learn.doneBody":
    "Du hast die Grundlagen drauf. Starte ein Projekt und behalte diese Lektionen als Nachschlagewerk.",

  // Lesson levels + section blurbs
  "level.Basics": "Grundlagen",
  "level.Stitches": "Maschen",
  "level.Reference": "Nachschlagen",
  "level.blurb.Basics": "Fang hier an — Hände, erste Schlingen und Luftmaschen.",
  "level.blurb.Stitches": "Die Maschen, die du in fast jedem Projekt brauchst.",
  "level.blurb.Reference": "Praktische Anleitungen zum Immer-wieder-Nachschlagen.",
};
