// LEGACY - DO NOT USE in official MVP flows.
// EventLobby is outside the MVP official domain.
import { db } from '@/api/Client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EMOJIS = ['😊', '🏃', '🧘', '🥾', '🏊', '🚴', '🌿', '🌊', '⚡', '🔥', '🌞', '🎯'];

export default function EventLobbyPanel({ event, onClose }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [joining, setJoining] = useState(false);

  const { data: participants = [] } = useQuery({
    queryKey: ['lobby', event.id],
    queryFn: () => db.entities.EventLobby.filter({ event_id: event.id }),
    refetchInterval: 5000,
  });

  const joinMutation = useMutation({
    mutationFn: (data) => db.entities.EventLobby.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lobby', event.id] });
      setName('');
      setMessage('');
      setJoining(false);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (id) => db.entities.EventLobby.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lobby', event.id] }),
  });

  function handleJoin(e) {
    e.preventDefault();
    if (!name.trim()) return;
    joinMutation.mutate({
      event_id: event.id,
      event_name: event.name,
      event_type: event.emoji === '🧘' ? 'yoga' : 'trilha',
      participant_name: name.trim(),
      participant_emoji: selectedEmoji,
      message: message.trim(),
    });
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 bottom-0 z-[1000] w-80 bg-card/97 backdrop-blur-md border-l shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between gap-2" style={{ background: `${event.color}18` }}>
        <div>
          <div className="text-2xl mb-1">{event.emoji}</div>
          <h3 className="font-semibold text-sm leading-tight">{event.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Participants */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{participants.length} confirmado{participants.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex -space-x-1">
            {participants.slice(0, 5).map((p) => (
              <div key={p.id} className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-sm" title={p.participant_name}>
                {p.participant_emoji}
              </div>
            ))}
            {participants.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{participants.length - 5}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {participants.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/50 group"
            >
              <div className="text-xl leading-none mt-0.5">{p.participant_emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.participant_name}</p>
                {p.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.message}</p>}
              </div>
              <button
                onClick={() => leaveMutation.mutate(p.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {participants.length === 0 && !joining && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <div className="text-3xl mb-2">👋</div>
            Seja o primeiro a confirmar presença!
          </div>
        )}
      </div>

      {/* Join form */}
      <div className="p-4 border-t bg-card">
        {!joining ? (
          <Button className="w-full" size="sm" onClick={() => setJoining(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Confirmar minha presença
          </Button>
        ) : (
          <form onSubmit={handleJoin} className="space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={`text-lg w-8 h-8 rounded-lg transition-all ${selectedEmoji === e ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'hover:bg-muted'}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Input
              placeholder="Seu nome *"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-8 text-sm"
              required
            />
            <Input
              placeholder="Mensagem (opcional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setJoining(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="flex-1" disabled={joinMutation.isPending || !name.trim()}>
                {joinMutation.isPending ? '...' : 'Entrar no lobby'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
