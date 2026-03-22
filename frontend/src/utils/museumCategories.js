/**
 * Museum item categories: canonical value stored in DB is Serbian Cyrillic.
 * Labels vary by UI locale (sr / sr-latn / en).
 */

import { cyrlToLatn } from './transliterate'

const ENTRIES = [
  {
    value: 'Оружје',
    en: 'Weapons',
  },
  {
    value: 'Оклоп',
    en: 'Armor',
  },
  {
    value: 'Одевни предмет/ одора',
    en: 'Garment / attire',
  },
  {
    value: 'Документи',
    en: 'Documents',
  },
  {
    value: 'Уметност',
    en: 'Art',
  },
  {
    value: 'Остало',
    en: 'Other',
  },
]

/** @type {Record<string, { value: string, en: string }>} */
const BY_VALUE = Object.fromEntries(ENTRIES.map((e) => [e.value, e]))

export const MUSEUM_CATEGORY_OPTIONS = ENTRIES

/**
 * @param {'sr' | 'sr-latn' | 'en'} locale
 */
export function getMuseumCategoryLabel(storedValue, locale) {
  if (!storedValue) return ''
  const known = BY_VALUE[storedValue]
  if (locale === 'en') {
    return known?.en ?? cyrlToLatn(storedValue)
  }
  if (locale === 'sr-latn') {
    return cyrlToLatn(storedValue)
  }
  return storedValue
}
