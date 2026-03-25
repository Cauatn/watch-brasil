import Cookies from "universal-cookie";

const ACCESS_KEY = "wb_access_token";
const REFRESH_KEY = "wb_refresh_token";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

const cookies = new Cookies();

function cookieSetOpts(maxAgeSeconds: number) {
  const secure =
    typeof globalThis !== "undefined" &&
    "location" in globalThis &&
    globalThis.location.protocol === "https:";
  return {
    path: "/",
    maxAge: maxAgeSeconds,
    sameSite: "lax" as const,
    ...(secure ? { secure: true } : {}),
  };
}

function migrateFromLocalStorageOnce() {
  if (typeof localStorage === "undefined") return;
  const access = localStorage.getItem(ACCESS_KEY);
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!access || !refresh) return;
  if (cookies.get(ACCESS_KEY)) {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    return;
  }
  cookies.set(ACCESS_KEY, access, cookieSetOpts(ACCESS_MAX_AGE));
  cookies.set(REFRESH_KEY, refresh, cookieSetOpts(REFRESH_MAX_AGE));
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  migrateFromLocalStorageOnce();
  const v = cookies.get(ACCESS_KEY);
  return typeof v === "string" ? v : null;
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  cookies.set(ACCESS_KEY, tokens.accessToken, cookieSetOpts(ACCESS_MAX_AGE));
  cookies.set(REFRESH_KEY, tokens.refreshToken, cookieSetOpts(REFRESH_MAX_AGE));
}

export function clearSession() {
  cookies.remove(ACCESS_KEY, { path: "/" });
  cookies.remove(REFRESH_KEY, { path: "/" });
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
