// LEGACY - DO NOT USE in official MVP flows.
// Replaced by future Zeladoria official flow.
import { db } from '@/api/Client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Check, Loader2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NewRepairRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedCourt = urlParams.get('court');

  const [form, setForm] = useState({
    court_id: preselectedCourt || '',
    title: '',
    description: '',
    priority: 'media',
    requester_name: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: courts = [] } = useQuery({
    queryKey: ['courts'],
    queryFn: () => db.entities.Court.list(),
  });

  const selectedCourt = courts.find(c => c.id === form.court_id);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let image_url = '';
      if (imageFile) {
        setUploading(true);
        const result = await db.integrations.Core.UploadFile({ file: imageFile });
        image_url = result.file_url;
        setUploading(false);
      }
      return db.entities.RepairRequest.create({
        ...data,
        court_name: selectedCourt?.name || '',
        image_url,
        status: 'aberto',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      setSuccess(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto mt-12 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Solicitação Enviada!</h2>
        <p className="text-muted-foreground mb-6">Sua solicitação de reparo foi registrada com sucesso.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/minhas-solicitacoes')}>Ver Solicitações</Button>
          <Button onClick={() => { setSuccess(false); setForm({ court_id: '', title: '', description: '', priority: 'media', requester_name: '' }); setImageFile(null); }}>
            Nova Solicitação
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold">
          Solicitar Reparo
        </motion.h1>
        <p className="text-muted-foreground mt-1">Reporte um problema em uma quadra pública</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Quadra *</Label>
            <Select value={form.court_id} onValueChange={(v) => setForm({ ...form, court_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a quadra" />
              </SelectTrigger>
              <SelectContent>
                {courts.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} — {c.location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Título do Problema *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Buraco no piso, rede rasgada, iluminação queimada..."
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição Detalhada *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              rows={4}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Seu Nome *</Label>
              <Input
                value={form.requester_name}
                onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto do Problema</Label>
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('repair-photo').click()}
            >
              {imageFile ? (
                <p className="text-sm text-foreground font-medium">{imageFile.name}</p>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar uma foto</p>
                </>
              )}
              <input
                id="repair-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!form.court_id || !form.title || !form.description || !form.requester_name || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {uploading ? 'Enviando foto...' : 'Enviando...'}</>
            ) : (
              <><Wrench className="w-4 h-4 mr-2" /> Enviar Solicitação</>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
