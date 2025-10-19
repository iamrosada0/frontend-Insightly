/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = 'insightly_token';

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(TOKEN_KEY, token);
    console.log('Token salvo:', token); // Debug
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log('Lendo token:', token); // Debug
    return token;
  }
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
    console.log('Token removido'); // Debug
  }
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUsernameFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.username || decoded.sub || null;
  } catch {
    return null;
  }
}