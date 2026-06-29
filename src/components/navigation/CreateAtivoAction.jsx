import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateAtivoAction({ className }) {
  return (
    <NavLink
      to="/ativos/novo"
      aria-label="Criar Ativo"
      className={cn('group flex flex-col items-center text-[11px] font-bold text-text-inverse outline-none', className)}
    >
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary text-text-inverse shadow-button transition-transform group-hover:-translate-y-1 group-hover:bg-red-500 group-focus-visible:ring-2 group-focus-visible:ring-interaction-focus group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface-inverse">
        <Plus className="h-11 w-11" />
      </span>
      <span className="sr-only">Criar Ativo</span>
    </NavLink>
  );
}
