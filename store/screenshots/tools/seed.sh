#!/bin/zsh
# Seeds the Loop simulator install with realistic demo data for App Store
# screenshots. Usage: ./seed.sh en|de
set -e

LANG_CODE="${1:-en}"
UDID=E7B14CF1-D7C1-4EBB-A522-2C9F1E3E8D84
CONTAINER="$(xcrun simctl get_app_container "$UDID" com.rzayev.loop-crochet data)"
EXP="$CONTAINER/Documents"
echo "documents: $EXP"

DB="$EXP/SQLite/loop.db"
if [[ ! -f "$DB" ]]; then
  echo "loop.db not found — launch the app once first" >&2
  exit 1
fi
echo "db: $DB"

# --- AsyncStorage: skip onboarding, force Plus (dev mode), set language ------
# async-storage v2 keeps the manifest under Library/Application Support/<bundle>;
# the Documents path is the legacy location it migrates from. Write both so it
# doesn't matter which one this build reads.
for AS_DIR in \
  "$CONTAINER/Library/Application Support/com.rzayev.loop-crochet/RCTAsyncLocalStorage_V1" \
  "$EXP/RCTAsyncLocalStorage_V1"
do
  mkdir -p "$AS_DIR"
  cat > "$AS_DIR/manifest.json" <<JSON
{"loop.onboarded.v1":"1","loop.migratedToSqlite.v1":"1","loop.dev.plus":"1","loop.lang.v1":"$LANG_CODE"}
JSON
done
echo "asyncstorage written"

# --- Demo rows --------------------------------------------------------------
if [[ "$LANG_CODE" == "de" ]]; then
  P1="Kuscheliger Zopfpullover"; P2="Granny-Square-Decke"; P3="Amigurumi-Häschen"
  P4="Wellen-Tuch"; P5="Babyschühchen"
  C1="Reihen Rückenteil"; C2="Reihen Ärmel"; C3="Zopf-Rapporte"
  C4="Fertige Squares"; C5="Runden dieses Square"; C6="Runden Körper"; C7="Wellen-Rapporte"; C8="Reihen"
  PN1="5 mm Nadel · Cascade 220 · Maschenprobe 18 M / 10 cm. Ärmel 2 cm kürzer als in der Anleitung."
  Y1="Altrosa"; Y2="Salbeigrün"; Y3="Naturweiß"; Y4="Terrakotta"; Y5="Petrol"
  Y6="Senfgelb"; Y7="Creme"; Y8="Pflaume"; Y9="Anthrazit"; Y10="Zartrosa"
  T1="Granny-Square-Decke"; T2="Zopfpullover"; T3="Amigurumi-Häschen"; T4="Wellen-Tuch"
else
  P1="Cozy Cable Sweater"; P2="Granny Square Blanket"; P3="Amigurumi Bunny"
  P4="Sunset Ripple Shawl"; P5="Baby Booties"
  C1="Body rows"; C2="Sleeve rows"; C3="Cable repeats"
  C4="Squares finished"; C5="Rounds this square"; C6="Body rounds"; C7="Ripple repeats"; C8="Rows"
  PN1="5 mm hook · Cascade 220 · gauge 18 sts / 4 in. Sleeves an inch shorter than the pattern."
  Y1="Dusty Rose"; Y2="Sage Green"; Y3="Oatmeal"; Y4="Terracotta"; Y5="Ocean Teal"
  Y6="Mustard"; Y7="Cream"; Y8="Plum"; Y9="Charcoal"; Y10="Blush"
  T1="Granny Square Blanket"; T2="Cable Sweater"; T3="Amigurumi Bunny"; T4="Sunset Ripple Shawl"
fi

sqlite3 "$DB" <<SQL
PRAGMA foreign_keys = ON;
DELETE FROM counters; DELETE FROM projects; DELETE FROM yarns; DELETE FROM patterns;

-- projects: ordered by updated_at DESC in the list
INSERT INTO projects (id,name,notes,photo_uri,status,created_at,updated_at) VALUES
 ('p1','$P1','$PN1',NULL,'active',1750000000000,1753600000000),
 ('p2','$P2','',NULL,'active',1749000000000,1753500000000),
 ('p3','$P3','',NULL,'active',1748000000000,1753400000000),
 ('p4','$P4','',NULL,'finished',1747000000000,1753300000000),
 ('p5','$P5','',NULL,'active',1746000000000,1753200000000);

-- counters: ordered by created_at DESC within a project
INSERT INTO counters (id,project_id,name,count,step,target,created_at,updated_at) VALUES
 ('c1','p1','$C1',84,1,120,1750000003000,1753600000000),
 ('c2','p1','$C2',46,1,60,1750000002000,1753590000000),
 ('c3','p1','$C3',12,1,NULL,1750000001000,1753580000000),
 ('c4','p2','$C4',37,1,63,1749000002000,1753500000000),
 ('c5','p2','$C5',4,1,NULL,1749000001000,1753490000000),
 ('c6','p3','$C6',22,1,28,1748000001000,1753400000000),
 ('c7','p4','$C7',48,1,48,1747000001000,1753300000000),
 ('c8','p5','$C8',14,2,NULL,1746000001000,1753200000000);

INSERT INTO yarns (id,brand,colorway,weight,fiber,skeins,yards_per_skein,color_hex,photo_uri,notes,created_at,updated_at) VALUES
 ('y1','Cascade 220','$Y1','worsted','100% merino wool',4,220,'#C97BA0',NULL,'',1740000000000,1753600000000),
 ('y2','Drops Paris','$Y2','aran','100% cotton',6,82,'#7C9070',NULL,'',1740000001000,1753590000000),
 ('y3','Rowan Softyak','$Y3','dk','wool / yak / nylon',3,148,'#E8D5A3',NULL,'',1740000002000,1753580000000),
 ('y4','Malabrigo Rios','$Y4','worsted','100% merino wool',5,210,'#C85D4D',NULL,'',1740000003000,1753570000000),
 ('y5','Wool-Ease','$Y5','worsted','80% acrylic / 20% wool',2,197,'#5B8A8F',NULL,'',1740000004000,1753560000000),
 ('y6','Drops Nepal','$Y6','aran','wool / alpaca',3,82,'#E0A458',NULL,'',1740000005000,1753550000000),
 ('y7','Paintbox Simply','$Y7','dk','100% acrylic',8,306,'#F2EDE4',NULL,'',1740000006000,1753540000000),
 ('y8','Malabrigo Sock','$Y8','fingering','100% superwash merino',2,440,'#8E6FA8',NULL,'',1740000007000,1753530000000),
 ('y9','Drops Alaska','$Y9','aran','100% wool',4,76,'#3B2F2A',NULL,'',1740000008000,1753520000000),
 ('y10','Sirdar Snuggly','$Y10','sport','nylon / acrylic',5,193,'#F6DAD1',NULL,'',1740000009000,1753510000000);

INSERT INTO patterns (id,title,craft,notes,file_uri,file_name,source_url,photo_uri,created_at,updated_at) VALUES
 ('pt1','$T1','crochet','',  'file:///patterns/granny.pdf','granny-square-blanket.pdf',NULL,NULL,1741000000000,1753600000000),
 ('pt2','$T2','knit','',     'file:///patterns/cable.pdf','cable-sweater-v2.pdf',NULL,NULL,1741000001000,1753590000000),
 ('pt3','$T3','crochet','',  NULL,NULL,'https://example.com/amigurumi-bunny',NULL,1741000002000,1753580000000),
 ('pt4','$T4','crochet','',  'file:///patterns/ripple.pdf','sunset-ripple-shawl.pdf',NULL,NULL,1741000003000,1753570000000);
SQL

echo "seeded ($LANG_CODE)"
