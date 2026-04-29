import React from 'react';
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

      <div className="flex flex-wrap justify-center gap-8">
        <Button asChild className="bg-[#F97415]">
          <Link to="/agendar">
            <CalendarDays className="w-4 h-4 mr-2" />
            Agenda
          </Link>
        </Button>

        <Button asChild className="bg-[#F97415]">
          <Link to="/quadras">
            <MapPin className="w-4 h-4 mr-2" />
            Mapa
          </Link>
        </Button>

        <Button asChild className="bg-[#F97415]">
          <Link to="/reparos/novo">
            <Wrench className="w-4 h-4 mr-2" />
            Reparo
          </Link>
        </Button>

        <Button asChild className="bg-[#F97415]">
          <Link to="/minhas-solicitacoes">
            <User className="w-4 h-4 mr-2" />
            Perfil
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
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="IlhAtiva" className="w-8 h-8 object-contain rounded-full" />
          <span className="font-display font-bold text-lg leading-tight">
            <span className="text-primary">Ilh</span>
            <span className="text-accent">Ativa</span>
          </span>
        </div>
      </Link>
    </header>
  );
}
