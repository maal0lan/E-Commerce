# Common Goods

A small React storefront built with Vite. The first pass establishes the visual system and reusable shop components, with a persisted cart and a responsive collection view.

## Run locally

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

## Foundation

- React with React Router for the storefront and bag routes
- Redux Toolkit and React Redux for cart state
- Redux Persist stores the cart in browser storage
- Reusable components live in `src/components/`
- Shared design tokens live in `src/styles/tokens.css`
- The sample collection uses the product records in `curl-reposonse-dataset.json`

Checkout is intentionally disabled until a real payment and order flow is connected.
