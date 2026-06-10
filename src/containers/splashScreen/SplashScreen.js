import React, {useContext} from "react";
import "./SplashScreen.css";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolio} from "../../hooks/usePortfolio";

export default function SplashScreen() {
  const {isDark} = useContext(StyleContext);
  const {
    portfolio: {greeting}
  } = usePortfolio();

  return (
    <div className={isDark ? "dark-mode splash-container" : "splash-container"}>
      <div className="splash-animation-container">
        <div className="splash-pulse-frame">
          <img
            className="splash-pulse-image"
            src={require("../../assets/images/gabo-with-bg.png")}
            alt={greeting.username}
          />
        </div>
      </div>
    </div>
  );
}
