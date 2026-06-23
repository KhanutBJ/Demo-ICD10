// Central API base. Override per-environment with NEXT_PUBLIC_API_BASE
// (e.g. in .env.local or Vercel project settings) — falls back to the
// production Cloud Run backend so existing deployments keep working.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://lapoopoo-backend-818724353799.asia-southeast3.run.app';

// Small helper: api('/api/kanban') -> full URL
export const api = (path) => `${API_BASE}${path}`;
