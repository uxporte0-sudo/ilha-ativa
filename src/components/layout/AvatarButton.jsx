import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export default function AvatarButton({ className }) {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = user?.nome ? getInitials(user.nome) : 'U';

  return (
    <Link
      to="/conta"
      className={cn('flex items-center', className)}
      aria-label="Meu Perfil"
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn('relative h-10 w-10 rounded-full p-0', className)}
        aria-label="Meu Perfil"
      >
        {user?.foto ? (
          <img
            src={user.foto}
            alt={user.nome || 'Usuário'}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary font-semibold text-sm">
            {initials}
          </div>
        )}
      </Button>
    </Link>
  );
}