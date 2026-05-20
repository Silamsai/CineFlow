/**
 * ClerkCompat — Safe wrappers for Clerk hooks/components.
 * When a real Clerk key is configured, delegates to @clerk/clerk-react.
 * When not configured, returns no-op stubs so the UI renders without crashing.
 */
const isClerkEnabled =
  typeof window !== 'undefined' && window.__CLERK_ENABLED__ === true;

// ─── Stubs used when Clerk is disabled ───────────────────────────────────────

const stubUser = null;

function useUserStub() {
  return { isSignedIn: false, isLoaded: true, user: null };
}

function SignInButtonStub({ children, mode }) {
  // Render children but clicking does nothing — auth is not configured
  return children || null;
}

function UserButtonStub() {
  return null;
}

// ─── Real Clerk exports ───────────────────────────────────────────────────────
// Imported lazily so the module doesn't fail when Clerk isn't installed / configured

let _useUser = useUserStub;
let _SignInButton = SignInButtonStub;
let _UserButton = UserButtonStub;

if (isClerkEnabled) {
  try {
    const clerk = require('@clerk/clerk-react');
    _useUser = clerk.useUser;
    _SignInButton = clerk.SignInButton;
    _UserButton = clerk.UserButton;
  } catch (_) {
    // Clerk not available — stubs already set
  }
}

export const useUser = _useUser;
export const SignInButton = _SignInButton;
export const UserButton = _UserButton;
