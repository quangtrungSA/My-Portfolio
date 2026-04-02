import { SignJWT, jwtVerify } from "jose";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const JWT_SECRET =
  process.env.JWT_SECRET || "portfolio-jwt-secret-key-change-in-production-2024";
const COOKIE_NAME = "portfolio_token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function signToken(payload: { username: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createTokenCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

export function createLogoutCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export { COOKIE_NAME };

