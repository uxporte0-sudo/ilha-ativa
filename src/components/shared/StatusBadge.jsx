import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const bookingStatusConfig = {
  pendente: { label: 'Pendente', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  confirmado: { label: 'Confirmado', class: 'bg-accent/15 text-accent border-accent/30' },
  cancelado: { label: 'Cancelado', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

const repairStatusConfig = {
  aberto: { label: 'Aberto', class: 'bg-primary/10 text-primary border-primary/30' },
  em_andamento: { label: 'Em Andamento', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  concluido: { label: 'Concluído', class: 'bg-accent/15 text-accent border-accent/30' },
};

const priorityConfig = {
  baixa: { label: 'Baixa', class: 'bg-muted text-muted-foreground border-border' },
  media: { label: 'Média', class: 'bg-primary/10 text-primary border-primary/30' },
  alta: { label: 'Alta', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  urgente: { label: 'Urgente', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export function BookingStatusBadge({ status }) {
  const config = bookingStatusConfig[status] || bookingStatusConfig.pendente;
  return <Badge className={cn("border text-xs", config.class)}>{config.label}</Badge>;
}

export function RepairStatusBadge({ status }) {
  const config = repairStatusConfig[status] || repairStatusConfig.aberto;
  return <Badge className={cn("border text-xs", config.class)}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.media;
  return <Badge className={cn("border text-xs", config.class)}>{config.label}</Badge>;
}