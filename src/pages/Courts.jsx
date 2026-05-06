import { db } from '@/api/Client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, List, Map } from 'lucide-react';
import CourtCard from '@/components/shared/CourtCard';
import CourtsMap from '@/components/courts/CourtsMap';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Courts() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [view, setView] = useState('map');

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: () => db.entities.Court.list(),
  });

  const filtered = courts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold">
            Quadras Públicas
          </motion.h1>
          <p className="text-muted-foreground mt-1">Encontre quadras disponíveis em Ilhabela</p>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={view === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('map')}
            className="flex items-center gap-1.5"
          >
            <Map className="w-4 h-4" /> Mapa
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="flex items-center gap-1.5"
          >
            <List className="w-4 h-4" /> Lista
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar quadra ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="futebol">Futebol</SelectItem>
            <SelectItem value="basquete">Basquete</SelectItem>
            <SelectItem value="volei">Vôlei</SelectItem>
            <SelectItem value="tenis">Tênis</SelectItem>
            <SelectItem value="poliesportiva">Poliesportiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === 'map' ? (
        <CourtsMap courts={filtered} isLoading={isLoading} />
      ) : (
        isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((court, i) => (
              <motion.div key={court.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <CourtCard court={court} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhuma quadra encontrada
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
