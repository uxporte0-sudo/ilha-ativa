import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const typeLabels = {
  futebol: 'Futebol',
  basquete: 'Basquete',
  volei: 'Vôlei',
  tenis: 'Tênis',
  poliesportiva: 'Poliesportiva',
};

const statusConfig = {
  disponivel: { label: 'Disponível', class: 'bg-accent/15 text-accent border-accent/30' },
  em_uso: { label: 'Em Uso', class: 'bg-blue-100 text-blue-700 border-blue-300' },
  em_manutencao: { label: 'Em Manutenção', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  interditada: { label: 'Interditada', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export default function CourtCard({ court }) {
  const status = statusConfig[court.status] || statusConfig.disponivel;

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        {court.image_url ? (
          <img src={court.image_url} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <Badge className={cn("absolute top-3 right-3 border text-xs", status.class)}>
          {status.label}
        </Badge>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{court.name}</h3>
          <Badge variant="secondary" className="text-xs">{typeLabels[court.type] || court.type}</Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5" />
          {court.location}
        </p>
        {court.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{court.description}</p>
        )}
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1" disabled={court.status !== 'disponivel'}>
            <Link to="/agendar">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Criar ativo
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={`/reparos/novo?court=${court.id}`}>
              <Wrench className="w-3.5 h-3.5 mr-1.5" />
              Reparo
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
