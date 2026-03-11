## Workflow Management Dashboard

Internal workflow management dashboard built with Angular 21 for tracking approvals, tasks, SLAs and workflow analytics.

### Project setup

- **Requirements**:
  - Node.js 20+
  - npm 11+
- **Install dependencies**:
  ```bash
  npm install
  ```
- **Run dev server**:
  ```bash
  npm start
  # http://localhost:4200
  ```
- **Mock login accounts** (any password works):
  - `admin@test.com` – Admin
  - `manager@test.com` – Manager
  - `user@test.com` – User

### Architecture overview

- **Tech stack**:
  - Angular 21 (standalone bootstrap)
  - NgRx Store & Effects for state management
  - RxJS for async flows and debounced search
  - `@swimlane/ngx-charts` for dashboard charts
- **Feature structure** (feature-based):
  - `src/app/core` – singleton services, models, NgRx store, guards, interceptors
  - `src/app/features/auth` – login and auth flow
  - `src/app/features/dashboard` – analytics and charts
  - `src/app/features/workflows` – workflow CRUD, filters, list
  - `src/app/layout` – shell, navbar, sidebar
  - `src/app/shared` – shared UI (e.g. `ErrorBannerComponent`)

### State management & data flow

- **Global store slices**:
  - `auth` – current user, loading, error
  - `workflow` – paged workflows, selection, loading, error
- **Flow example (workflows list)**:
  1. `WorkflowListPage` dispatches `WorkflowActions.loadWorkflows({ query })`.
  2. `workflow.effects.ts` calls `WorkflowService.getWorkflows(query)` with a mocked backend (`MockApiService`).
  3. Result is normalized into a `WorkflowPage` (items, total, page, pageSize) and reduced into `WorkflowState`.
  4. Components select from store via selectors (e.g. `selectAllWorkflows`, `selectWorkflowPage`, `selectWorkflowTotal`).
  5. Optimistic updates are handled in the reducer for create/update/delete with rollback on failure.

### Performance optimizations

- **Routing & structure**:
  - Lazy-loaded routes for `auth`, `dashboard`, `workflows`, and layout shell.
- **Change detection**:
  - `ChangeDetectionStrategy.OnPush` on key components (`Dashboard`, `WorkflowListComponent`, `WorkflowFiltersComponent`, etc.).
  - `trackBy` functions for workflow row rendering.
- **RxJS & NgRx**:
  - Debounced search via `Subject` + `debounceTime` in `WorkflowFiltersComponent`.
  - NgRx selectors used to avoid redundant computations.
  - Optimistic reducer logic for workflow create/update/delete with rollback on failure.

### Features implemented

- **Authentication & Authorization**:
  - Mock login against `MockApiService`.
  - Role-based access (Admin, Manager, User) via `authGuard` and `roleGuard`.
  - Role-based UI controls (e.g. create/edit/delete only for Admin/Manager).
- **Workflow management**:
  - Create, edit, delete workflows with:
    - Name, priority, status, assigned users, due date.
    - Sync validations (required, min length).
    - Async name-uniqueness validator.
- **Dashboard & analytics**:
  - Totals by status (Draft, In Review, Approved, Rejected).
  - Overdue workflows count.
  - Average completion time (days) using `createdAt` and `updatedAt`.
  - Bar chart using `ngx-charts`.
- **Search, filter & pagination**:
  - Debounced search.
  - Status filter.
  - Date range and assigned user filters.
  - Mocked server-side pagination (page/pageSize/total) in `MockApiService` + NgRx.
- **Non-functional**:
  - Theming via `ThemeService` (light/dark) with persisted preference.
  - Global HTTP error interceptor.
  - Error banner component wired to NgRx error state.
  - Basic PWA support (manifest + service worker registration).

### Testing

- **Unit tests**:
  - Run with Vitest via Angular CLI:
  ```bash
  npm test
  ```
- **E2E tests (Cypress)**:
  - Config: `cypress.config.ts`
  - Example happy-path spec: `cypress/e2e/happy-path.cy.ts`
  - Run (after starting `npm start` in another terminal):
  ```bash
  npx cypress run
  # or
  npx cypress open
  ```

### Assumptions & limitations

- Mock backend only (no real API, no real persistence beyond in-memory data and localStorage).
- Auth token is mocked and not sent as an `Authorization` header.
- No token expiry/refresh flow.
- Pagination and filters are implemented against an in-memory dataset.
- PWA service worker is minimal and not optimized for advanced offline/caching scenarios.

### Deployment

- **Build for production**:
  ```bash
  npm run build
  ```
- **Deployed URL**:
  - `TBD` – update this section with the live URL when deployed.
