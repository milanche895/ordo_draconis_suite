import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  sr: {
    translation: {
      nav: {
        home: 'Почетна',
        festival: 'Штит фестивал',
        museum: 'Музеј',
        workshops: 'Раднице',
        gallery: 'Галерија',
        news: 'Вести',
        shop: 'Продавница',
        contact: 'Контакт',
        admin: 'Админ',
      },
      home: {
        heroTitle: 'Добродошли у Ордо Драконис',
        heroSubtitle: 'Откријте магију средњег века',
        planVisit: 'Планирај посету',
        viewActivities: 'Погледај активности',
        open: 'Отворено',
        closed: 'Затворено',
      },
      common: {
        readMore: 'Прочитај више',
        learnMore: 'Сазнај више',
        back: 'Назад',
        save: 'Сачувај',
        cancel: 'Откажи',
        delete: 'Обриши',
        edit: 'Измени',
        create: 'Креирај',
      },
    },
  },
  'sr-latn': {
    translation: {
      nav: {
        home: 'Početna',
        festival: 'Štit festival',
        museum: 'Muzej',
        workshops: 'Radnice',
        gallery: 'Galerija',
        news: 'Vesti',
        shop: 'Prodavnica',
        contact: 'Kontakt',
        admin: 'Admin',
      },
      home: {
        heroTitle: 'Dobrodošli u Ordo Draconis',
        heroSubtitle: 'Otkrijte magiju srednjeg veka',
        planVisit: 'Planiraj posetu',
        viewActivities: 'Pogledaj aktivnosti',
        open: 'Otvoreno',
        closed: 'Zatvoreno',
      },
      common: {
        readMore: 'Pročitaj više',
        learnMore: 'Saznaj više',
        back: 'Nazad',
        save: 'Sačuvaj',
        cancel: 'Otkaži',
        delete: 'Obriši',
        edit: 'Izmeni',
        create: 'Kreiraj',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        festival: 'Shield Festival',
        museum: 'Museum',
        workshops: 'Workshops',
        gallery: 'Gallery',
        news: 'News',
        shop: 'Shop',
        contact: 'Contact',
        admin: 'Admin',
      },
      home: {
        heroTitle: 'Welcome to Ordo Draconis',
        heroSubtitle: 'Discover the magic of the Middle Ages',
        planVisit: 'Plan Visit',
        viewActivities: 'View Activities',
        open: 'Open',
        closed: 'Closed',
      },
      common: {
        readMore: 'Read More',
        learnMore: 'Learn More',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sr',
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
