# Authentication Architecture (Stage 2.2)

This document describes the authentication architecture for both portals (SaaS and Tenant) and Stage 2.2 implementation details.

Overview
- Dual portal: SaaS (platform) and Tenant (school subdomains or path-based in dev)
- JWT-based auth with refresh token rotation ready
- CSRF protection headers for unsafe methods
- Role-based redirects and portal-aware API headers

Tenant authentication flow
1) Tenant detection: subdomain (demo fallback on localhost)
2) Login: credentials + role, returns access/refresh tokens and user profile
3) Remember me: persisted store
4) Session: token refresh on 401; session expiry handling
5) Password reset: request code -> verify -> change
6) MFA (placeholder) and SSO (SAML/OIDC stubs) ready for expansion

Security
- CSRF: X-CSRFToken header attached for POST/PUT/PATCH/DELETE
- XSS: escapeHtml utility for rendering untrusted text
- Input sanitization: trim and normalize inputs (email)
- Audit logging: minimal client logger hooks (to be wired to backend endpoint)

RBAC integration
- Resource:action permission checks (e.g., users:view)
- PermissionMatrix and RoleManagement stubs in tenant admin

Dev Notes
- In production, prefer httpOnly cookies for refresh tokens and do not store them in localStorage.
- Access tokens may be short-lived; rotate on refresh. Ensure secure cookie flags (Secure, SameSite).

