const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, CalendarDays, Wrench, ClipboardList, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LOGO_URL = 'https://media.db.com/images/public/69dec7d9e449de930c53c8e9/ec9c6d370_ChatGPTImage15deabrde202620_37_01.png';

const navItems = [
  { label: 'Painel', path: '/', icon: LayoutDashboard },
  { label: 'Quadras', path: '/quadras', icon: MapPin },
  { label: 'Agendar', path: '/agendar', icon: CalendarDays },
  { label: 'Solicitar Reparo', path: '/reparos/novo', icon: Wrench },
  { label: 'Minhas Solicitações', path: '/minhas-solicitacoes', icon: ClipboardList },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="IlhAtiva" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-lg">IlhAtiva</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 z-40 w-64 bg-card border-r flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
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