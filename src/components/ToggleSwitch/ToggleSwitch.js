import React, {useContext} from "react";
import emoji from "react-easy-emoji";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolio} from "../../hooks/usePortfolio";
import "./ToggleSwitch.scss";

const ToggleSwitch = () => {
  const {isDark, changeTheme} = useContext(StyleContext);
  const {
    portfolio: {ui}
  } = usePortfolio();

  return (
    <label className="switch" aria-label={ui.controls.themeToggle}>
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => {
          changeTheme();
        }}
        aria-label={ui.controls.themeToggle}
      />
      <span className="slider round">
        <span className="emoji">{isDark ? emoji("🌜") : emoji("☀️")}</span>
      </span>
    </label>
  );
};
export default ToggleSwitch;
