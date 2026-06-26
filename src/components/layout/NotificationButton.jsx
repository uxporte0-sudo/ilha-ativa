import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotificationButton({ className, onClick }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('relative', className)}
      onClick={onClick}
      aria-label="Notificações"
    >
      <Bell className="h-5 w-5 text-text-primary" />
      {/* Placeholder para badge de notificações não lidas */}
      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center hidden">
        0
      </span>
    </Button>
  );
}