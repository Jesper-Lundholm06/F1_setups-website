import type { TrackMeta } from '../types'

/**
 * Registry of known F1 circuits used to turn a PDF filename into a clean
 * display name, flag and calendar order.
 *
 * This is an *enrichment* layer, not a hard requirement: the real source of
 * truth is whatever PDFs exist under /setups. If a track is not listed here it
 * still shows up — it just falls back to a name parsed from the filename.
 *
 * `aliases` are matched (case-insensitive substring) against the filename, so
 * order them roughly from most to least specific. To support a new circuit,
 * add a row here. The `round` values follow the 2026 calendar but are only used
 * for default sorting — edit freely.
 */
interface RegistryEntry extends TrackMeta {
  aliases: string[]
}

export const TRACK_REGISTRY: RegistryEntry[] = [
  { id: 'australia',    name: 'Australia',     country: 'Melbourne',      flag: '🇦🇺', round: 1,  aliases: ['australia', 'melbourne', 'albert park'] },
  { id: 'china',        name: 'China',         country: 'Shanghai',       flag: '🇨🇳', round: 2,  aliases: ['china', 'shanghai', 'chinese'] },
  { id: 'japan',        name: 'Japan',         country: 'Suzuka',         flag: '🇯🇵', round: 3,  aliases: ['japan', 'suzuka', 'japanese'] },
  { id: 'bahrain',      name: 'Bahrain',       country: 'Sakhir',         flag: '🇧🇭', round: 4,  aliases: ['bahrain', 'sakhir'] },
  { id: 'saudi-arabia', name: 'Saudi Arabia',  country: 'Jeddah',         flag: '🇸🇦', round: 5,  aliases: ['saudi', 'jeddah', 'arabia'] },
  { id: 'miami',        name: 'Miami',         country: 'United States',  flag: '🇺🇸', round: 6,  aliases: ['miami'] },
  { id: 'canada',       name: 'Canada',        country: 'Montreal',       flag: '🇨🇦', round: 7,  aliases: ['canada', 'montreal', 'canadian', 'gilles villeneuve'] },
  { id: 'monaco',       name: 'Monaco',        country: 'Monte Carlo',    flag: '🇲🇨', round: 8,  aliases: ['monaco', 'monte carlo'] },
  { id: 'spain',        name: 'Spain',         country: 'Barcelona',      flag: '🇪🇸', round: 9,  aliases: ['barcelona', 'catalunya', 'catalonia', 'spanish'] },
  { id: 'austria',      name: 'Austria',       country: 'Red Bull Ring',  flag: '🇦🇹', round: 10, aliases: ['austria', 'red bull ring', 'spielberg', 'austrian'] },
  { id: 'great-britain',name: 'Great Britain', country: 'Silverstone',    flag: '🇬🇧', round: 11, aliases: ['silverstone', 'britain', 'british', 'england', 'uk'] },
  { id: 'belgium',      name: 'Belgium',       country: 'Spa',            flag: '🇧🇪', round: 12, aliases: ['belgium', 'spa', 'francorchamps', 'belgian'] },
  { id: 'hungary',      name: 'Hungary',       country: 'Hungaroring',    flag: '🇭🇺', round: 13, aliases: ['hungary', 'hungaroring', 'budapest', 'hungarian'] },
  { id: 'netherlands',  name: 'Netherlands',   country: 'Zandvoort',      flag: '🇳🇱', round: 14, aliases: ['netherlands', 'zandvoort', 'dutch', 'holland'] },
  { id: 'italy',        name: 'Italy',         country: 'Monza',          flag: '🇮🇹', round: 15, aliases: ['monza', 'italy', 'italian'] },
  { id: 'madrid',       name: 'Madrid',        country: 'Spain',          flag: '🇪🇸', round: 16, aliases: ['madrid', 'madring', 'ifema'] },
  { id: 'azerbaijan',   name: 'Azerbaijan',    country: 'Baku',           flag: '🇦🇿', round: 17, aliases: ['azerbaijan', 'baku'] },
  { id: 'singapore',    name: 'Singapore',     country: 'Marina Bay',     flag: '🇸🇬', round: 18, aliases: ['singapore', 'marina bay'] },
  { id: 'usa',          name: 'United States', country: 'Austin (COTA)',  flag: '🇺🇸', round: 19, aliases: ['austin', 'cota', 'americas', 'united states', 'usa'] },
  { id: 'mexico',       name: 'Mexico',        country: 'Mexico City',    flag: '🇲🇽', round: 20, aliases: ['mexico', 'mexican', 'hermanos rodriguez'] },
  { id: 'brazil',       name: 'Brazil',        country: 'Interlagos',     flag: '🇧🇷', round: 21, aliases: ['brazil', 'brazilian', 'interlagos', 'sao paulo', 'são paulo'] },
  { id: 'las-vegas',    name: 'Las Vegas',     country: 'United States',  flag: '🇺🇸', round: 22, aliases: ['las vegas', 'vegas'] },
  { id: 'qatar',        name: 'Qatar',         country: 'Lusail',         flag: '🇶🇦', round: 23, aliases: ['qatar', 'lusail', 'losail'] },
  { id: 'abu-dhabi',    name: 'Abu Dhabi',     country: 'Yas Marina',     flag: '🇦🇪', round: 24, aliases: ['abu dhabi', 'yas marina', 'yas'] },

  // Circuits not on the 2026 calendar but kept so older packages still resolve.
  { id: 'imola',        name: 'Imola',         country: 'Emilia-Romagna', flag: '🇮🇹', round: 90, aliases: ['imola', 'emilia', 'romagna'] },
  { id: 'portugal',     name: 'Portugal',      country: 'Portimão',       flag: '🇵🇹', round: 91, aliases: ['portugal', 'portimao', 'portimão', 'algarve'] },
  { id: 'france',       name: 'France',        country: 'Paul Ricard',    flag: '🇫🇷', round: 92, aliases: ['france', 'french', 'paul ricard', 'castellet'] },
]

/** Round assigned to any track not present in the registry, so it sorts last. */
export const UNKNOWN_TRACK_ROUND = 999

/** Escape a string for safe use inside a RegExp. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Try to resolve a PDF filename to a known circuit.
 * Aliases are matched on word boundaries (so "spa" won't match "Spain" and
 * "uk" won't match random words). Returns the entry or null.
 */
export function matchTrack(fileName: string): RegistryEntry | null {
  const haystack = fileName.toLowerCase()
  for (const entry of TRACK_REGISTRY) {
    if (
      entry.aliases.some((alias) =>
        new RegExp(`\\b${escapeRegex(alias)}\\b`).test(haystack),
      )
    ) {
      return entry
    }
  }
  return null
}
