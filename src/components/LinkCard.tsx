export function LinkCard({ link }: { link: { id: number; title: string; url: string } }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium">{link.title}</a>
      <div className="text-sm text-gray-500 break-all">{link.url}</div>
    </div>
  )
}
