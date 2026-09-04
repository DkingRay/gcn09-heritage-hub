const ADMIN_EMAIL = "admin@gcn09set.org";
const ADMIN_PASSWORD = "ADMIN1234";
const ADMIN_SESSION_KEY = "gcn09_admin";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
