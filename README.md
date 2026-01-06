# AGI House India - agihouse.in

![Screenshot](/screenshot.png)

The official website for AGI House. We help ambitious founders build AI-native startups. AGI House is a community, fellowship, and VC fund empowering the world's most talented AI founders and researchers.

## Live Website

View the live site here: [https://agihouse.in/](https://agihouse.in/)

## Running Locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/models-mafia-labs/agihouse-site.git
    ```

2.  **Install dependencies:**
    We recommend using [pnpm](https://pnpm.io/) for faster installations. You can however use `npm` or `yarn`.

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables (if any):**

    *   Copy `.env.example` to `.env.local` (if `.env.example` exists):
        ```bash
        cp .env.example .env.local
        ```
    *   Update any necessary variables in `.env.local`. Common variables might include API keys for analytics or backend services.
        ```env
        # Example: Add any environment variables needed by the application
        # NEXT_PUBLIC_ANALYTICS_ID=
        # SOME_API_KEY=
        ```
        *Note: Add specific variables required by your setup.*

4.  **Run the development server:**

    ```bash
    pnpm dev
    # or
    npm run dev
    # or
    yarn dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The app likely uses Next.js features like Fast Refresh, so changes you make to files should be reflected quickly in the browser during development.

## Development

Want to contribute? Great!

To fix a bug or enhance an existing feature, follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b improve-feature-xyz`).
3.  Make the appropriate changes in the files.
4.  Commit your changes (`git commit -am 'feat: Improve feature XYZ'`). Use conventional commit messages if possible.
5.  Push to the branch (`git push origin improve-feature-xyz`).
6.  Create a Pull Request against the `main` or `develop` branch.

## Bug / Feature Request

If you find a bug (e.g., the website displays incorrectly, a feature isn't working as expected), kindly open an issue [here](https://github.com/models-mafia-labs/agihouse-site/issues/new/choose) (replace with your repo URL). Please include:
*   A clear description of the bug.
*   Steps to reproduce it.
*   Expected behavior vs. actual behavior.
*   Screenshots if applicable.

If you'd like to request a new feature or enhancement, feel free to do so by opening an issue [here](https://github.com/models-mafia-labs/agihouse-site/issues/new/choose) (replace with your repo URL). Please describe the feature and its potential value.

## Tech Stack

This project is built with modern web technologies:

*   [Next.js](https://nextjs.org/) - React framework for production.
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
*   [Framer Motion](https://www.framer.com/motion/) - Animation library for React.
*   [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript adding static types.

## Deployment

Deployed on **Coolify** (self-hosted PaaS on Hetzner):

- **Live URLs**: https://agihouse.in, https://india.agihouse.in
- **Server**: Hetzner Cloud (5.223.44.108)
- **Database**: Standalone PostgreSQL (`agihouse-db-new`)
- **Coolify Dashboard**: http://5.223.44.108:8000

### Deploy
```bash
# Push to main triggers auto-deploy
git push origin main
```

<!-- Build: 2026-01-06T14:35 -->
