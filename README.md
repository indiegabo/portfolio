## IndieGabo Portfolio

This repository contains the IndieGabo professional portfolio website built on
top of the developerFolio structure.

## Local development

1. Install dependencies with `npm install`.
2. Start the development server with `npm start`.
3. Open `http://localhost:3000`.

## Deployment

- Do day-to-day work on `develop`.
- Merge into `main` when a release is ready.
- Push `main` to GitHub.
- The GitHub Actions workflow deploys the `build/` output to `gh-pages`.

To complete the setup in GitHub, configure `Settings > Pages` to publish from
the `gh-pages` branch root.

## Data synchronization

The regular development workflow does not require environment variables.

- Edit `site-data.config.js` for tracked defaults.
- Create `site-data.config.local.js` for machine-specific overrides.
- Run `npm run sync-data` only when you want to refresh `public/profile.json`
  or `public/blogs.json` from GitHub or Medium.

Both sync sources are disabled by default, so the app uses the checked-in
static data and starts locally without any extra setup.
