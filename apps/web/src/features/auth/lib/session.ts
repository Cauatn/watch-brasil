import Cookies from "universal-cookie";

const ACCESS_KEY = "wb_access_token";
const REFRESH_KEY = "wb_refresh_token";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

const cookies = new Cookies();

function setCookie(name: string, value: string, maxAge: number) {
  cookies.set(name, value, { path: "/", maxAge, sameSite: "lax" });
}

export function getAccessToken(): string | null {
  const v = cookies.get(ACCESS_KEY);
  return typeof v === "string" ? v : null;
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  setCookie(ACCESS_KEY, tokens.accessToken, ACCESS_MAX_AGE);
  setCookie(REFRESH_KEY, tokens.refreshToken, REFRESH_MAX_AGE);
}

export function clearSession() {
  cookies.remove(ACCESS_KEY, { path: "/" });
  cookies.remove(REFRESH_KEY, { path: "/" });
}
