# MTX GOV Highway Administration Hub Prototype

An interactive, buyer-focused landing page for a configurable transportation capital-program coordination and intelligence platform. The prototype presents MTX GOV Highway Administration Hub as a reusable product connecting planning, STIP programming, funding, project development, procurement coordination, construction, closeout, and in-service outcomes.

## Technology

* React and TypeScript
* Vite
* Modern responsive CSS
* Lucide React icons
* Recharts
* Local sample data and SVG map geometry

## Local setup

Use Node.js 22 or a compatible current LTS release.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Development and production commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

The production output is written to `dist`.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` builds and publishes `dist` after changes reach `main`. Vite uses a relative asset base, so the output works from a repository subdirectory.

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push or merge the site to `main`, or run the workflow manually.

## Prototype content and claims

Displayed projects, contracts, maps, schedules, risks, measures, and financial values are fictional and intended for product demonstration. The site does not represent live agency information, customer results, production deployments, regulatory determinations, or approved product commitments. Product, security, integration, service, and implementation claims should receive MTX review before external publication.

## Contact form

The request form is a local, non-submitting prototype. To connect an approved contact workflow, replace the `submit` handler in `src/App.tsx` with the organization’s reviewed endpoint or link and update the form notice and privacy language.

## Updating product content

Lifecycle content is maintained in the `lifecycle` data object near the top of `src/App.tsx`. Capability content is maintained in the `capabilities` data object. Related role, challenge, roadmap, risk, scenario, and architecture sample content is stored nearby in lightweight local arrays.

After content changes, run lint and a production build before publishing.
