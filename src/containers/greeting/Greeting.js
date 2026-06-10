import React, {useContext} from "react";
import {Fade} from "../../lib/reveal";
import emoji from "react-easy-emoji";
import "./Greeting.scss";
// import landingPerson from "../../assets/lottie/landingPerson";
// import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";
import StyleContext from "../../contexts/StyleContext";
import {usePortfolio} from "../../hooks/usePortfolio";
import {getPublicUrl} from "../../utils";

export default function Greeting() {
  const {isDark} = useContext(StyleContext);
  const {
    portfolio: {greeting, resume, ui}
  } = usePortfolio();

  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    <Fade bottom duration={1000} distance="40px">
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1
                className={isDark ? "dark-mode greeting-text" : "greeting-text"}
              >
                {" "}
                {greeting.title}{" "}
                <span className="wave-emoji">{emoji("👋")}</span>
              </h1>
              <p
                className={
                  isDark
                    ? "dark-mode greeting-text-p"
                    : "greeting-text-p subTitle"
                }
              >
                {greeting.subTitle}
              </p>
              <SocialMedia />
              <div className="button-greeting-div">
                <Button text={ui.hero.contactButton} href="#contact" />
                {greeting.resumeLink && (
                  <Button
                    text={ui.hero.resumeButton}
                    href={getPublicUrl(resume.fileName)}
                    download={true}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="greeting-image-div">
            <img
              alt={greeting.username}
              src={require("../../assets/images/gabo.png")}
            ></img>
          </div>
        </div>
      </div>
    </Fade>
  );
}
