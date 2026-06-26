import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logotipo from '@/components/assets/Logotipo.png';

export default function LogoButton({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center justify-center',
        className
      )}
      aria-label="Ir para a Home"
    >
      <img
        src={logotipo}
        alt="IlhAtiva"
        className="h-8 w-auto"
      />
    </Link>
  );
}