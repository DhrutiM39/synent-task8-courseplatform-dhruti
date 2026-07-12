import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminRoute
 *
 * Reads the JWT stored in localStorage, decodes the payload (without
 * verifying the signature — the server still enforces that on every
 * real API call), and checks two things:
 *   1. The token exists and has not expired.
 *   2. The payload's `isAdmin` field is truthy.
 *
 * If either check fails the user is silently redirected to "/" so
 * they never see a flash of admin UI.
 */
function AdminRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      // JWT structure: header.payload.signature  (all Base64url-encoded)
      const payloadB64 = token.split(".")[1];
      // Base64url → Base64 (replace URL-safe chars, pad if needed)
      const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(padded));

      const isExpired = payload.exp && Date.now() / 1000 > payload.exp;

      if (!isExpired && payload.isAdmin) {
        // ✅ Authenticated admin — render the matched child route
        return <Outlet />;
      }
    } catch {
      // Malformed token — fall through to redirect
    }
  }

  // Not logged in, not an admin, or token is expired → redirect to home
  return <Navigate to="/" replace />;
}

export default AdminRoute;
