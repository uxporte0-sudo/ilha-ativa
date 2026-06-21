import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchField({ value, onChange, placeholder = 'Buscar Ativos e Locais', className }) {
  return (
    <label
      className={cn(
        'flex h-12 w-full items-center gap-3 rounded-[var(--radius-control)] border border-borderSemantic-subtle bg-container-secondary px-4 text-sm shadow-sm focus-within:border-borderSemantic-focus focus-within:ring-2 focus-within:ring-interaction-focus/30',
        className
      )}
    >
      <Search className="h-5 w-5 shrink-0 text-text-tertiary" aria-hidden="true" />
      <span className="sr-only">Buscar</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-disabled"
        type="search"
      />
    </label>
  );
}
