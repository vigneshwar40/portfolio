import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SESSION_KEY = "portfolio_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

async function sha256(value: string): Promise<string> {
  if (!crypto?.subtle) {
    throw new Error(
      "Passcode verification requires a secure context (HTTPS or localhost). This page was loaded over an insecure origin.",
    );
  }
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readSession(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const timestamp = Number(raw);
    if (Number.isNaN(timestamp) || Date.now() - timestamp > SESSION_DURATION_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const logoClicks = useRef<number[]>([]);

  const requestUnlock = useCallback(() => {
    if (isAuthenticated) {
      setAdminOpen(true);
      return;
    }

    if (!import.meta.env.VITE_ADMIN_PASSCODE_HASH) {
      toast.error("Admin access is not configured on this host.");
      return;
    }

    setShowPasscodeDialog(true);
  }, [isAuthenticated]);

  const verifyPasscode = useCallback(async (passcode: string) => {
    const expectedHash = import.meta.env.VITE_ADMIN_PASSCODE_HASH;
    if (!expectedHash) {
      toast.error("Admin access is not configured on this host.");
      return false;
    }

    try {
      const inputHash = await sha256(passcode);
      if (inputHash !== expectedHash) {
        toast.error("Incorrect passcode.");
        return false;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not verify passcode.");
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, String(Date.now()));
    setIsAuthenticated(true);
    setShowPasscodeDialog(false);
    setAdminOpen(true);
    toast.success("Creator mode enabled.");
    return true;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setAdminOpen(false);
    toast.info("Creator session ended.");
  }, []);

  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    logoClicks.current = logoClicks.current.filter((t) => now - t < 2000);
    logoClicks.current.push(now);
    if (logoClicks.current.length >= 5) {
      logoClicks.current = [];
      requestUnlock();
    }
  }, [requestUnlock]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        requestUnlock();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestUnlock]);

  return {
    isAuthenticated,
    showPasscodeDialog,
    setShowPasscodeDialog,
    adminOpen,
    setAdminOpen,
    verifyPasscode,
    handleLogoClick,
    signOut,
  };
}
