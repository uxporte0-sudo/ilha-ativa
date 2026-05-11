import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Menu, Plus, User, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LOGO_URL from '@/assets/logo.webp';
import useScrollDirections from '@/hooks/use-scroll-directions';

/**
 * NavButton
 *
 * Componente reutilizável para botões de navegação do header.
 *
 * Props:
 * - to: rota de destino
 * - icon: ícone (componente do lucide-react)
 * - label: texto exibido (apenas em telas maiores)
 *
 * Comportamento:
 * - Mobile: mostra apenas o ícone
 * - Desktop: mostra ícone + texto
 */
function NavButton({ to, icon: Icon, label }) {
  return (
    <Button
      asChild
      className="bg-gradient-accent rounded-full md:rounded-sm hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <Link to={to}>
        <Icon className="w-4 h-4 md:mr-2 text-white" />
        <span className="hidden md:inline">{label}</span>
      </Link>
    </Button>
  );
}


/**
 * Header
 *
 * Cabeçalho principal da aplicação.
 *
 * Responsabilidades:
 * - Navegação entre páginas
 * - Controle do menu lateral (mobile)
 * - Exibição da marca/logo
 * - Comportamento dinâmico de visibilidade baseado no scroll
 *
 * Props:
 * - open: boolean → estado do menu lateral
 * - setOpen: função → alterna o menu lateral
 *
 * Comportamento de scroll:
 * - Mobile:
 *    - Scroll para baixo → header some
 *    - Scroll para cima → header aparece
 * - Desktop:
 *    - Sempre visível (override com md:translate-y-0)
 */
export default function Header({ open, setOpen }) {

  /**
   * Hook que detecta direção do scroll
   * isVisible controla se o header deve estar visível
   */
  const { isVisible } = useScrollDirections();

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        px-4 py-3

        /* Visual */
        bg-primary/85
        backdrop-blur-xl
        border-b border-white/30
        rounded-b-sm
        shadow-sm

        /* Layout */
        flex items-center justify-between

        /* Animação de entrada/saída */
        transition-transform duration-300

        /* Controle de visibilidade (mobile) */
        ${isVisible ? "translate-y-0" : "-translate-y-full"}

        /* Desktop: sempre visível */
        md:translate-y-0
      `}
    >

      {/* Botão de menu (abre/fecha sidebar) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
      >
        {open
          ? <X className="w-5 h-5" />     // ícone de fechar
          : <Menu className="w-5 h-5" /> // ícone de menu
        }
      </Button>

      {/* Navegação principal */}
      <div className="flex flex-row flex-nowrap items-center justify-center gap-2 md:gap-8">
        <NavButton to="/agendar" icon={Plus} label="Criar" />
        <NavButton to="/quadras" icon={MapPin} label="Mapa" />
        <NavButton to="/reparos/novo" icon={Wrench} label="Reparo" />
        <NavButton to="/Perfil" icon={User} label="Perfil" />
      </div>

      {/* Logo / Home */}
      <Link
        to="/"
        className="
          flex items-center gap-2
          rounded-full
          bg-white/70
          px-3 py-1.5
          border border-white/50
          shadow-inner
          backdrop-blur-sm
        "
      >
        <div className="flex items-center md:gap-2">
          <img
            src={LOGO_URL}
            alt="IlhAtiva"
            className="w-6 h-8 object-contain rounded-full"
          />

          {/* Nome da marca (apenas desktop) */}
          <span className="font-display font-bold text-lg leading-tight">
            <span className="hidden md:inline text-primary">Ilh</span>
            <span className="hidden md:inline text-accent">Ativa</span>
          </span>
        </div>
      </Link>

    </header>
  );
}
