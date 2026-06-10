import emoji from "react-easy-emoji";
import {
  defaultLocale,
  supportedLocales,
  splashScreen,
  illustration,
  socialMediaLinks,
  openSource,
  twitterDetails,
  isHireable,
  normalizeLocale,
  isSupportedLocale,
  getLocalizedContent,
  getResumeData,
  getResumeFileName
} from "./contentModel";

export {
  defaultLocale,
  supportedLocales,
  splashScreen,
  illustration,
  socialMediaLinks,
  openSource,
  twitterDetails,
  isHireable,
  normalizeLocale,
  isSupportedLocale,
  getResumeData,
  getResumeFileName
};

const educationLogoAssets = {
  unifacs: require("./assets/images/unifacs-logo.png")
};

const companyLogoAssets = {
  estanteMagica: require("./assets/images/estante-magica-logo.png"),
  noSlopes: require("./assets/images/no-slopes-logo.jpg")
};

const imageAssets = {
  magicLand: require("./assets/images/magic-land-logo.png"),
  chasingIllusions: require("./assets/images/chasing-illusions-splash.jpg"),
  boomBoomCastle: require("./assets/images/boom-boom-castle-splash.png"),
  spriteAnimations: require("./assets/images/sprite-animations-banner.png"),
  codeIn: require("./assets/images/codeInLogo.webp"),
  googleAssistant: require("./assets/images/googleAssistantLogo.webp"),
  pwa: require("./assets/images/pwaLogo.webp")
};

const mapEducationInfo = educationInfo => ({
  ...educationInfo,
  schools: educationInfo.schools.map(({logoKey, ...school}) => ({
    ...school,
    logo: educationLogoAssets[logoKey]
  }))
});

const mapWorkExperiences = workExperiences => ({
  ...workExperiences,
  experience: workExperiences.experience.map(
    ({companyLogoKey, ...experience}) => ({
      ...experience,
      companylogo: companyLogoAssets[companyLogoKey]
    })
  )
});

const mapProjectSection = section => ({
  ...section,
  projects: section.projects.map(({imageKey, ...project}) => ({
    ...project,
    image: imageAssets[imageKey]
  }))
});

const mapAchievementSection = achievementSection => ({
  ...achievementSection,
  title: emoji(achievementSection.title),
  achievementsCards: achievementSection.achievementsCards.map(
    ({imageKey, ...card}) => ({
      ...card,
      image: imageAssets[imageKey]
    })
  )
});

const mapGreeting = greeting => ({
  ...greeting,
  subTitle: emoji(greeting.subTitle)
});

const mapSkillsSection = skillsSection => ({
  ...skillsSection,
  skills: skillsSection.skills.map(skill => emoji(skill))
});

const mapTalkSection = talkSection => ({
  ...talkSection,
  subtitle: emoji(talkSection.subtitle)
});

const mapPodcastSection = podcastSection => ({
  ...podcastSection,
  title: emoji(podcastSection.title)
});

const mapContactInfo = contactInfo => ({
  ...contactInfo,
  title: emoji(contactInfo.title)
});

const buildLocalizedPortfolio = translations => ({
  ...translations,
  greeting: mapGreeting(translations.greeting),
  skillsSection: mapSkillsSection(translations.skillsSection),
  educationInfo: mapEducationInfo(translations.educationInfo),
  workExperiences: mapWorkExperiences(translations.workExperiences),
  bigProjects: mapProjectSection(translations.bigProjects),
  assetsProjects: mapProjectSection(translations.assetsProjects),
  achievementSection: mapAchievementSection(translations.achievementSection),
  talkSection: mapTalkSection(translations.talkSection),
  podcastSection: mapPodcastSection(translations.podcastSection),
  contactInfo: mapContactInfo(translations.contactInfo)
});

const localizedPortfolio = {
  en: buildLocalizedPortfolio(getLocalizedContent("en")),
  "pt-BR": buildLocalizedPortfolio(getLocalizedContent("pt-BR"))
};

export const getPortfolioData = locale => {
  const activeLocale = normalizeLocale(locale);
  const localizedData =
    localizedPortfolio[activeLocale] || localizedPortfolio[defaultLocale];

  return {
    locale: activeLocale,
    illustration,
    socialMediaLinks,
    splashScreen,
    openSource,
    twitterDetails,
    isHireable,
    resume: {
      fileName: getResumeFileName(activeLocale)
    },
    ...localizedData
  };
};
