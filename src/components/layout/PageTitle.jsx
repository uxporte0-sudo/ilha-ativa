import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PageTitle({ title, description, action, showBack = true, className }) {
  const navigate = useNavigate();

  return (
    <header className={cn('flex w-full items-start gap-3', className)}>
      {showBack && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Voltar"
          onClick={() => navigate(-1)}
          className="mt-0.5 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold leading-tight text-text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm leading-5 text-text-secondary">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
