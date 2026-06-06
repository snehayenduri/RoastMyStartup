# RoastMyStartup
# React + TypeScript + Vite
# IdeaRoast AI
**IdeaRoast AI** is a premium, AI‑powered startup validation platform. It lets founders, VCs, product managers, and growth marketers submit a three‑step startup description and receive a structured 10‑section report with a clear verdict (GO, GO WITH CHANGES, DON'T BUILD). The app showcases a modern UI built with glassmorphism, dark mode, animated cards, and real‑time progress indicators.
Currently, two official plugins are available:
---
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## Features
## React Compiler
- Multi‑agent AI swarm with five personas (VC, YC Partner, Product Manager, Founder, Growth Marketer).
- Four roast levels: mild, investor, brutal, nuclear.
- Glass‑styled UI, dark/light themes, responsive layout.
- Local‑first storage for user session and roast limits.
- Demo mode (OPENAI API key required) with realistic mock report.
- Export report as PDF and compare multiple roasts on a dashboard.

---
## Expanding the ESLint configuration
## Prerequisites
If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:
- Node.js (>=18) and npm (or yarn).
- Optional: OPENAI API key – get a free key from the [OPENAI API](https://platform.openai.com/api-keys).
```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
---
      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
## Installation & Development
      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```bash
# Navigate to the project directory
# Install dependencies
npm install
# (Optional) Create a .env file for production builds
# VITE_OPENAI_API_KEY=YOUR_OPENAI_KEY
# Start the dev server
npm run dev   # Vite serves at http://localhost:5173
```
You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:
Open the URL in Chrome. You’ll be prompted for an API key; click **"Use Demo Mode Instead"** to bypass it.
```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'
---
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
## Production Build
```bash
npm run build   # Generates optimized files in dist/
npm run preview # Preview the built site locally
```
Deploy the contents of `dist/` to any static‑hosting service (Netlify, Vercel, Firebase Hosting, etc.).
---
## Environment Variables
- `VITE_OPENAI_API_KEY` – Required for real AI calls. When set, the app reads the key via `import.meta.env.VITE_OPENAI_API_KEY` and no longer stores keys in `localStorage`.
- If missing, the app automatically uses demo mode.
---
## Project Structure
```
idearoast-ai/
├─ index.html
├─ css/
│   └─ components.css
├─ js/
│   ├─ auth.js
│   ├─ ai.js
│   ├─ app.js
│   ├─ wizard.js
│   ├─ report.js
│   └─ dashboard.js
├─ dist/   # Production output
└─ README.md
```
---
## Testing & Verification
1. Run `npm run build` – should complete without errors. (`npm run dev`)
2. In dev mode, complete a wizard using demo mode and verify a report appears and can be exported as PDF.
3. Set `VITE_OPENAI_API_KEY` in `.env` and repeat – the report should be generated from the openai model.
