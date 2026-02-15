/**
 * Serbian Cyrillic <-> Latin transliteration.
 * When user types in one script, the other can be auto-filled so both are saved.
 */

const CYRL_TO_LATN = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z',
  и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c',
  ч: 'č', џ: 'dž', ш: 'š',
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Ђ: 'Đ', Е: 'E', Ж: 'Ž', З: 'Z',
  И: 'I', Ј: 'J', К: 'K', Л: 'L', Љ: 'Lj', М: 'M', Н: 'N', Њ: 'Nj', О: 'O',
  П: 'P', Р: 'R', С: 'S', Т: 'T', Ћ: 'Ć', У: 'U', Ф: 'F', Х: 'H', Ц: 'C',
  Ч: 'Č', Џ: 'Dž', Ш: 'Š',
}

// Latin -> Cyrillic: replace multi-char first (dž, lj, nj), then single chars.
function latnToCyrl(str) {
  if (!str || typeof str !== 'string') return ''
  let s = str
  const multi = [
    ['dž', 'џ'], ['Dž', 'Џ'], ['DŽ', 'Џ'],
    ['lj', 'љ'], ['Lj', 'Љ'], ['LJ', 'Љ'],
    ['nj', 'њ'], ['Nj', 'Њ'], ['NJ', 'Њ'],
  ]
  multi.forEach(([lat, cyr]) => {
    s = s.split(lat).join(cyr)
  })
  const single = {
    đ: 'ђ', ž: 'ж', ć: 'ћ', č: 'ч', š: 'ш',
    Đ: 'Ђ', Ž: 'Ж', Ć: 'Ћ', Č: 'Ч', Š: 'Ш',
    a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'е', z: 'з', i: 'и', j: 'ј',
    k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т',
    u: 'у', f: 'ф', h: 'х', c: 'ц',
    A: 'А', B: 'Б', V: 'В', G: 'Г', D: 'Д', E: 'Е', Z: 'З', I: 'И', J: 'Ј',
    K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О', P: 'П', R: 'Р', S: 'С', T: 'Т',
    U: 'У', F: 'Ф', H: 'Х', C: 'Ц',
  }
  return s.split('').map((ch) => single[ch] || ch).join('')
}

function cyrlToLatn(str) {
  if (!str || typeof str !== 'string') return ''
  // Two-char Cyrillic first (љ, њ, џ)
  let s = str
  const twoChar = [
    ['љ', 'lj'], ['Њ', 'Nj'], ['Љ', 'Lj'], ['њ', 'nj'], ['џ', 'dž'], ['Џ', 'Dž'],
  ]
  twoChar.forEach(([cyr, lat]) => {
    s = s.split(cyr).join(lat)
  })
  return s.split('').map((ch) => CYRL_TO_LATN[ch] ?? ch).join('')
}

export { cyrlToLatn, latnToCyrl }
