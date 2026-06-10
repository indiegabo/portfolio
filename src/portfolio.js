import {
  defaultLocale,
  supportedLocales,
  illustration,
  socialMediaLinks,
  splashScreen,
  openSource,
  twitterDetails,
  isHireable,
  normalizeLocale,
  isSupportedLocale,
  getPortfolioData
} from "./portfolioContent";

const defaultPortfolioData = getPortfolioData(defaultLocale);

const {
  pageMetadata,
  ui,
  greeting,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  bigProjects,
  assetsProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo
} = defaultPortfolioData;

export {
  defaultLocale,
  supportedLocales,
  illustration,
  socialMediaLinks,
  splashScreen,
  openSource,
  twitterDetails,
  isHireable,
  normalizeLocale,
  isSupportedLocale,
  getPortfolioData,
  pageMetadata,
  ui,
  greeting,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  bigProjects,
  assetsProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo
};
