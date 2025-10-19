import Link from 'next/link';
import { Link as LinkType } from '@/types';

interface LinksListProps {
  links: LinkType[];
  onDelete: (id: number) => void;
}

export function LinksList({ links, onDelete }: LinksListProps) {
  if (links.length === 0) {
    return <p className="text-gray-600 mt-6">Você ainda não adicionou nenhum link.</p>;
  }

  return (
    <ul className="mt-4 space-y-3" role="list">
      {links.map((link) => (
        <li
          key={link.id}
          className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div>
            <p className="font-medium text-gray-900">{link.title}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm break-all hover:underline"
              aria-label={`Visitar ${link.title}`}
            >
              {link.url}
            </a>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/profile/links/${link.id}/edit`}
              className="text-sm text-blue-500 hover:underline"
              aria-label={`Editar link ${link.title}`}
            >
              Editar
            </Link>
            <button
              onClick={() => onDelete(link.id)}
              className="text-sm text-red-500 hover:underline"
              aria-label={`Excluir link ${link.title}`}
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
