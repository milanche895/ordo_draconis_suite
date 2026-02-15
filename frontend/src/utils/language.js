export const getLanguageFromPath = (pathname) => {
  if (pathname.startsWith('/sr-latn')) {
    return { lang: 'sr', script: 'latn', locale: 'sr-latn' }
  } else if (pathname.startsWith('/en')) {
    return { lang: 'en', script: 'latn', locale: 'en' }
  } else {
    return { lang: 'sr', script: 'cyrl', locale: 'sr' }
  }
}

export const getPathPrefix = (locale) => {
  if (locale === 'sr-latn') return '/sr-latn'
  if (locale === 'en') return '/en'
  return '/sr'
}
