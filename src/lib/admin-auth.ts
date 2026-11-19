/**
 * Admin authentication helper.
 * Credentials are stored in Firestore under admins/main.
 * Session is kept in sessionStorage so it expires on tab close.
 */
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SESSION_KEY = "bbc_admin_session";

export interface AdminCredentials {
  userId: string;
  password: string; // plain text for MVP (hash on a real backend)
}

/** Check if admin is currently logged in (session exists). */
export function getAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    window.dispatchEvent(new Event("admin-session-updated"));
  } catch {}
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("admin-session-updated"));
  } catch {}
}

/** Write admin credentials to Firestore (run once to seed). */
export async function seedAdminCredentials(userId: string, password: string): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "admins", "main"), { userId, password }, { merge: false });
}

/** Authenticate against Firestore credentials (falls back to env defaults). */
export async function authenticateAdmin(userId: string, password: string): Promise<boolean> {
  // Try Firestore first
  if (db) {
    try {
      const snap = await getDoc(doc(db, "admins", "main"));
      if (snap.exists()) {
        const data = snap.data() as AdminCredentials;
        if (data.userId === userId && data.password === password) {
          setAdminSession();
          return true;
        }
        return false;
      }
    } catch (err) {
      console.warn("Firestore admin lookup failed, using local fallback:", err);
    }
  }

  // Local fallback credentials (env or hardcoded default)
  const envUser = import.meta.env["VITE_ADMIN_USER_ID"] ?? "admin";
  const envPass = import.meta.env["VITE_ADMIN_PASSWORD"] ?? "bbcmotors2024";
  if (userId === envUser && password === envPass) {
    setAdminSession();
    return true;
  }
  return false;
}
