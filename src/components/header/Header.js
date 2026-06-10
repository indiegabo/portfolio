import React, {useContext} from "react";
import Headroom from "react-headroom";
import "./Header.scss";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import StyleContext from "../../contexts/StyleContext";
import {getPublicUrl} from "../../utils";
import {usePortfolio} from "../../hooks/usePortfolio";

function Header() {
  const {isDark} = useContext(StyleContext);
  const {
    locale,
    changeLanguage,
    supportedLocales,
    portfolio: {
      greeting,
      workExperiences,
      skillsSection,
      openSource,
      blogSection,
      talkSection,
      achievementSection,
      ui
    }
  } = usePortfolio();
  const viewExperience = workExperiences.display;
  const viewOpenSource = openSource.display;
  const viewSkills = skillsSection.display;
  const viewAchievement = achievementSection.display;
  const viewBlog = blogSection.display;
  const viewTalks = talkSection.display;

  return (
    <Headroom>
      <header className={isDark ? "dark-menu header" : "header"}>
        <a href={getPublicUrl("/")} className="logo">
          <img
            className="logo-image"
            src={require("../../assets/images/tag-indiegabo.png")}
            alt={greeting.username}
          />
        </a>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label
          className="menu-icon"
          htmlFor="menu-btn"
          style={{color: "white"}}
        >
          <span className={isDark ? "navicon navicon-dark" : "navicon"}></span>
        </label>
        <ul className={isDark ? "dark-menu menu" : "menu"}>
          {viewSkills && (
            <li>
              <a href="#skills">{ui.nav.skills}</a>
            </li>
          )}
          {viewExperience && (
            <li>
              <a href="#experience">{ui.nav.experience}</a>
            </li>
          )}
          {viewOpenSource && (
            <li>
              <a href="#opensource">{ui.nav.openSource}</a>
            </li>
          )}
          {viewAchievement && (
            <li>
              <a href="#achievements">{ui.nav.achievements}</a>
            </li>
          )}
          {viewBlog && (
            <li>
              <a href="#blogs">{ui.nav.blogs}</a>
            </li>
          )}
          {viewTalks && (
            <li>
              <a href="#talks">{ui.nav.talks}</a>
            </li>
          )}
          <li>
            <a href="#contact">{ui.nav.contact}</a>
          </li>
          <li className="header-control-item">
            <label className="language-switcher" htmlFor="language-switcher">
              <span className="language-switcher-label">
                {ui.controls.languageSwitcher}
              </span>
              <select
                id="language-switcher"
                className={
                  isDark ? "language-select dark-mode" : "language-select"
                }
                value={locale}
                onChange={event => changeLanguage(event.target.value)}
                aria-label={ui.controls.languageSwitcher}
              >
                {supportedLocales.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li className="header-control-item header-toggle-item">
            <ToggleSwitch />
          </li>
        </ul>
      </header>
    </Headroom>
  );
}
export default Header;
