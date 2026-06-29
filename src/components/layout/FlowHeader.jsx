import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FlowHeader({
  title,
  subtitle,
  icon: Icon,
  onBack,
  onAction,
  actionLabel,
  showBack = true,
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-brand-primary shrink-0" />}
            <h1 className="text-base font-bold text-text-primary truncate">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-xs text-text-secondary truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {onAction && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onAction}
        >
          {actionLabel || <span className="text-lg">+</span>}
        </Button>
      )}
    </div>
  );
}