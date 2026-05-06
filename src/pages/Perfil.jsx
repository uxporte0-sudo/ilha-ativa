import { db } from '@/api/Client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';

import { CalendarDays, MapPin, Wrench, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatCard from '@/components/shared/StatCard';
import { BookingStatusBadge, RepairStatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import { motion } from 'framer-motion';

export default function Perfil() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name ?? '',
    age: user?.age ?? '',
    address: user?.address ?? '',
    phone: user?.phone ?? '',
  });

  const { data: courts = [] } = useQuery({
    queryKey: ['courts'],
    queryFn: () => db.entities.Court.list(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => db.entities.Booking.list('-created_date', 50),
  });

  const { data: repairs = [] } = useQuery({
    queryKey: ['repairs'],
    queryFn: () => db.entities.RepairRequest.list('-created_date', 50),
  });

  const openRepairs = repairs.filter(r => r.status !== 'concluido');
  const todayBookings = bookings.filter(b => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return b.date === today && b.status !== 'cancelado';
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => db.entities.User.update(user.id, data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  function updateProfileField(field, value) {
    setProfileForm((profile) => ({
      ...profile,
      [field]: value,
    }));
  }

  function saveProfile(event) {
    event.preventDefault();
    updateProfileMutation.mutate(profileForm);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-bold"
        >
          Painel de Controle
        </motion.h1>
        <p className="text-muted-foreground mt-1">Gestão das quadras públicas de Ilhabela</p>
      </div>

      <Card className="p-5">
        <form onSubmit={saveProfile} className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Administrador Dev</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={profileForm.full_name}
                onChange={(event) => updateProfileField('full_name', event.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-age">Idade</Label>
              <Input
                id="profile-age"
                type="number"
                min="0"
                value={profileForm.age}
                onChange={(event) => updateProfileField('age', event.target.value)}
                placeholder="Idade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-address">Endereço</Label>
              <Input
                id="profile-address"
                value={profileForm.address}
                onChange={(event) => updateProfileField('address', event.target.value)}
                placeholder="Endereço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefone</Label>
              <Input
                id="profile-phone"
                value={profileForm.phone}
                onChange={(event) => updateProfileField('phone', event.target.value)}
                placeholder="(12) 99999-9999"
              />
            </div>
          </div>

          <Button type="submit" disabled={updateProfileMutation.isPending || !profileForm.full_name}>
            {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar perfil'}
          </Button>
        </form>
      </Card>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard title="Quadras" value={courts.length} icon={MapPin} color="primary" />
        <StatCard title="Agendamentos Hoje" value={todayBookings.length} icon={CalendarDays} color="accent" />
        <StatCard title="Reparos Abertos" value={openRepairs.length} icon={Wrench} color="warning" />
        <StatCard title="Urgentes" value={repairs.filter(r => r.priority === 'urgente' && r.status !== 'concluido').length} icon={AlertTriangle} color="destructive" />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Criar Ativo</h3>
          <p className="text-sm text-muted-foreground mb-4">Cadastre uma atividade usando as categorias disponíveis.</p>
          <Button asChild>
            <Link to="/agendar">
              <Plus className="w-4 h-4 mr-2" />
              Criar Ativo
            </Link>
          </Button>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg mb-2">Solicitar Reparo</h3>
          <p className="text-sm text-muted-foreground mb-4">Reporte um problema em uma quadra para manutenção.</p>
          <Button asChild variant="outline">
            <Link to="/reparos/novo">
              <Wrench className="w-4 h-4 mr-2" />
              Solicitar Reparo
            </Link>
          </Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold">Agendamentos Recentes</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/minhas-solicitacoes" className="text-primary">
                Ver todos <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{booking.court_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.date && format(new Date(booking.date + 'T12:00:00'), "dd 'de' MMM", { locale: ptBR })} • {booking.time_slot}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nenhum agendamento encontrado
              </div>
            )}
          </div>
        </Card>

        {/* Recent Repairs */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold">Solicitações de Reparo</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/minhas-solicitacoes" className="text-primary">
                Ver todos <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y">
            {repairs.slice(0, 5).map((repair) => (
              <div key={repair.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{repair.title}</p>
                  <p className="text-xs text-muted-foreground">{repair.court_name}</p>
                </div>
                <div className="flex gap-2">
                  <PriorityBadge priority={repair.priority} />
                  <RepairStatusBadge status={repair.status} />
                </div>
              </div>
            ))}
            {repairs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nenhuma solicitação de reparo
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
