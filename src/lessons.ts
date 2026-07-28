/**
 * Learn — a small, offline crochet course.
 *
 * Structural fields (id, emoji, level, minutes) live once in META; the
 * translatable text lives in CONTENT, keyed by language then lesson id. This
 * keeps the ordering/metadata in one place while every string is localized.
 * Lessons are ordered as a path: hold → slip knot → chain → single crochet →
 * finishing, plus a couple of everyday-reference lessons.
 */
import { useLanguage, type Lang } from "./i18n";

export type Level = "Basics" | "Stitches" | "Reference";

export type Step = {
  /** Short imperative heading. */
  title: string;
  /** One or two plain-language sentences. */
  body: string;
  /** Optional gentle tip shown in a highlighted callout. */
  tip?: string;
};

type LessonMeta = {
  id: string;
  emoji: string;
  level: Level;
  /** Rough time to work through it. */
  minutes: number;
};

type LessonContent = {
  title: string;
  /** One-line teaser for the list. */
  summary: string;
  /** Longer intro shown at the top of the lesson. */
  intro: string;
  steps: Step[];
};

export type Lesson = LessonMeta & LessonContent;

const META: LessonMeta[] = [
  { id: "hold-hook-yarn", emoji: "🖐️", level: "Basics", minutes: 4 },
  { id: "slip-knot", emoji: "🪢", level: "Basics", minutes: 3 },
  { id: "chain-stitch", emoji: "⛓️", level: "Basics", minutes: 5 },
  { id: "single-crochet", emoji: "🧶", level: "Stitches", minutes: 7 },
  { id: "double-crochet", emoji: "🧵", level: "Stitches", minutes: 7 },
  { id: "fasten-off", emoji: "✂️", level: "Stitches", minutes: 4 },
  { id: "abbreviations", emoji: "🔤", level: "Reference", minutes: 5 },
  { id: "hooks-yarn-guide", emoji: "📏", level: "Reference", minutes: 5 },
];

const EN: Record<string, LessonContent> = {
  "hold-hook-yarn": {
    title: "Holding the hook & yarn",
    summary: "Get comfortable before you make a single stitch.",
    intro:
      "Before any stitch, your hands need a comfortable, repeatable way to hold the hook and control the yarn. There's no single 'right' way — the goal is even tension and a relaxed grip you can keep up for a while.",
    steps: [
      {
        title: "Hold the hook",
        body: "Pick whichever feels natural: the 'pencil' grip (hold it like a pencil) or the 'knife' grip (hold it like a table knife, palm over the top). Most people settle on one within a day.",
        tip: "If your hand cramps, you're squeezing too hard. Loosen up — the hook does the work.",
      },
      {
        title: "Thread the working yarn",
        body: "With your non-hook hand, weave the yarn coming from the ball over your index finger, under the middle two, and over the pinky. This creates light, steady resistance.",
      },
      {
        title: "Find your tension",
        body: "Raise your index finger slightly to feed yarn to the hook. The yarn should glide but not flop loose. This 'tension hand' is what keeps your stitches even.",
        tip: "Even tension matters more than tight tension. Aim for consistent, not tiny.",
      },
    ],
  },
  "slip-knot": {
    title: "The slip knot",
    summary: "Every project starts with this adjustable first loop.",
    intro:
      "The slip knot anchors your yarn to the hook and is the very first loop of every project. It's adjustable, so you can snug it up once it's on the hook.",
    steps: [
      {
        title: "Make a loop",
        body: "Leave a tail about 15 cm (6 in) long. Lay the yarn into a loop so the working strand (the one going to the ball) crosses over the tail.",
      },
      {
        title: "Pull a loop through",
        body: "Reach through the loop and grab the working strand, pulling it partway through to form a new loop. Don't pull it all the way — you want a loop, not a knot.",
      },
      {
        title: "Slide it onto the hook",
        body: "Place that loop onto your hook and gently pull the tail to tighten it around the shaft. It should be snug but still slide freely.",
        tip: "Too tight and your first stitches fight you. Leave it loose enough to move.",
      },
    ],
  },
  "chain-stitch": {
    title: "The chain stitch (ch)",
    summary: "The foundation row nearly every pattern begins with.",
    intro:
      "The chain is the foundation most projects are built on. It's also the best way to practise 'yarn over, pull through' — the motion at the heart of almost every crochet stitch.",
    steps: [
      {
        title: "Yarn over",
        body: "With the slip knot on your hook, wrap the working yarn over the hook from back to front. This is called a 'yarn over' (yo).",
      },
      {
        title: "Pull through",
        body: "Catch that wrapped yarn in the hook's mouth and draw it back through the loop already on your hook. You've made one chain.",
      },
      {
        title: "Repeat evenly",
        body: "Yarn over and pull through again and again. Each pull-through makes one more chain. Try for 15–20 and keep them the same size.",
        tip: "The loop on the hook is never counted as a chain. Count the little 'V's below it.",
      },
    ],
  },
  "single-crochet": {
    title: "Single crochet (sc)",
    summary: "The short, sturdy stitch behind amigurumi and dishcloths.",
    intro:
      "Single crochet (UK: double crochet) is the shortest, densest basic stitch. Master it and you can already make dishcloths, coasters, and the tight fabric used for amigurumi toys.",
    steps: [
      {
        title: "Insert the hook",
        body: "Working into your chain, skip the first chain and insert the hook under the two top loops of the next chain.",
      },
      {
        title: "Yarn over, pull up a loop",
        body: "Yarn over and pull the yarn back through the chain only. You now have two loops on your hook.",
      },
      {
        title: "Yarn over, pull through both",
        body: "Yarn over again and pull through both loops on the hook. That completes one single crochet — one loop remains.",
        tip: "Two loops → one loop. That 'close the stitch' step is the same idea in every stitch.",
      },
      {
        title: "Work across and turn",
        body: "Repeat into each chain to the end. To start a new row, chain 1, turn your work, and single crochet across again.",
      },
    ],
  },
  "double-crochet": {
    title: "Double crochet (dc)",
    summary: "A taller stitch that grows fast and drapes softly.",
    intro:
      "Double crochet (UK: treble) is about twice the height of single crochet, so your work grows quickly and the fabric is softer and more open — perfect for blankets and scarves.",
    steps: [
      {
        title: "Yarn over first",
        body: "Before inserting the hook, yarn over once. This extra wrap is what makes the stitch tall.",
      },
      {
        title: "Insert and pull up a loop",
        body: "Insert the hook into the stitch, yarn over, and pull up a loop. You now have three loops on the hook.",
      },
      {
        title: "Pull through two",
        body: "Yarn over and pull through the first two loops. Two loops remain.",
      },
      {
        title: "Pull through two again",
        body: "Yarn over once more and pull through the last two loops. One loop remains — that's a finished double crochet.",
        tip: "New rows of dc usually start with 'chain 3', which counts as the first stitch.",
      },
    ],
  },
  "fasten-off": {
    title: "Fastening off & weaving in",
    summary: "Finish a project so it never comes undone.",
    intro:
      "When your project is done, you need to lock the last stitch and hide the loose ends so nothing unravels. This is the tidy, satisfying final step.",
    steps: [
      {
        title: "Cut the yarn",
        body: "Cut the working yarn, leaving a tail about 15 cm (6 in) long — enough to weave in comfortably.",
      },
      {
        title: "Pull it through",
        body: "Yarn over and pull the cut tail all the way through the last loop on your hook. Give it a gentle tug to lock the knot.",
      },
      {
        title: "Weave in the ends",
        body: "Thread the tail onto a yarn needle and run it back and forth through several stitches on the wrong side, changing direction once. Trim the excess.",
        tip: "Changing direction while weaving is what stops the end from popping back out with use.",
      },
    ],
  },
  abbreviations: {
    title: "Reading a pattern",
    summary: "Decode the shorthand and asterisks in written patterns.",
    intro:
      "Written patterns look like code at first. Once you know the common abbreviations and how repeats are written, most patterns become readable. Note: US and UK terms differ — always check which a pattern uses.",
    steps: [
      {
        title: "Common abbreviations (US)",
        body: "ch = chain · sc = single crochet · dc = double crochet · hdc = half double · sl st = slip stitch · st(s) = stitch(es) · yo = yarn over · rep = repeat · sk = skip.",
      },
      {
        title: "Increases & decreases",
        body: "inc = increase (two stitches in one) · dec = decrease (combine two into one) · sc2tog = single crochet two stitches together, a common way to decrease.",
      },
      {
        title: "Reading repeats",
        body: "Asterisks and brackets mark repeats. '*sc, dc; rep from * 5 times' means work that little sequence six times total. '(sc, ch1) x3' means do what's in the brackets three times.",
        tip: "The number after a row, like '(12)', is the stitch count. Recount at the end of the row to catch mistakes early.",
      },
      {
        title: "US vs UK terms",
        body: "The same word can mean different stitches. US 'single crochet' is UK 'double crochet'. If a pattern doesn't say, US terms are the most common online.",
      },
    ],
  },
  "hooks-yarn-guide": {
    title: "Choosing hooks & yarn",
    summary: "Match your hook to your yarn — and why gauge matters.",
    intro:
      "The hook and yarn you pick decide how your fabric feels. Getting them in the right ballpark saves a lot of frustration, especially on your first few projects.",
    steps: [
      {
        title: "Start with a medium weight",
        body: "For learning, choose a smooth, light-colored 'worsted' / weight-4 yarn. Dark or fuzzy yarn hides your stitches and makes mistakes hard to see.",
        tip: "Light, smooth cotton or acrylic is the friendliest yarn to learn on.",
      },
      {
        title: "Match the hook",
        body: "Every yarn label suggests a hook size. For worsted yarn that's usually a 5.0–5.5 mm (US H-8 / I-9) hook. When in doubt, follow the label.",
      },
      {
        title: "Understand gauge",
        body: "Gauge is how many stitches fit in a set width (e.g. 4 inches). Patterns list a target gauge so your finished size matches. If yours is off, go up a hook size for looser, down for tighter.",
        tip: "For scarves and blankets, exact gauge rarely matters. For anything that must fit, make a small gauge swatch first.",
      },
    ],
  },
};

const DE: Record<string, LessonContent> = {
  "hold-hook-yarn": {
    title: "Nadel & Garn halten",
    summary: "Mach es dir bequem, bevor du die erste Masche machst.",
    intro:
      "Vor jeder Masche brauchen deine Hände eine bequeme, wiederholbare Art, die Nadel zu halten und das Garn zu führen. Es gibt kein einziges 'richtig' — es geht um gleichmäßige Spannung und einen entspannten Griff, den du länger durchhältst.",
    steps: [
      {
        title: "Die Nadel halten",
        body: "Nimm, was sich natürlich anfühlt: den 'Stift'-Griff (wie einen Bleistift) oder den 'Messer'-Griff (wie ein Tischmesser, Handfläche oben). Die meisten finden ihren Griff innerhalb eines Tages.",
        tip: "Wenn deine Hand verkrampft, drückst du zu fest. Locker lassen — die Nadel macht die Arbeit.",
      },
      {
        title: "Das Arbeitsgarn führen",
        body: "Lege das Garn vom Knäuel mit der freien Hand über den Zeigefinger, unter die beiden mittleren und über den kleinen Finger. Das erzeugt leichten, gleichmäßigen Widerstand.",
      },
      {
        title: "Deine Spannung finden",
        body: "Hebe den Zeigefinger leicht an, um der Nadel Garn zuzuführen. Das Garn soll gleiten, aber nicht lose durchhängen. Diese 'Spannhand' hält deine Maschen gleichmäßig.",
        tip: "Gleichmäßige Spannung ist wichtiger als feste Spannung. Ziel ist gleichmäßig, nicht winzig.",
      },
    ],
  },
  "slip-knot": {
    title: "Die Anfangsschlinge",
    summary: "Jedes Projekt beginnt mit dieser verstellbaren ersten Schlinge.",
    intro:
      "Die Anfangsschlinge verankert dein Garn an der Nadel und ist die allererste Schlinge jedes Projekts. Sie ist verstellbar, du kannst sie also festziehen, sobald sie auf der Nadel ist.",
    steps: [
      {
        title: "Eine Schlinge legen",
        body: "Lass ein Ende von etwa 15 cm übrig. Lege das Garn zu einer Schlinge, sodass der Arbeitsfaden (der zum Knäuel führt) über das Ende kreuzt.",
      },
      {
        title: "Eine Schlinge durchziehen",
        body: "Greif durch die Schlinge, fass den Arbeitsfaden und zieh ihn ein Stück durch, sodass eine neue Schlinge entsteht. Zieh ihn nicht ganz durch — du willst eine Schlinge, keinen Knoten.",
      },
      {
        title: "Auf die Nadel schieben",
        body: "Leg diese Schlinge auf deine Nadel und zieh sanft am Ende, um sie um den Schaft zu straffen. Sie sollte fest sitzen, aber noch frei gleiten.",
        tip: "Zu fest, und deine ersten Maschen wehren sich. Lass sie locker genug zum Gleiten.",
      },
    ],
  },
  "chain-stitch": {
    title: "Die Luftmasche (Lm)",
    summary: "Die Grundreihe, mit der fast jede Anleitung beginnt.",
    intro:
      "Die Luftmaschenkette ist die Grundlage der meisten Projekte. Sie ist auch die beste Übung für 'Umschlag, durchziehen' — die Bewegung im Herzen fast jeder Häkelmasche.",
    steps: [
      {
        title: "Umschlag machen",
        body: "Mit der Anfangsschlinge auf der Nadel legst du das Arbeitsgarn von hinten nach vorne über die Nadel. Das nennt man 'Umschlag' (U).",
      },
      {
        title: "Durchziehen",
        body: "Fang das umgeschlagene Garn mit dem Nadelkopf und zieh es zurück durch die Schlinge, die schon auf deiner Nadel ist. Du hast eine Luftmasche gemacht.",
      },
      {
        title: "Gleichmäßig wiederholen",
        body: "Umschlag und durchziehen, immer wieder. Jedes Durchziehen macht eine weitere Luftmasche. Versuch 15–20 und halte sie gleich groß.",
        tip: "Die Schlinge auf der Nadel zählt nie als Luftmasche. Zähl die kleinen 'V' darunter.",
      },
    ],
  },
  "single-crochet": {
    title: "Feste Masche (fM)",
    summary: "Die kurze, feste Masche hinter Amigurumi und Spültüchern.",
    intro:
      "Die feste Masche ist die kürzeste, dichteste Grundmasche (im Englischen 'single crochet', UK 'double crochet'). Beherrschst du sie, kannst du schon Spültücher, Untersetzer und das dichte Gewebe für Amigurumi-Figuren machen.",
    steps: [
      {
        title: "Nadel einstechen",
        body: "In deiner Luftmaschenkette überspringst du die erste Luftmasche und stichst unter die beiden oberen Schlingen der nächsten Luftmasche ein.",
      },
      {
        title: "Umschlag, Schlinge holen",
        body: "Mach einen Umschlag und zieh das Garn nur durch die Luftmasche zurück. Du hast jetzt zwei Schlingen auf der Nadel.",
      },
      {
        title: "Umschlag, durch beide ziehen",
        body: "Mach noch einen Umschlag und zieh durch beide Schlingen auf der Nadel. Das schließt eine feste Masche ab — eine Schlinge bleibt.",
        tip: "Zwei Schlingen → eine Schlinge. Dieses 'Masche schließen' ist in jeder Masche dieselbe Idee.",
      },
      {
        title: "Reihe arbeiten und wenden",
        body: "Wiederhole in jeder Luftmasche bis zum Ende. Für eine neue Reihe eine Luftmasche häkeln, die Arbeit wenden und wieder feste Maschen häkeln.",
      },
    ],
  },
  "double-crochet": {
    title: "Stäbchen (Stb)",
    summary: "Eine höhere Masche, die schnell wächst und weich fällt.",
    intro:
      "Das Stäbchen (im Englischen 'double crochet', UK 'treble') ist etwa doppelt so hoch wie eine feste Masche, sodass deine Arbeit schnell wächst und das Gewebe weicher und offener ist — ideal für Decken und Schals.",
    steps: [
      {
        title: "Zuerst ein Umschlag",
        body: "Bevor du die Nadel einstichst, machst du einen Umschlag. Dieser zusätzliche Umschlag macht die Masche hoch.",
      },
      {
        title: "Einstechen und Schlinge holen",
        body: "Stich die Nadel in die Masche, mach einen Umschlag und hol eine Schlinge. Du hast jetzt drei Schlingen auf der Nadel.",
      },
      {
        title: "Durch zwei ziehen",
        body: "Umschlag und durch die ersten zwei Schlingen ziehen. Zwei Schlingen bleiben.",
      },
      {
        title: "Nochmal durch zwei ziehen",
        body: "Mach noch einen Umschlag und zieh durch die letzten zwei Schlingen. Eine Schlinge bleibt — das ist ein fertiges Stäbchen.",
        tip: "Neue Stäbchen-Reihen beginnen meist mit '3 Luftmaschen', die als erste Masche zählen.",
      },
    ],
  },
  "fasten-off": {
    title: "Abketten & Fäden vernähen",
    summary: "Beende ein Projekt so, dass sich nie etwas auflöst.",
    intro:
      "Wenn dein Projekt fertig ist, musst du die letzte Masche sichern und die losen Enden verstecken, damit sich nichts auftrennt. Das ist der ordentliche, befriedigende letzte Schritt.",
    steps: [
      {
        title: "Garn abschneiden",
        body: "Schneide das Arbeitsgarn ab und lass ein Ende von etwa 15 cm — genug, um bequem zu vernähen.",
      },
      {
        title: "Durchziehen",
        body: "Mach einen Umschlag und zieh das abgeschnittene Ende ganz durch die letzte Schlinge auf der Nadel. Zieh sanft an, um den Knoten zu sichern.",
      },
      {
        title: "Enden vernähen",
        body: "Fädle das Ende auf eine Wollnadel und führe es auf der linken Seite mehrmals hin und her durch mehrere Maschen, wechsle dabei einmal die Richtung. Schneide den Rest ab.",
        tip: "Der Richtungswechsel beim Vernähen verhindert, dass das Ende beim Tragen wieder herausrutscht.",
      },
    ],
  },
  abbreviations: {
    title: "Eine Anleitung lesen",
    summary: "Entschlüssle Abkürzungen und Sternchen in Anleitungen.",
    intro:
      "Anleitungen sehen anfangs aus wie Code. Sobald du die gängigen Abkürzungen und die Schreibweise von Wiederholungen kennst, werden die meisten lesbar. Hinweis: US- und UK-Begriffe unterscheiden sich — prüfe immer, welche eine Anleitung verwendet.",
    steps: [
      {
        title: "Gängige Abkürzungen (DE)",
        body: "Lm = Luftmasche · fM = feste Masche · Stb = Stäbchen · hStb = halbes Stäbchen · Km = Kettmasche · M = Masche(n) · U = Umschlag · Wdh = Wiederholung · übg = überspringen.",
      },
      {
        title: "Zunahmen & Abnahmen",
        body: "zun = Zunahme (zwei Maschen in eine) · abn = Abnahme (zwei zu einer zusammen) · 2 fM zusammen = zwei feste Maschen zusammenhäkeln, eine gängige Abnahme.",
      },
      {
        title: "Wiederholungen lesen",
        body: "Sternchen und Klammern markieren Wiederholungen. '*fM, Stb; ab * 5-mal wdh' heißt, die kleine Folge insgesamt sechsmal arbeiten. '(fM, 1 Lm) x3' heißt, das in Klammern dreimal machen.",
        tip: "Die Zahl nach einer Reihe, z. B. '(12)', ist die Maschenzahl. Zähl am Reihenende nach, um Fehler früh zu finden.",
      },
      {
        title: "US- vs. UK-Begriffe",
        body: "Dasselbe Wort kann verschiedene Maschen meinen. US 'single crochet' ist UK 'double crochet'. Sagt eine Anleitung nichts, sind online US-Begriffe am häufigsten.",
      },
    ],
  },
  "hooks-yarn-guide": {
    title: "Nadel & Garn wählen",
    summary: "Passe die Nadel zum Garn — und warum die Maschenprobe zählt.",
    intro:
      "Nadel und Garn entscheiden, wie sich dein Gewebe anfühlt. Wenn du sie halbwegs passend wählst, ersparst du dir viel Frust, besonders bei deinen ersten Projekten.",
    steps: [
      {
        title: "Mit mittlerer Stärke starten",
        body: "Zum Lernen wähl ein glattes, helles 'worsted' / Stärke-4-Garn. Dunkles oder flauschiges Garn verdeckt deine Maschen und macht Fehler schwer sichtbar.",
        tip: "Helle, glatte Baumwolle oder Acryl ist das freundlichste Garn zum Lernen.",
      },
      {
        title: "Die Nadel anpassen",
        body: "Jede Banderole schlägt eine Nadelstärke vor. Für worsted-Garn ist das meist eine 5,0–5,5 mm Nadel. Im Zweifel folg der Banderole.",
      },
      {
        title: "Maschenprobe verstehen",
        body: "Die Maschenprobe ist, wie viele Maschen in eine feste Breite passen (z. B. 10 cm). Anleitungen geben eine Ziel-Maschenprobe an, damit deine Größe stimmt. Passt deine nicht, nimm eine Nadel größer für lockerer, kleiner für fester.",
        tip: "Bei Schals und Decken ist die genaue Maschenprobe selten wichtig. Bei allem, was passen muss, häkle zuerst eine kleine Probe.",
      },
    ],
  },
};

const CONTENT: Record<Lang, Record<string, LessonContent>> = { en: EN, de: DE };

export const LESSON_LEVELS: Level[] = ["Basics", "Stitches", "Reference"];

/** Build the full lesson list for a language (metadata + localized text). */
export function getLessons(lang: Lang): Lesson[] {
  const dict = CONTENT[lang] ?? CONTENT.en;
  return META.map((m) => ({ ...m, ...dict[m.id] }));
}

export function getLesson(lang: Lang, id: string): Lesson | undefined {
  const dict = CONTENT[lang] ?? CONTENT.en;
  const meta = META.find((m) => m.id === id);
  return meta ? { ...meta, ...dict[id] } : undefined;
}

/** Reactive hooks for components. */
export function useLessons(): Lesson[] {
  const lang = useLanguage((s) => s.lang);
  return getLessons(lang);
}

export function useLesson(id: string): Lesson | undefined {
  const lang = useLanguage((s) => s.lang);
  return getLesson(lang, id);
}
