import { cn } from '@/lib/utils';
import NotificationButton from '../NotificationButton';
import AvatarButton from '../AvatarButton';

/**
 * HeaderActions
 * Responsabilidade: Agrupar todos os botões de ação do Header.
 * Nesta fase conterá: NotificationButton, AvatarButton
 * No futuro poderá receber: SearchButton, FilterButton, ShareButton
 * Portanto deve nascer reutilizável.
 */
export default function HeaderActions({ 
  className,
  showNotification = true,
  showAvatar = true,
  onNotificationClick,
  ...props
}) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {showNotification && (
        <NotificationButton onClick={onNotificationClick} />
      )}
      {showAvatar && (
        <AvatarButton />
      )}
    </div>
  );
}