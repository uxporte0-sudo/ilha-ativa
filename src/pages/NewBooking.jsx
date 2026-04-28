const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export default function NewBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedCourt = urlParams.get('court');

  const [form, setForm] = useState({
    court_id: preselectedCourt || '',
    date: '',
    time_slot: '',
    duration: '1h',
    purpose: '',
    requester_name: '',
    requester_phone: '',
  });
  const [success, setSuccess] = useState(false);

  const { data: courts = [] } = useQuery({
    queryKey: ['courts'],
    queryFn: () => db.entities.Court.list(),
  });

  const { data: existingBookings = [] } = useQuery({
    queryKey: ['bookings-for-date', form.court_id, form.date],
    queryFn: () => form.court_id && form.date
      ? db.entities.Booking.filter({ court_id: form.court_id, date: form.date })
      : [],
    enabled: !!(form.court_id && form.date),
  });

  const bookedSlots = existingBookings
    .filter(b => b.status !== 'cancelado')
    .map(b => b.time_slot);

  const selectedCourt = courts.find(c => c.id === form.court_id);

  useEffect(() => {
    if (selectedCourt) {
      setForm(prev => ({ ...prev, court_name: selectedCourt.name }));
    }
  }, [selectedCourt]);

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Booking.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSuccess(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      court_name: selectedCourt?.name || '',
      status: 'pendente',
    });
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto mt-12 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Agendamento Enviado!</h2>
        <p className="text-muted-foreground mb-6">Sua solicitação de agendamento foi registrada e está pendente de confirmação.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/minhas-solicitacoes')}>Ver Solicitações</Button>
          <Button onClick={() => { setSuccess(false); setForm({ court_id: '', date: '', time_slot: '', duration: '1h', purpose: '', requester_name: '', requester_phone: '' }); }}>
            Novo Agendamento
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold">
          Agendar Quadra
        </motion.h1>
        <p className="text-muted-foreground mt-1">Preencha os dados para reservar um horário</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Quadra *</Label>
            <Select value={form.court_id} onValueChange={(v) => setForm({ ...form, court_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma quadra" />
              </SelectTrigger>
              <SelectContent>
                {courts.filter(c => c.status === 'disponivel').map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} — {c.location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                    {form.date ? format(new Date(form.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR }) : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.date ? new Date(form.date + 'T12:00:00') : undefined}
                    onSelect={(date) => date && setForm({ ...form, date: format(date, 'yyyy-MM-dd') })}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Duração</Label>
              <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hora</SelectItem>
                  <SelectItem value="2h">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.court_id && form.date && (
            <div className="space-y-2">
              <Label>Horário *</Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {timeSlots.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = form.time_slot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setForm({ ...form, time_slot: slot })}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                        isBooked 
                          ? 'bg-muted text-muted-foreground/50 cursor-not-allowed line-through'
                          : isSelected
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted/50 hover:bg-muted text-foreground'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seu Nome *</Label>
              <Input
                value={form.requester_name}
                onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.requester_phone}
                onChange={(e) => setForm({ ...form, requester_phone: e.target.value })}
                placeholder="(12) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Finalidade</Label>
            <Textarea
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="Ex: Treino de futebol, jogo amistoso, evento escolar..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!form.court_id || !form.date || !form.time_slot || !form.requester_name || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
            ) : (
              <><CalendarDays className="w-4 h-4 mr-2" /> Solicitar Agendamento</>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}