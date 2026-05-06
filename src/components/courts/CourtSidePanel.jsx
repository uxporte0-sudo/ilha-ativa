import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Wrench, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const typeLabels = {
  futebol: 'Futebol',
  basquete: 'Basquete',
  volei: 'Vôlei',
  tenis: 'Tênis',
  poliesportiva: 'Poliesportiva',
};

const typeEmojis = {
  futebol: '⚽',
  basquete: '🏀',
  volei: '🏐',
  tenis: '🎾',
  poliesportiva: '🏟️',
};

const statusConfig = {
  disponivel: { label: 'Disponível', class: 'bg-green-100 text-green-700 border-green-300' },
  em_uso: { label: 'Em Uso', class: 'bg-blue-100 text-blue-700 border-blue-300' },
  em_manutencao: { label: 'Em Manutenção', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  interditada: { label: 'Interditada', class: 'bg-red-100 text-red-700 border-red-300' },
};

export default function CourtSidePanel({ court, onClose }) {
  const status = statusConfig[court.status] || statusConfig.disponivel;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 bottom-0 z-[1000] w-72 bg-card/95 backdrop-blur-md border-l shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="text-3xl leading-none mt-0.5">{typeEmojis[court.type] || '🏟️'}</div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{court.name}</h3>
            <Badge className={cn("border text-xs mt-1", status.class)}>{status.label}</Badge>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {court.image_url && (
          <img src={court.image_url} alt={court.name} className="w-full h-36 object-cover rounded-xl" />
        )}

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{court.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <Badge variant="secondary" className="text-xs">{typeLabels[court.type] || court.type}</Badge>
          </div>
        </div>

        {court.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{court.description}</p>
        )}

        {/* Open in maps link */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.location + ', Ilhabela, SP')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <MapPin className="w-3.5 h-3.5" />
          Ver no Google Maps
        </a>
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <Button asChild className="w-full" size="sm" disabled={court.status !== 'disponivel'}>
          <Link to="/agendar">
            <Plus className="w-3.5 h-3.5 mr-2" />
            Criar ativo
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to={`/reparos/novo?court=${court.id}`}>
            <Wrench className="w-3.5 h-3.5 mr-2" />
            Solicitar Reparo
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
