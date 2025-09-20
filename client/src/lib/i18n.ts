import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import nlCommon from '../locales/nl/common.json';
import nlHeader from '../locales/nl/header.json';
import nlLanding from '../locales/nl/landing.json';
import nlForms from '../locales/nl/forms.json';
import nlLegal from '../locales/nl/legal.json';
import nlAuth from '../locales/nl/auth.json';

import enCommon from '../locales/en/common.json';
import enHeader from '../locales/en/header.json';
import enLanding from '../locales/en/landing.json';
import enForms from '../locales/en/forms.json';
import enLegal from '../locales/en/legal.json';
import enAuth from '../locales/en/auth.json';

import frCommon from '../locales/fr/common.json';
import frHeader from '../locales/fr/header.json';
import frLanding from '../locales/fr/landing.json';
import frForms from '../locales/fr/forms.json';
import frLegal from '../locales/fr/legal.json';
import frAuth from '../locales/fr/auth.json';

import deCommon from '../locales/de/common.json';
import deHeader from '../locales/de/header.json';
import deLanding from '../locales/de/landing.json';
import deForms from '../locales/de/forms.json';
import deLegal from '../locales/de/legal.json';
import deAuth from '../locales/de/auth.json';

import arCommon from '../locales/ar/common.json';
import arHeader from '../locales/ar/header.json';
import arLanding from '../locales/ar/landing.json';
import arForms from '../locales/ar/forms.json';
import arLegal from '../locales/ar/legal.json';
import arAuth from '../locales/ar/auth.json';

import trCommon from '../locales/tr/common.json';
import trHeader from '../locales/tr/header.json';
import trLanding from '../locales/tr/landing.json';
import trForms from '../locales/tr/forms.json';
import trLegal from '../locales/tr/legal.json';
import trAuth from '../locales/tr/auth.json';

const resources = {
  nl: {
    common: nlCommon,
    header: nlHeader,
    landing: nlLanding,
    forms: nlForms,
    legal: nlLegal,
    auth: nlAuth,
  },
  en: {
    common: enCommon,
    header: enHeader,
    landing: enLanding,
    forms: enForms,
    legal: enLegal,
    auth: enAuth,
  },
  fr: {
    common: frCommon,
    header: frHeader,
    landing: frLanding,
    forms: frForms,
    legal: frLegal,
    auth: frAuth,
  },
  de: {
    common: deCommon,
    header: deHeader,
    landing: deLanding,
    forms: deForms,
    legal: deLegal,
    auth: deAuth,
  },
  ar: {
    common: arCommon,
    header: arHeader,
    landing: arLanding,
    forms: arForms,
    legal: arLegal,
    auth: arAuth,
  },
  tr: {
    common: trCommon,
    header: trHeader,
    landing: trLanding,
    forms: trForms,
    legal: trLegal,
    auth: trAuth,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl', // Dutch as fallback
    lng: 'nl', // Default to Dutch
    
    // Language detection settings
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'janazapp-language',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Namespace settings
    defaultNS: 'common',
    ns: ['common', 'header', 'landing', 'forms', 'legal', 'auth'],

    // Debug in development
    debug: import.meta.env.DEV,
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Helper function to check if language is RTL
export const isRTL = (language: string): boolean => {
  return ['ar'].includes(language);
};

// Available languages with their display names and country codes
export const languages = [
  { code: 'nl', name: 'Nederlands', countryCode: 'NL' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'en', name: 'English', countryCode: 'EN' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'ar', name: 'العربية', countryCode: 'AR' },
  { code: 'tr', name: 'Türkçe', countryCode: 'TR' },
] as const;