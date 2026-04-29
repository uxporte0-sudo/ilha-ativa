import React /*, { useEffect, useState }*/ from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Menu, User, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LOGO_URL from '@/assets/logo.webp';

export default function Header({ open, setOpen }) {
  return (
    <header className="
      fixed top-0 left-0 right-0 z-50
      px-4 py-3
      bg-[#1BA77F]/70
      backdrop-blur-xl
      border-b border-white/30
      rounded-b-sm
      shadow-sm
      flex items-center justify-between">

      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Área central dos botões */}

      <div className="flex flex-row flex-nowrap items-center justify-center gap-2 md:gap-8">

        {/* Botão de agenda */}
        <Button asChild className="bg-accent rounded-full md:rounded-sm md:bg-[#F97415]">
          <Link to="/agendar">
            <CalendarDays className="w-4 h-4 md:mr-2 text-primary md:text-white" />
            <span className='hidden md:inline'>Agenda</span>
          </Link>
        </Button>

        {/* Botão de mapa */}
        <Button asChild className="bg-accent rounded-full md:rounded-sm md:bg-[#F97415]">
          <Link to="/quadras">
            <MapPin className="w-4 h-4 md:mr-2 text-primary md:text-white" />
            <span className='hidden md:inline'>Mapa</span>
          </Link>
        </Button>

        {/* Botão de reparo */}
        <Button asChild className="bg-accent rounded-full md:rounded-sm md:bg-[#F97415]">
          <Link to="/reparos/novo">
            <Wrench className="w-4 h-4 md:mr-2 text-primary md:text-white" />
            <span className='hidden md:inline'>Reparo</span>
          </Link>
        </Button>

        {/* Botão de perfil */}
        <Button asChild className="bg-accent rounded-full md:rounded-sm md:bg-[#F97415]">
          <Link to="/minhas-solicitacoes">
            <User className="w-4 h-4 md:mr-2 text-primary md:text-white" />
            <span className='hidden md:inline'>Perfil</span>
          </Link>
        </Button>
      </div>

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
          <img src={LOGO_URL} alt="IlhAtiva" className="w-6 h-8 object-contain rounded-full" />
          <span className="font-display font-bold text-lg leading-tight">
            <span className="hidden md:inline text-primary">Ilh</span>
            <span className="hidden md:inline text-accent">Ativa</span>
          </span>
        </div>
      </Link>
    </header>
  );
}
