/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let json
    try { json = JSON.parse(text) } catch { json = { message: text } }
    const err: any = new Error(json.message || res.statusText)
    err.status = res.status
    err.body = json
    throw err
  }
  return res.status !== 204 ? res.json() : null
}
