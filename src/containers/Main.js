import React, {useEffect, useState} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import StackProgress from "./skillProgress/skillProgress";
import WorkExperience from "./workExperience/WorkExperience";
import Projects from "./projects/Projects";
import StartupProject from "./StartupProjects/StartupProject";
import AssetProject from "./StartupProjects/AssetProject";
import Achievement from "./achievement/Achievement";
import Blogs from "./blogs/Blogs";
import Footer from "../components/footer/Footer";
import Talks from "./talks/Talks";
import Podcast from "./podcast/Podcast";
import Education from "./education/Education";
import ScrollToTopButton from "./topbutton/Top";
import Twitter from "./twitter-embed/twitter";
import Profile from "./profile/Profile";
import SplashScreen from "./splashScreen/SplashScreen";
import {
  defaultLocale,
  getPortfolioData,
  normalizeLocale,
  supportedLocales
} from "../portfolio";
import {StyleProvider} from "../contexts/StyleContext";
import {LanguageProvider} from "../contexts/LanguageContext";
import {useLocalStorage} from "../hooks/useLocalStorage";
import "./Main.scss";

const getBrowserLocale = () => {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  if (window.navigator.languages && window.navigator.languages.length > 0) {
    return window.navigator.languages[0];
  }

  return window.navigator.language || defaultLocale;
};

const updateMetaContent = (selector, value) => {
  const metaTag = document.querySelector(selector);

  if (metaTag) {
    metaTag.setAttribute("content", value);
  }
};

const Main = () => {
  const darkPref =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)") || {
          matches: false
        }
      : {matches: false};
  const prefersDarkMode =
    darkPref && typeof darkPref.matches === "boolean"
      ? darkPref.matches
      : false;
  const [isDark, setIsDark] = useLocalStorage("isDark", prefersDarkMode);
  const [locale, setLocale] = useLocalStorage(
    "locale",
    normalizeLocale(getBrowserLocale())
  );
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] =
    useState(true);
  const normalizedLocale = normalizeLocale(locale);
  const portfolio = getPortfolioData(normalizedLocale);

  useEffect(() => {
    if (portfolio.splashScreen.enabled) {
      const splashTimer = setTimeout(
        () => setIsShowingSplashAnimation(false),
        portfolio.splashScreen.duration
      );
      return () => {
        clearTimeout(splashTimer);
      };
    }
  }, [portfolio.splashScreen.duration, portfolio.splashScreen.enabled]);

  useEffect(() => {
    document.documentElement.lang = portfolio.pageMetadata.lang;
    document.title = portfolio.pageMetadata.title;

    updateMetaContent("meta[name='title']", portfolio.pageMetadata.title);
    updateMetaContent(
      "meta[name='description']",
      portfolio.pageMetadata.description
    );
    updateMetaContent(
      "meta[property='og:title']",
      portfolio.pageMetadata.title
    );
    updateMetaContent(
      "meta[property='og:description']",
      portfolio.pageMetadata.description
    );
    updateMetaContent(
      "meta[property='twitter:title']",
      portfolio.pageMetadata.title
    );
    updateMetaContent(
      "meta[property='twitter:description']",
      portfolio.pageMetadata.description
    );
  }, [portfolio.pageMetadata]);

  const changeTheme = () => {
    setIsDark(currentValue => !currentValue);
  };

  const changeLanguage = nextLocale => {
    setLocale(normalizeLocale(nextLocale));
  };

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{isDark, changeTheme}}>
        <LanguageProvider
          value={{
            locale: normalizedLocale,
            changeLanguage,
            supportedLocales,
            portfolio
          }}
        >
          {isShowingSplashAnimation && portfolio.splashScreen.enabled ? (
            <SplashScreen />
          ) : (
            <>
              <Header />
              <Greeting />
              <Skills />
              <StackProgress />
              <WorkExperience />
              <StartupProject />
              <AssetProject />
              <Projects />
              <Education />
              <Achievement />
              <Blogs />
              <Talks />
              <Twitter />
              <Podcast />
              <Profile />
              <Footer />
              <ScrollToTopButton />
            </>
          )}
        </LanguageProvider>
      </StyleProvider>
    </div>
  );
};

export default Main;
