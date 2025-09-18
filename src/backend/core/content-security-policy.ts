import { app, session } from 'electron/main';

/**
 * Set Content Security Policy (CSP) headers for the application.
 *
 * In development mode, a more permissive CSP is applied to allow
 * features like Hot Module Replacement (HMR) and the Vite dev server.
 * In production mode, a stricter CSP is enforced for better security.
 *
 * This function should be called during the app's initialization phase.
 */
export function setContentSecurityPolicyHeader(): void {
  const csp = app.isPackaged
    ? [
        "default-src 'self'",
        "script-src 'self'",
        "worker-src 'self'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "style-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
      ]
    : [
        "default-src 'self'",
        "script-src 'self' blob:",
        "worker-src 'self' blob:",
        "connect-src 'self' ws: http://localhost:5173 http://127.0.0.1:5173",
        "img-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline'",
        "object-src 'none'",
        "frame-ancestors 'none'",
      ];

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp.join('; ')],
      },
    });
  });
}
