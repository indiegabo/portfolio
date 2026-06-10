import React from "react";
import {defaultLocale, getPortfolioData, supportedLocales} from "../portfolio";

const LanguageContext = React.createContext({
  locale: defaultLocale,
  changeLanguage: () => {},
  supportedLocales,
  portfolio: getPortfolioData(defaultLocale)
});

export const LanguageProvider = LanguageContext.Provider;

export default LanguageContext;
