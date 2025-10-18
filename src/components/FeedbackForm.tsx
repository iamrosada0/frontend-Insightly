// src/components/FeedbackForm.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function FeedbackForm({ username }: { username: string }) {
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState<null | boolean>(null)
  const [loading, setLoading] = useState(false)

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) throw new Error('Erro ao enviar')
      setOk(true)
      setMessage('')
    } catch (err) {
      setOk(false)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handle} className="space-y-2">
      {ok === true && <div className="text-green-600">Feedback enviado — obrigado!</div>}
      {ok === false && <div className="text-red-600">Erro ao enviar feedback.</div>}
      <textarea
        className="w-full border rounded p-2"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escreva um feedback anônimo..."
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</Button>
      </div>
    </form>
  )
}
