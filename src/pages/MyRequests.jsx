import { db } from '@/api/base44Client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarDays, Wrench, MapPin, Clock, User, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { BookingStatusBadge, RepairStatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';

export default function MyRequests() {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (id) => db.entities.Booking.update(id, { status: 'cancelado' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => db.entities.Booking.list('-created_date', 100),
  });

  const { data: repairs = [], isLoading: loadingRepairs } = useQuery({
    queryKey: ['repairs'],
    queryFn: () => db.entities.RepairRequest.list('-created_date', 100),
  });

  return (
    <div className="space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold">
          Minhas Solicitações
        </motion.h1>
        <p className="text-muted-foreground mt-1">Acompanhe seus agendamentos e solicitações de reparo</p>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="bookings" className="flex-1 sm:flex-initial">
            <CalendarDays className="w-4 h-4 mr-2" />
            Agendamentos ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="repairs" className="flex-1 sm:flex-initial">
            <Wrench className="w-4 h-4 mr-2" />
            Reparos ({repairs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4 space-y-3">
          {loadingBookings ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
            </Card>
          ) : (
            bookings.map((booking, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{booking.court_name}</h3>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {booking.date && format(new Date(booking.date + 'T12:00:00'), "dd 'de' MMM yyyy", { locale: ptBR })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.time_slot} ({booking.duration || '1h'})
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {booking.requester_name}
                        </span>
                      </div>
                      {booking.purpose && (
                        <p className="text-sm text-muted-foreground mt-1">{booking.purpose}</p>
                      )}
                    </div>
                    {booking.status !== 'cancelado' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0">
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Cancelar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar agendamento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja cancelar o agendamento da <strong>{booking.court_name}</strong> no dia{' '}
                              {booking.date && format(new Date(booking.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })} às {booking.time_slot}?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => cancelMutation.mutate(booking.id)}
                            >
                              {cancelMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cancelamento'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="repairs" className="mt-4 space-y-3">
          {loadingRepairs ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : repairs.length === 0 ? (
            <Card className="p-12 text-center">
              <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma solicitação de reparo</p>
            </Card>
          ) : (
            repairs.map((repair, i) => (
              <motion.div key={repair.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{repair.title}</h3>
                        <RepairStatusBadge status={repair.status} />
                        <PriorityBadge priority={repair.priority} />
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {repair.court_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{repair.description}</p>
                    </div>
                    {repair.image_url && (
                      <img src={repair.image_url} alt="Foto do problema" className="w-20 h-20 rounded-lg object-cover" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
