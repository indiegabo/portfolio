const enTranslations = require("./assets/i18n/en.json");
const ptBrTranslations = require("./assets/i18n/pt-BR.json");

const defaultLocale = "en";

const supportedLocales = [
  {
    value: "en",
    label: "EN",
    ariaLabel: "English"
  },
  {
    value: "pt-BR",
    label: "PT",
    ariaLabel: "Portugues do Brasil"
  }
];

const splashScreen = {
  enabled: true,
  duration: 2000
};

const illustration = {
  animated: true
};

const socialMediaLinks = {
  github: "https://github.com/indiegabo",
  linkedin: "https://www.linkedin.com/in/indiegabo/",
  youtube: "https://www.youtube.com/@OIndieGabo",
  twitch: "https://twitch.tv/indiegabo",
  gmail: "indiegabodev@gmail.com",
  portfolio: "https://indiegabo.github.io/portfolio",
  display: true
};

const openSource = {
  showGithubProfile: true,
  display: true
};

const twitterDetails = {
  userName: "indiegabo",
  display: false
};

const isHireable = true;

const localizedPortfolio = {
  en: enTranslations,
  "pt-BR": ptBrTranslations
};

const normalizeLocale = locale => {
  if (!locale) {
    return defaultLocale;
  }

  const normalizedLocale = locale.toLowerCase();

  if (normalizedLocale === "pt" || normalizedLocale === "pt-br") {
    return "pt-BR";
  }

  if (normalizedLocale.startsWith("en")) {
    return "en";
  }

  return defaultLocale;
};

const isSupportedLocale = locale =>
  Object.prototype.hasOwnProperty.call(
    localizedPortfolio,
    normalizeLocale(locale)
  );

const getLocalizedContent = locale => {
  const activeLocale = normalizeLocale(locale);

  return localizedPortfolio[activeLocale] || localizedPortfolio[defaultLocale];
};

const getResumeFileName = locale =>
  `resume-${normalizeLocale(locale)}.pdf`;

const sanitizePhoneHref = phoneNumber =>
  `+${String(phoneNumber || "").replace(/[^\d]/g, "")}`;

const getLocalizedOpenSourceProjects = (localizedData, githubProfile) => {
  const pinnedItems =
    githubProfile &&
    githubProfile.pinnedItems &&
    Array.isArray(githubProfile.pinnedItems.edges)
      ? githubProfile.pinnedItems.edges
      : [];

  return pinnedItems
    .map(edge => {
      const repoNode = edge && edge.node ? edge.node : null;

      if (!repoNode) {
        return null;
      }

      return {
        ...repoNode,
        description:
          localizedData.githubContent.repoDescriptions[repoNode.name] ||
          repoNode.description
      };
    })
    .filter(Boolean);
};

const getResumeData = (locale, options = {}) => {
  const activeLocale = normalizeLocale(locale);
  const localizedData = getLocalizedContent(activeLocale);
  const githubProfile = options.githubProfile || null;
  const openSourceProjects = getLocalizedOpenSourceProjects(
    localizedData,
    githubProfile
  );

  return {
    locale: activeLocale,
    pageMetadata: localizedData.pageMetadata,
    resume: {
      fileName: getResumeFileName(activeLocale),
      labels: localizedData.ui.resume
    },
    contact: {
      name: localizedData.greeting.username,
      fullName:
        localizedData.contactInfo.fullName || localizedData.greeting.username,
      headline: localizedData.greeting.title,
      summary: localizedData.greeting.subTitle,
      email: localizedData.contactInfo.email_address,
      phoneDisplay: localizedData.contactInfo.number,
      phoneHref:
        localizedData.contactInfo.phoneHref ||
        sanitizePhoneHref(localizedData.contactInfo.number),
      location: localizedData.contactInfo.location,
      socialLinks: socialMediaLinks
    },
    sections: {
      greeting: localizedData.greeting.displayGreeting
        ? {
            title: localizedData.greeting.title,
            summary: localizedData.greeting.subTitle
          }
        : null,
      skills: localizedData.skillsSection.display
        ? {
            title: localizedData.skillsSection.title,
            subtitle: localizedData.skillsSection.subTitle,
            labels: localizedData.ui.resume,
            highlights: localizedData.skillsSection.skills,
            tools: localizedData.skillsSection.softwareSkills
          }
        : null,
      proficiency: localizedData.techStack.viewSkillBars
        ? {
            title: localizedData.ui.sections.proficiency,
            items: localizedData.techStack.experience
          }
        : null,
      experience: localizedData.workExperiences.display
        ? {
            title: localizedData.ui.sections.experience,
            items: localizedData.workExperiences.experience
          }
        : null,
      education: localizedData.educationInfo.display
        ? {
            title: localizedData.ui.sections.education,
            items: localizedData.educationInfo.schools
          }
        : null,
      featuredProjects: localizedData.bigProjects.display
        ? {
            title: localizedData.bigProjects.title,
            subtitle: localizedData.bigProjects.subtitle,
            items: localizedData.bigProjects.projects
          }
        : null,
      assetProjects: localizedData.assetsProjects.display
        ? {
            title: localizedData.assetsProjects.title,
            subtitle: localizedData.assetsProjects.subtitle,
            items: localizedData.assetsProjects.projects
          }
        : null,
      openSource:
        openSource.display && openSourceProjects.length > 0
          ? {
              title: localizedData.ui.sections.openSourceProjects,
              items: openSourceProjects,
              moreProjectsLabel: localizedData.ui.sections.moreProjects,
              moreProjectsUrl: socialMediaLinks.github
            }
          : null
    }
  };
};

module.exports = {
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
};