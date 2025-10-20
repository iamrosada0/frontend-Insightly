import {jwtDecode} from "jwt-decode";

export const TOKEN_KEY = 'insightly_token';

interface JwtPayload {
  username?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown; 
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token;
  }
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUsernameFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token); 
    return decoded.username ?? decoded.sub ?? null;
  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    return null;
  }
}
