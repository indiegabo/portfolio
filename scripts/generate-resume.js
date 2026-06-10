const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const {
  getResumeData,
  supportedLocales
} = require("../src/contentModel");

const projectRoot = path.resolve(__dirname, "..");
const buildDir = path.join(projectRoot, "build");
const publicDir = path.join(projectRoot, "public");
const templatePath = path.join(__dirname, "resume-template.html");
const cssPath = path.join(__dirname, "resume-template.css");
const portraitPath = path.join(
  projectRoot,
  "src/assets/images/portrait.jpg"
);
const avatarPath = path.join(
  projectRoot,
  "src/assets/images/gabo-with-bg.png"
);
const tagPath = path.join(projectRoot, "src/assets/images/tag-indiegabo.png");
const educationLogoPaths = {
  unifacs: path.join(projectRoot, "src/assets/images/unifacs-logo.png")
};
const companyLogoPaths = {
  estanteMagica: path.join(
    projectRoot,
    "src/assets/images/estante-magica-logo.png"
  ),
  noSlopes: path.join(projectRoot, "src/assets/images/no-slopes-logo.jpg")
};
const projectImagePaths = {
  magicLand: path.join(projectRoot, "src/assets/images/magic-land-logo.png"),
  chasingIllusions: path.join(
    projectRoot,
    "src/assets/images/chasing-illusions-splash.jpg"
  ),
  boomBoomCastle: path.join(
    projectRoot,
    "src/assets/images/boom-boom-castle-splash.png"
  ),
  spriteAnimations: path.join(
    projectRoot,
    "src/assets/images/sprite-animations-banner.png"
  )
};
const dataUriCache = new Map();

const requestedLocales = process.argv.slice(2);

const localesToBuild =
  requestedLocales.length > 0
    ? requestedLocales
    : supportedLocales.map(locale => locale.value);

const escapeHtml = value =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderListItems = items =>
  items.map(item => `<li>${escapeHtml(item)}</li>`).join("");

const replaceToken = (template, token, value) =>
  template.split(token).join(value);

const applyTemplateTokens = (template, tokens) =>
  Object.entries(tokens).reduce(
    (html, [token, value]) => replaceToken(html, token, value),
    template
  );

const getMappedAssetSrc = (assetMap, assetKey) => {
  if (!assetKey || !assetMap[assetKey]) {
    return "";
  }

  return toDataUri(assetMap[assetKey]);
};

const renderEntityLogo = (src, alt) => {
  if (!src) {
    return "";
  }

  return `
    <div class="entity-logo">
      <img src="${src}" alt="${escapeHtml(alt)}" />
    </div>
  `;
};

const renderProjectImage = (src, alt) => {
  if (!src) {
    return "";
  }

  return `
    <div class="project-media">
      <img src="${src}" alt="${escapeHtml(alt)}" />
    </div>
  `;
};

const renderContactItems = resumeData => {
  const {contact, resume} = resumeData;
  const portfolioUrl = contact.socialLinks.portfolio;

  return [
    `<li><span>${escapeHtml(
      resume.labels.location
    )}</span><strong>${escapeHtml(contact.location)}</strong></li>`,
    `<li><span>${escapeHtml(
      resume.labels.phone
    )}</span><a href="tel:${escapeHtml(contact.phoneHref)}">${escapeHtml(
      contact.phoneDisplay
    )}</a></li>`,
    `<li><span>${escapeHtml(
      resume.labels.email
    )}</span><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(
      contact.email
    )}</a></li>`,
    `<li><span>${escapeHtml(
      resume.labels.portfolio
    )}</span><a href="${escapeHtml(portfolioUrl)}">${escapeHtml(
      portfolioUrl
    )}</a></li>`
  ].join("");
};

const renderExperienceSection = section => {
  if (!section) {
    return "";
  }

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="timeline-list">
        ${section.items
          .map(
            item => {
              const companyLogoSrc = getMappedAssetSrc(
                companyLogoPaths,
                item.companyLogoKey
              );

              return `
              <article class="timeline-item">
                <div class="timeline-header">
                  <div class="timeline-headline">
                    ${renderEntityLogo(
                      companyLogoSrc,
                      `${item.company} logo`
                    )}
                    <div>
                      <h3>${escapeHtml(item.role)}</h3>
                      <p class="timeline-subtitle">${escapeHtml(
                        item.company
                      )}</p>
                    </div>
                  </div>
                  <span class="timeline-date">${escapeHtml(item.date)}</span>
                </div>
                <p class="timeline-description">${escapeHtml(item.desc)}</p>
                ${
                  item.descBullets && item.descBullets.length > 0
                    ? `<ul class="bullet-list">${renderListItems(
                        item.descBullets
                      )}</ul>`
                    : ""
                }
              </article>
            `;
            }
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderEducationSection = section => {
  if (!section) {
    return "";
  }

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="timeline-list">
        ${section.items
          .map(
            item => {
              const schoolLogoSrc = getMappedAssetSrc(
                educationLogoPaths,
                item.logoKey
              );

              return `
              <article class="timeline-item compact">
                <div class="timeline-header">
                  <div class="timeline-headline">
                    ${renderEntityLogo(
                      schoolLogoSrc,
                      `${item.schoolName} logo`
                    )}
                    <div>
                      <h3>${escapeHtml(item.subHeader)}</h3>
                      <p class="timeline-subtitle">${escapeHtml(
                        item.schoolName
                      )}</p>
                    </div>
                  </div>
                  <span class="timeline-date">${escapeHtml(
                    item.duration
                  )}</span>
                </div>
                <p class="timeline-description">${escapeHtml(item.desc)}</p>
                ${
                  item.descBullets && item.descBullets.length > 0
                    ? `<ul class="bullet-list">${renderListItems(
                        item.descBullets
                      )}</ul>`
                    : ""
                }
              </article>
            `;
            }
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderSkillsSection = section => {
  if (!section) {
    return "";
  }

  const toolItems = section.tools.map(item => item.skillName);

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
      <div class="skills-grid">
        <div>
          <h3>${escapeHtml(section.labels.highlights)}</h3>
          <ul class="bullet-list">${renderListItems(section.highlights)}</ul>
        </div>
        <div>
          <h3>${escapeHtml(section.labels.tools)}</h3>
          <div class="tag-list">
            ${toolItems
              .map(item => `<span class="tag">${escapeHtml(item)}</span>`)
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
};

const renderProficiencySection = section => {
  if (!section) {
    return "";
  }

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="proficiency-list">
        ${section.items
          .map(
            item => `
              <div class="proficiency-item">
                <div class="proficiency-label-row">
                  <span>${escapeHtml(item.Stack)}</span>
                  <strong>${escapeHtml(item.progressPercentage)}</strong>
                </div>
                <div class="proficiency-bar">
                  <span style="width: ${escapeHtml(
                    item.progressPercentage
                  )};"></span>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderProjectSection = section => {
  if (!section) {
    return "";
  }

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <p class="section-subtitle">${escapeHtml(section.subtitle || "")}</p>
      <div class="project-list">
        ${section.items
          .map(item => {
            const primaryLink =
              item.footerLink && item.footerLink.length > 0
                ? item.footerLink[0]
                : null;
            const projectImageSrc = getMappedAssetSrc(
              projectImagePaths,
              item.imageKey
            );

            return `
              <article class="project-item">
                ${renderProjectImage(
                  projectImageSrc,
                  item.projectName || item.name
                )}
                <div class="timeline-header project-header">
                  <h3>${escapeHtml(item.projectName || item.name)}</h3>
                  ${
                    primaryLink
                      ? `<a href="${escapeHtml(primaryLink.url)}">${escapeHtml(
                          primaryLink.name
                        )}</a>`
                      : ""
                  }
                </div>
                <p class="timeline-description">${escapeHtml(
                  item.projectDesc || item.description
                )}</p>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
};

const renderOpenSourceSection = section => {
  if (!section) {
    return "";
  }

  return `
    <section class="resume-section">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="project-list compact-grid">
        ${section.items
          .map(
            item => `
              <article class="project-item compact-card">
                <div class="timeline-header project-header">
                  <h3>${escapeHtml(item.name)}</h3>
                  <a href="${escapeHtml(item.url)}">GitHub</a>
                </div>
                <p class="timeline-description">${escapeHtml(
                  item.description
                )}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <p class="section-footer-link">
        <a href="${escapeHtml(section.moreProjectsUrl)}">${escapeHtml(
    section.moreProjectsLabel
  )}</a>
      </p>
    </section>
  `;
};

const getMimeType = filePath => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return "image/png";
};

const toDataUri = filePath => {
  if (dataUriCache.has(filePath)) {
    return dataUriCache.get(filePath);
  }

  const assetBase64 = fs.readFileSync(filePath, "base64");
  const dataUri = `data:${getMimeType(filePath)};base64,${assetBase64}`;

  dataUriCache.set(filePath, dataUri);

  return dataUri;
};

const renderHtml = resumeData => {
  const template = fs.readFileSync(templatePath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");
  const portraitSrc = toDataUri(portraitPath);
  const avatarSrc = toDataUri(avatarPath);
  const tagSrc = toDataUri(tagPath);
  const fullName = resumeData.contact.fullName || resumeData.contact.name;

  const sections = resumeData.sections;

  return applyTemplateTokens(template, {
    "{{LANG}}": escapeHtml(resumeData.locale),
    "{{TITLE}}": escapeHtml(resumeData.pageMetadata.title),
    "{{STYLE}}": css,
    "{{TAG_SRC}}": tagSrc,
    "{{PORTRAIT_SRC}}": portraitSrc,
    "{{AVATAR_SRC}}": avatarSrc,
    "{{EYEBROW}}": escapeHtml(resumeData.resume.labels.eyebrow),
    "{{NAME}}": escapeHtml(fullName),
    "{{HEADLINE}}": escapeHtml(resumeData.contact.headline),
    "{{SUMMARY}}": escapeHtml(resumeData.contact.summary),
    "{{CONTACT_TITLE}}": escapeHtml(resumeData.resume.labels.contact),
    "{{CONTACT_ITEMS}}": renderContactItems(resumeData),
    "{{SKILLS_SECTION}}": renderSkillsSection(sections.skills),
    "{{PROFICIENCY_SECTION}}": renderProficiencySection(
      sections.proficiency
    ),
    "{{EXPERIENCE_SECTION}}": renderExperienceSection(sections.experience),
    "{{EDUCATION_SECTION}}": renderEducationSection(sections.education),
    "{{FEATURED_PROJECTS_SECTION}}": renderProjectSection(
      sections.featuredProjects
    ),
    "{{ASSET_PROJECTS_SECTION}}": renderProjectSection(
      sections.assetProjects
    ),
    "{{OPEN_SOURCE_SECTION}}": renderOpenSourceSection(sections.openSource)
  });
};

const getDisplayUrl = url =>
  String(url || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

const renderFooterTemplate = resumeData => {
  const fullName = escapeHtml(
    resumeData.contact.fullName || resumeData.contact.name
  );
  const portfolioUrl = escapeHtml(
    getDisplayUrl(resumeData.contact.socialLinks.portfolio)
  );

  return `
    <div
      style="
        width: 100%;
        box-sizing: border-box;
        padding: 0 14mm;
        font-family: Helvetica Neue, Arial, sans-serif;
        font-size: 8.5px;
        color: #4a5874;
      "
    >
      <div
        style="
          width: 100%;
          box-sizing: border-box;
          border-top: 1px solid rgba(108, 99, 255, 0.22);
          padding-top: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        "
      >
        <span style="font-weight: 600; white-space: nowrap;">
          ${fullName} | IndieGabo
        </span>
        <span
          style="
            color: #6a7892;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 42%;
          "
        >
          ${portfolioUrl}
        </span>
        <span style="font-weight: 700; white-space: nowrap;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </span>
      </div>
    </div>
  `;
};

const loadGithubProfile = () => {
  const profilePath = path.join(projectRoot, "public", "profile.json");

  if (!fs.existsSync(profilePath)) {
    return null;
  }

  const profileData = JSON.parse(fs.readFileSync(profilePath, "utf8"));

  return profileData && profileData.data ? profileData.data.user : null;
};

const outputDirs = [buildDir, publicDir];

const ensureOutputDirs = () => {
  outputDirs.forEach(directory => {
    fs.mkdirSync(directory, {recursive: true});
  });
};

const generatePdf = async (browser, locale, githubProfile) => {
  const resumeData = getResumeData(locale, {githubProfile});
  const page = await browser.newPage();
  const html = renderHtml(resumeData);

  await page.setContent(html, {waitUntil: "networkidle0"});
  await page.emulateMediaType("screen");

  for (const outputDir of outputDirs) {
    const outputPath = path.join(outputDir, resumeData.resume.fileName);

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: renderFooterTemplate(resumeData),
      margin: {
        top: "16mm",
        right: "14mm",
        bottom: "22mm",
        left: "14mm"
      }
    });
  }

  await page.close();
};

const run = async () => {
  ensureOutputDirs();

  const githubProfile = loadGithubProfile();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    for (const locale of localesToBuild) {
      await generatePdf(browser, locale, githubProfile);
    }
  } finally {
    await browser.close();
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});