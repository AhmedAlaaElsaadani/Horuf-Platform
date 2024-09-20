import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    detection: {
      order: [
        'localStorage',
        'cookie',
        'htmlTag',
        'querystring', 'sessionStorage', 'navigator', 'path', 'subdomain'],

      caches: ["cookie", "localStorage"],
    }
    , backend: {
      // http backend options
      loadPath: '/locale/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;