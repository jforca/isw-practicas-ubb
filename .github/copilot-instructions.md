# Copilot Project Instructions

## Monorepo
- Workspace managed with pnpm/turbo; review [package.json](package.json), [pnpm-workspace.yaml](pnpm-workspace.yaml), and [turbo.json](turbo.json) before adding scripts or pipelines.
- TypeScript everywhere; favor async/await, Spanish-facing copy, and shared utilities when wiring features across apps/frontend, apps/backend, and packages.

## Frontend (`apps/frontend`)
- Router lives in [`frontend.App`](apps/frontend/src/app.tsx); protected segments mount under [`common.components.Auth`](apps/frontend/src/common/components/auth.tsx) which relies on [`common.hooks.useAuth`](apps/frontend/src/common/hooks/auth.hook.ts) and [`lib.auth-client`](apps/frontend/src/lib/auth-client.ts).
- Authentication UI flows start from [`modules.login.components.organisms.LoginForm`](apps/frontend/src/modules/login/components/organisms/login-form.tsx) within [`modules.login.components.templates.LoginTemplate`](apps/frontend/src/modules/login/components/templates/login-template.tsx); keep submission state (`isSubmitting`, `passwordVisible`) aligned with existing patterns.
- Styling uses Tailwind+DaisyUI entries defined in [`styles/base.css`](apps/frontend/src/styles/base.css), [`styles/themes.css`](apps/frontend/src/styles/themes.css), and [`styles/utilities.css`](apps/frontend/src/styles/utilities.css); reuse utilities before adding raw classes.

## Backend (`apps/backend`)
- Server bootstrap and routing glue sit in [`backend.index`](apps/backend/src/index.ts); register new API routers inside [`routes.routerApi`](apps/backend/src/routes/index.routes.ts).
- Database connectivity is configured via [`config.db.config.connectDB`](apps/backend/src/config/db.config.ts) and environment validation in [`lib.env.env`](apps/backend/src/lib/env.ts); do not bypass these helpers.
- Authentication integrates Better Auth through [`lib.auth.auth`](apps/backend/src/lib/auth.ts) with session enforcement provided by [`middleware.auth.authMiddleware`](apps/backend/src/middleware/auth.middleware.ts).
- Prefer standardized responses using [`handlers.response.handleSuccess`](apps/backend/src/handlers/response.handlers.ts), [`handlers.response.handleErrorClient`](apps/backend/src/handlers/response.handlers.ts), and [`handlers.response.handleErrorServer`](apps/backend/src/handlers/response.handlers.ts).
- Data models are defined in [`entities.User`](apps/backend/src/entities/user.entity.ts), [`entities.Account`](apps/backend/src/entities/account.entity.ts), [`entities.Session`](apps/backend/src/entities/session.entity.ts), and [`entities.Verification`](apps/backend/src/entities/verification.entity.ts); update migrations/entities consistently.

## Shared Packages
- Central schemas live in [`schema.UserSchema`](packages/schema/example.schema.ts); extend or add schemas here so both apps consume a single source of truth.

## Tooling & Practices
- Use `pnpm` scripts from the app-level package.json files for dev/build tasks and respect Biome formatting (`biome.json`).
- Mirror environment variable definitions through [`frontend.lib.env`](apps/frontend/src/lib/env.ts) and backend env loaders; never hardcode URLs or secrets.
- When adding tests or utilities, prefer placement in the corresponding package/app to keep boundaries clear.