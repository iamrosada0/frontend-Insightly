/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { LinkCard } from '@/components/LinkCard'
import { FeedbackForm } from '@/components/FeedbackForm'

interface Props {
  params: Promise<{ username: string }> 
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params 
  return { title: `${username} • Insightly` }
}

export default async function Page({ params }: Props) {
  const { username } = await params 
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return <div className="py-20 text-center">Usuário não encontrado</div>
  }

  const user = await res.json()

  return (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{user.name ?? user.username}</h1>
        <p className="text-gray-600">{user.bio}</p>
      </div>

      <div className="grid gap-4">
        {user.links?.map((l: any) => <LinkCard key={l.id} link={l} />)}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Enviar Feedback Anônimo</h2>
        <FeedbackForm username={username} />
      </div>
    </div>
  )
}
