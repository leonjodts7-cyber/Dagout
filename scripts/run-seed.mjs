/**
 * Seed listings via Supabase service role (leest .env.local).
 * Gebruik: node scripts/run-seed.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional when vars already exported
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY zijn vereist.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_EMAILS = [
  "info@dobber.life",
  "antwerpen@escapehunt.com",
  "info@volta.be",
  "info@dewimpe.be",
  "info@lasergame.be",
  "info@urbanescapemechelen.be",
  "info@klimavontuur.be",
  "info@wellnessbrugge.be",
  "info@paintballhasselt.be",
  "info@wijnkortrijk.be",
  "info@locked.be",
  "info@cookinglab.be",
];

const ROWS = [
  {
    name: "Dobber Kajakken",
    category: "Kajakken",
    region: "gent",
    city: "Gent",
    short_description: "Kajakken en SUP op de Blaarmeersen in Gent",
    full_description:
      "Beleef een onvergetelijke dag op het water met Dobber. Kies uit kajaks of SUP-boards en ontdek samen een prachtige route in Gent. Geschikt voor groepen van 10 tot 100 personen.",
    price_from: 25,
    min_persons: 10,
    max_persons: 100,
    duration: "3u",
    indoor_outdoor: "outdoor",
    website: "https://dobber.life",
    phone: "+32 9 123 45 67",
    contact_email: "info@dobber.life",
    featured: true,
  },
  {
    name: "Escape Hunt Antwerpen",
    category: "Escape Room",
    region: "antwerpen",
    city: "Antwerpen",
    short_description: "Meeslepende escape rooms in het hart van Antwerpen",
    full_description:
      "Los puzzels op als team onder tijdsdruk in onze professioneel ingerichte escape rooms. Meerdere themas beschikbaar voor groepen van 5 tot 40 personen.",
    price_from: 22,
    min_persons: 5,
    max_persons: 40,
    duration: "90min",
    indoor_outdoor: "indoor",
    website: "https://escapehunt.com/nl/antwerpen",
    phone: "+32 3 123 45 67",
    contact_email: "antwerpen@escapehunt.com",
    featured: true,
  },
  {
    name: "Volta Kookworkshop",
    category: "Kookworkshop",
    region: "gent",
    city: "Gent",
    short_description: "Kookworkshops in de iconische Volta in Gent",
    full_description:
      "Bereid samen een heerlijk driegangenmenu in de iconische Volta in Gent. Onze chef-koks begeleiden jullie door een culinaire ervaring die je niet snel vergeet.",
    price_from: 55,
    min_persons: 12,
    max_persons: 40,
    duration: "3.5u",
    indoor_outdoor: "indoor",
    website: "https://volta.be",
    phone: "+32 9 234 56 78",
    contact_email: "info@volta.be",
    featured: true,
  },
  {
    name: "De Wimpe Kanovaren",
    category: "Kajakken",
    region: "antwerpen",
    city: "Herenthout",
    short_description: "Kano- en kajaktochten op de Nete in de Kempen",
    full_description:
      "Vaar de Kleine of Grote Nete af per kano of kajak en geniet van de prachtige Kempische natuur. Combineerbaar met BBQ en GPS-avonturen.",
    price_from: 20,
    min_persons: 10,
    max_persons: 80,
    duration: "4u",
    indoor_outdoor: "outdoor",
    website: "https://dewimpe.be",
    phone: "+32 14 123 45 67",
    contact_email: "info@dewimpe.be",
    featured: false,
  },
  {
    name: "Lasergame Arena Brussel",
    category: "Lasergame",
    region: "brussel",
    city: "Brussel",
    short_description: "Spannende lasergame battles in een futuristisch decor",
    full_description:
      "Strijd in teams in onze state-of-the-art lasergame arena. Perfect voor teambuilding met een competitief element. Meerdere spelformats beschikbaar.",
    price_from: 18,
    min_persons: 8,
    max_persons: 50,
    duration: "2u",
    indoor_outdoor: "indoor",
    website: "https://lasergame.be",
    phone: "+32 2 345 67 89",
    contact_email: "info@lasergame.be",
    featured: false,
  },
  {
    name: "Urban Escape Mechelen",
    category: "Kajakken",
    region: "mechelen",
    city: "Mechelen",
    short_description: "Kanotochten op de Dijle door het centrum van Mechelen",
    full_description:
      "Ontdek Mechelen vanop het water. Vertrek vanuit de Kruidtuin voor een kanotocht op de Binnendijle.",
    price_from: 18,
    min_persons: 6,
    max_persons: 40,
    duration: "2u",
    indoor_outdoor: "outdoor",
    website: "https://urbanescapemechelen.be",
    phone: "+32 15 123 45 67",
    contact_email: "info@urbanescapemechelen.be",
    featured: false,
  },
  {
    name: "Klimavontuur Leuven",
    category: "Outdoor",
    region: "leuven",
    city: "Leuven",
    short_description: "Klimmen en outdoor avontuur in de omgeving van Leuven",
    full_description:
      "Daag jullie team uit met klimmen, touwbruggen en hoogteparcours. Onze instructeurs begeleiden jullie veilig door uitdagende outdoor activiteiten.",
    price_from: 30,
    min_persons: 8,
    max_persons: 30,
    duration: "3u",
    indoor_outdoor: "outdoor",
    website: "https://klimavontuur.be",
    phone: "+32 16 123 45 67",
    contact_email: "info@klimavontuur.be",
    featured: false,
  },
  {
    name: "Wellness Retreat Brugge",
    category: "Wellness",
    region: "brugge",
    city: "Brugge",
    short_description: "Ontspanning en verbinding in het romantische Brugge",
    full_description:
      "Geef jullie team een moment van rust en verbinding. Yoga, meditatie en wellness workshops in een prachtige omgeving in Brugge.",
    price_from: 45,
    min_persons: 8,
    max_persons: 25,
    duration: "3u",
    indoor_outdoor: "both",
    website: "https://wellnessbrugge.be",
    phone: "+32 50 123 45 67",
    contact_email: "info@wellnessbrugge.be",
    featured: false,
  },
  {
    name: "Paintball Arena Hasselt",
    category: "Outdoor",
    region: "hasselt",
    city: "Hasselt",
    short_description: "Spannende paintball battles in Hasselt",
    full_description:
      "Teamwork onder vuur. Onze professionele paintball arena biedt meerdere spelvelden en formats voor een onvergetelijke teambuilding dag.",
    price_from: 28,
    min_persons: 10,
    max_persons: 60,
    duration: "3u",
    indoor_outdoor: "outdoor",
    website: "https://paintballhasselt.be",
    phone: "+32 11 123 45 67",
    contact_email: "info@paintballhasselt.be",
    featured: false,
  },
  {
    name: "Wijnproeverij Kortrijk",
    category: "Kookworkshop",
    region: "kortrijk",
    city: "Kortrijk",
    short_description: "Professionele wijnproeverij met sommelier in Kortrijk",
    full_description:
      "Leer de kunst van het wijnproeven van een professionele sommelier. Een culturele en sociale teambuilding die perfect afsluit met een borrel.",
    price_from: 35,
    min_persons: 8,
    max_persons: 30,
    duration: "2.5u",
    indoor_outdoor: "indoor",
    website: "https://wijnkortrijk.be",
    phone: "+32 56 123 45 67",
    contact_email: "info@wijnkortrijk.be",
    featured: false,
  },
  {
    name: "Locked Escape Room Gent",
    category: "Escape Room",
    region: "gent",
    city: "Gent",
    short_description: "Immersieve escape rooms in Gent met unieke verhaallijnen",
    full_description:
      "Wordt ondergedompeld in een spannend verhaal en werk als team om te ontsnappen. Meerdere themas beschikbaar.",
    price_from: 20,
    min_persons: 4,
    max_persons: 30,
    duration: "75min",
    indoor_outdoor: "indoor",
    website: "https://locked.be",
    phone: "+32 9 345 67 89",
    contact_email: "info@locked.be",
    featured: false,
  },
  {
    name: "Cooking Lab Antwerpen",
    category: "Kookworkshop",
    region: "antwerpen",
    city: "Antwerpen",
    short_description: "Interactieve kookworkshops voor teams in Antwerpen",
    full_description:
      "Teams strijden in een MasterChef-formaat in ons professionele kooklabo. Inclusief degustatie van jullie eigen creaties.",
    price_from: 50,
    min_persons: 10,
    max_persons: 50,
    duration: "3u",
    indoor_outdoor: "indoor",
    website: "https://cookinglab.be",
    phone: "+32 3 456 78 90",
    contact_email: "info@cookinglab.be",
    featured: false,
  },
];

async function main() {
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) throw usersError;

  const owner =
    users.users.find((u) => u.email === "leon.jodts@gmail.com") ??
    users.users[0];

  if (!owner) {
    console.error("Geen auth user gevonden. Maak eerst een account aan in Supabase Auth.");
    process.exit(1);
  }

  console.log(`Seed user: ${owner.email} (${owner.id})`);

  const { error: deleteError } = await supabase
    .from("listings")
    .delete()
    .in("contact_email", SEED_EMAILS);

  if (deleteError) {
    console.warn("Delete warning:", deleteError.message);
  }

  const payload = ROWS.map((row) => ({
    ...row,
    user_id: owner.id,
    status: "active",
    image_urls: [],
    languages: ["Nederlands"],
    price_on_request: false,
  }));

  const { data, error } = await supabase.from("listings").insert(payload).select("id, name, featured");

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} listings.`);

  const { data: check } = await supabase
    .from("listings")
    .select("id, name, status, featured")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  console.table(check ?? []);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
