import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, LayoutDashboard, MapPin, Plus, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import LOGO_URL from '@/assets/logo.webp';

const navItems = [
  { label: 'Painel', path: '/', icon: LayoutDashboard },
  { label: 'Quadras', path: '/quadras', icon: MapPin },
  { label: 'Criar Ativo', path: '/agendar', icon: Plus },
  { label: 'Solicitar Reparo', path: '/reparos/novo', icon: Wrench },
  { label: 'Minhas Solicitações', path: '/minhas-solicitacoes', icon: ClipboardList },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 w-64 bg-card border-r flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="IlhAtiva" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">
                <span className="text-primary">Ilh</span><span className="text-accent">Ativa</span>
              </h1>
              <p className="text-xs text-muted-foreground">Espaços Esportivos</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
            <p className="text-xs font-medium text-foreground">Prefeitura de Ilhabela</p>
            <p className="text-xs text-muted-foreground mt-1">Gestão de Espaços Esportivos</p>
          </div>
        </div>
      </aside>
    </>
  );
}
