import React, {useContext} from "react";
import "./Footer.scss";
import {Fade} from "../../lib/reveal";
import emoji from "react-easy-emoji";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolio} from "../../hooks/usePortfolio";

export default function Footer() {
  const {isDark} = useContext(StyleContext);
  const {
    portfolio: {ui}
  } = usePortfolio();

  return (
    <Fade bottom duration={1000} distance="5px">
      <div className="footer-div">
        <p className={isDark ? "dark-mode footer-text" : "footer-text"}>
          {emoji(ui.footer.originalMadeWith)}
        </p>
        <p className={isDark ? "dark-mode footer-text" : "footer-text"}>
          {ui.footer.themeBy}{" "}
          <a href="https://github.com/saadpasta/developerFolio">
            developerFolio
          </a>{" "}
          | {ui.footer.editedBy}
        </p>
      </div>
    </Fade>
  );
}
