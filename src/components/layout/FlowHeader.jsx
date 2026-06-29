import { ArrowLeft, Plus } from "lucide-react";

export default function FlowHeader({
  title,
  subtitle,
  icon: Icon,
  onBack,
  onAction,
  actionIcon: ActionIcon,
  showBack = true,
}) {
  return (
    <header className="bg-text-primary rounded-b-3xl shadow-lg px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center h-9 w-9 rounded-full text-text-inverse hover:bg-text-inverse/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon className="h-5 w-5 shrink-0 text-brand-secondary" />
              )}
              <h1 className="text-lg font-bold text-brand-accent truncate">
                {title}
              </h1>
            </div>

            {subtitle && (
              <p className="text-[13px] leading-4 text-text-inverse truncate opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center justify-center h-11 w-11 rounded-full border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10"
          >
            {ActionIcon ? <ActionIcon className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
