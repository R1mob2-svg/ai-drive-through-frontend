import { useSearchParams } from "react-router-dom";

/**
 * UK-wide dynamic geo resolver for landing page copy.
 * - URL params: ?city=, ?location=, ?town=, ?area=
 * - Validates against a curated UK towns/cities list (case-insensitive)
 * - Sanitises input; rejects non-UK / scripts / numbers / nonsense
 * - Falls back to "UK"
 *
 * NOTE: No browser geolocation, no permission prompts, no hydration flash —
 * resolution is deterministic from the URL.
 */

export const GEO_FALLBACK = "UK";

// Curated UK towns/cities (England, Scotland, Wales, NI). Canonical casing.
// Extend as needed; covers all major Google Ads-targetable UK localities.
const UK_LOCALITIES = [
  // West Midlands focus
  "Birmingham","Walsall","Dudley","Wolverhampton","West Bromwich","Solihull",
  "Coventry","Sutton Coldfield","Stourbridge","Halesowen","Oldbury","Smethwick",
  "Wednesbury","Willenhall","Bilston","Tipton","Cannock","Lichfield","Tamworth",
  "Redditch","Bromsgrove","Kidderminster","Worcester","Stafford","Stoke-on-Trent",
  "Telford","Shrewsbury","Hereford","Warwick","Leamington Spa","Stratford-upon-Avon",
  "Nuneaton","Rugby",
  // England — major cities & towns
  "London","Manchester","Liverpool","Leeds","Sheffield","Bradford","Bristol",
  "Newcastle","Newcastle upon Tyne","Sunderland","Nottingham","Leicester","Derby",
  "Southampton","Portsmouth","Brighton","Hove","Plymouth","Exeter","Bournemouth",
  "Poole","Reading","Oxford","Cambridge","Milton Keynes","Luton","Watford",
  "Slough","Swindon","Gloucester","Cheltenham","Bath","Salisbury","Winchester",
  "Chichester","Guildford","Woking","Crawley","Maidstone","Canterbury","Dover",
  "Folkestone","Tunbridge Wells","Ashford","Chatham","Gillingham","Rochester",
  "Hastings","Eastbourne","Worthing","Basingstoke","Farnborough","Aldershot",
  "Bracknell","High Wycombe","Aylesbury","St Albans","Hemel Hempstead","Stevenage",
  "Hatfield","Welwyn Garden City","Chelmsford","Colchester","Southend-on-Sea",
  "Basildon","Romford","Ilford","Croydon","Bromley","Kingston upon Thames",
  "Sutton","Harrow","Enfield","Barnet","Hounslow","Ealing","Twickenham",
  "Richmond","Wimbledon","York","Hull","Kingston upon Hull","Middlesbrough",
  "Stockton-on-Tees","Darlington","Durham","Gateshead","South Shields","Hartlepool",
  "Scunthorpe","Grimsby","Lincoln","Doncaster","Rotherham","Barnsley","Wakefield",
  "Huddersfield","Halifax","Dewsbury","Keighley","Harrogate","Scarborough",
  "Blackpool","Preston","Blackburn","Burnley","Lancaster","Bolton","Bury",
  "Oldham","Rochdale","Stockport","Salford","Wigan","Warrington","St Helens",
  "Birkenhead","Wallasey","Southport","Chester","Crewe","Macclesfield",
  "Northampton","Kettering","Corby","Wellingborough","Peterborough","Norwich",
  "Ipswich","Great Yarmouth","Lowestoft","Bedford","Hertford","Truro","Penzance",
  "Torquay","Paignton","Weston-super-Mare","Yeovil","Taunton","Barnstaple",
  // Scotland
  "Glasgow","Edinburgh","Aberdeen","Dundee","Inverness","Stirling","Perth",
  "Paisley","East Kilbride","Livingston","Cumbernauld","Kirkcaldy","Ayr",
  "Falkirk","Dunfermline","Greenock",
  // Wales
  "Cardiff","Swansea","Newport","Wrexham","Bangor","St Davids","Aberystwyth",
  "Caerphilly","Bridgend","Merthyr Tydfil","Pontypridd","Llanelli","Neath",
  "Port Talbot","Rhyl","Colwyn Bay",
  // Northern Ireland
  "Belfast","Derry","Londonderry","Lisburn","Newry","Bangor","Armagh",
  "Ballymena","Coleraine","Newtownabbey","Craigavon","Antrim",
] as const;

// Lowercase canonical map (handles duplicates like Bangor — first wins).
const ALLOW_MAP: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const c of UK_LOCALITIES) {
    const k = c.toLowerCase();
    if (!m.has(k)) m.set(k, c);
  }
  return m;
})();

// Allowed chars: letters, spaces, hyphens, apostrophes, periods.
const SAFE_CHARS = /^[A-Za-z][A-Za-z\s.'-]{1,39}$/;

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/(\s|-)/)
    .map((part) => (/^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join("");
}

/**
 * Sanitise + validate a raw city/location param.
 * Returns canonical UK locality or null (caller should fall back to "UK").
 */
export function resolveCity(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Decode safely (handles %20 etc.)
  let cleaned: string;
  try { cleaned = decodeURIComponent(raw); } catch { cleaned = raw; }
  cleaned = cleaned.trim();
  if (!cleaned || cleaned.length > 40) return null;
  // Reject scripts, numbers-only, anything not matching safe charset
  if (!SAFE_CHARS.test(cleaned)) return null;
  if (/^\d+$/.test(cleaned)) return null;
  const canonical = ALLOW_MAP.get(cleaned.toLowerCase());
  if (canonical) return canonical;
  return null; // not a recognised UK locality → fallback
}

/**
 * Hook: returns the resolved UK location label, or "UK" fallback.
 * SSR-safe (deterministic from URL params, no GPS, no headers).
 *
 * Source priority:
 *   1. ?city=  2. ?location=  3. ?town=  4. ?area=
 *   5. fallback "UK"
 */
export function useGeoLocationLabel(): string {
  const [params] = useSearchParams();
  const raw =
    params.get("city") ??
    params.get("location") ??
    params.get("town") ??
    params.get("area");
  return resolveCity(raw) ?? GEO_FALLBACK;
}

// Back-compat export (legacy name) — now a UK-wide list rather than WM-only.
export const GEO_ALLOWLIST = UK_LOCALITIES;
