/**
 * Safe Clerk hook wrappers — work with or without ClerkProvider.
 * When Clerk is not configured, returns sensible defaults so the UI renders.
 */
import { useState, useEffect } from 'react';

let clerkAvailable = false;
let clerkHooks = null;

// Dynamically detect if Clerk is in the tree
try {
  // This is set in main.jsx when Clerk loads
  if (window.__clerk_loaded) {
    clerkAvailable = true;
  }
} catch (_) {}

export function useAuth() {
  const [ready, setReady] = useState(false);
  const [clerkUser, setClerkUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (window.__clerk_loaded) {
      clerkAvailable = true;
    }
    setReady(true);
  }, []);

  return {
    isSignedIn: window.__clerk_signed_in || false,
    isLoaded: true,
    user: window.__clerk_user || null,
  };
}
