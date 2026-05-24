# NutriScale - A Smart Solution for Managing Nutrition and Health 

An interactive web-based health application built with a client-server architecture that integrates personal nutritional analysis with a curated healthy food marketplace. We provide a platform capable of analyzing a user's nutritional status based on basic anthropometric data to help prevent malnutrition and support Sustainable Development Goals (SDGs) Goal 2: Zero Hunger. Through an AI Recommendation Engine, users receive personalized daily meal prep plans and can directly purchase healthy catering packages or raw ingredients that have been medically screened to support a sustainable healthy lifestyle.

## Testing

NutriScale uses Vitest, React Testing Library, and Playwright to cover unit,
API, component, integration, and End-to-End flows.

```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

Current verified testing scope:

- Vitest unit/API/component/integration tests for utilities, hooks, stores,
  route handlers, auth forms, marketplace, checkout, orders, admin UI, and
  health assessment flows.
- Playwright public E2E for homepage, auth pages, validation, responsive view,
  and protected route redirects.
- Playwright authenticated E2E for marketplace, checkout, order history,
  health assessment, mocked Midtrans payment flow, and admin dashboard/product/
  order/user management flows.
- Authenticated Playwright storage state is generated automatically in
  `tests/e2e/.auth` and is ignored from Git.

Latest verified results:

```text
npm run test      -> 34 files, 132 tests passed
npm run test:e2e  -> 45 passed, 0 skipped
npm run lint      -> 0 errors, existing warnings only
npm run build     -> passed with network access for next/font Google Fonts
```

Detailed testing documentation is available in:

- `tests/README.md`
- `tests/e2e/README.md`
