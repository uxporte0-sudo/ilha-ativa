import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Loader2, Users, Copy, MessageCircle, Instagram, Facebook, MoreHorizontal, Search, Plus } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import FlowHeader from '@/components/layout/FlowHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AtivoService } from '@/domain/ativo/service';
import { AtivoRulesService } from '@/domain/ativo/rulesService';
import { LocalService } from '@/domain/local/service';
import { SessionService } from '@/domain/user/sessionService';
import { UserService } from '@/domain/user/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'details', title: 'Detalhes' },
  { id: 'filters', title: 'Filtros' },
  { id: 'confirm', title: 'Confirmação' },
  { id: 'share', title: 'Compartilhar' },
];

const GENERO_OPTIONS = [
  { value: 'homem', label: 'Homem' },
  { value: 'mulher', label: 'Mulher' },
  { value: 'todos', label: 'Todos' },
];

const NIVEL_OPTIONS = [
  { value: 'facil', label: 'Fácil' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'dificil', label: 'Difícil' },
];

const PRIVACIDADE_OPTIONS = [
  { value: 'aberto', label: 'Aberto', description: 'Qualquer pessoa pode participar.' },
  { value: 'fechado', label: 'Fechado', description: 'Apenas amigos e convidados.' },
];

const SHARE_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'copy', label: 'Copiar Link', icon: Copy },
  { id: 'more', label: 'Mais', icon: MoreHorizontal },
];

const DEFAULT_MODALIDADES = ['corrida', 'futebol', 'yoga', 'basquete', 'trilha', 'natacao'];

function StepIndicator({ currentStep }) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);
  
  return (
    <div className="flex items-center justify-between gap-1 py-2">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        
        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isActive && 'bg-brand-primary text-text-inverse',
                  isComplete && 'bg-success text-success-foreground',
                  !isActive && !isComplete && 'bg-container-secondary text-text-tertiary'
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={cn(
                'mt-1 text-[10px] font-medium',
                isActive ? 'text-text-primary' : 'text-text-tertiary'
              )}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn(
                'mx-1 h-0.5 flex-1',
                isComplete ? 'bg-success' : 'bg-borderSemantic-subtle'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LocalAutocomplete({ value, onChange, onSelect, locais }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredLocais = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return locais.filter(local => 
      local.nome.toLowerCase().includes(term) ||
      local.endereco?.toLowerCase().includes(term) ||
      local.bairro?.toLowerCase().includes(term)
    ).slice(0, 5);
  }, [searchTerm, locais]);
  
  const handleSelect = (local) => {
    onSelect(local);
    setSearchTerm('');
    setIsOpen(false);
  };
  
  const selectedLocal = locais.find(l => l.id === value);
  
  return (
    <div className="relative">
      {selectedLocal ? (
        <div className="flex items-center justify-between rounded-lg border border-borderSemantic-subtle bg-container-secondary p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary">{selectedLocal.nome}</p>
            <p className="truncate text-xs text-text-secondary">
              {[selectedLocal.endereco, selectedLocal.bairro].filter(Boolean).join(', ')}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="ml-2 shrink-0"
          >
            Alterar
          </Button>
        </div>
      ) : (
        <>
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar local..."
            className="h-11"
          />
          {isOpen && filteredLocais.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-borderSemantic-subtle bg-container-secondary shadow-lg">
              {filteredLocais.map(local => (
                <button
                  key={local.id}
                  type="button"
                  className="flex w-full items-center gap-2 p-3 text-left hover:bg-container-primary"
                  onClick={() => handleSelect(local)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{local.nome}</p>
                    <p className="truncate text-xs text-text-secondary">
                      {[local.endereco, local.bairro].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ExpandableCard({ title, icon: Icon, children, defaultOpen = false, onToggle, isOpen }) {
  return (
    <div className="rounded-lg border border-borderSemantic-subtle bg-container-secondary">
      <button
        type="button"
        className="flex w-full items-center justify-between p-3"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-semibold text-text-primary">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-text-tertiary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-tertiary" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-borderSemantic-subtle p-3">
          {children}
        </div>
      )}
    </div>
  );
}

function RangeSlider({ min, max, value, onChange }) {
  const [minVal, maxVal] = value || [min, max];
  
  const handleMinChange = (newMin) => {
    const val = Math.min(newMin, maxVal - 1);
    onChange([val, maxVal]);
  };
  
  const handleMaxChange = (newMax) => {
    const val = Math.max(newMax, minVal + 1);
    onChange([minVal, val]);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">Idade mínima</span>
        <span className="text-sm font-semibold text-text-primary">{minVal} anos</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(e) => handleMinChange(Number(e.target.value))}
        className="w-full accent-brand-primary"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">Idade máxima</span>
        <span className="text-sm font-semibold text-text-primary">{maxVal} anos</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(e) => handleMaxChange(Number(e.target.value))}
        className="w-full accent-brand-primary"
      />
    </div>
  );
}

function DetailsStep({ draft, updateDraft, locais, modalidades }) {
  console.log('[CreateAtivo] DetailsStep mounted', {
    draft: draft ? 'OK' : 'MISSING',
    updateDraft: updateDraft ? 'OK' : 'MISSING',
    locais: locais?.length ?? 0,
    modalidades: modalidades?.length ?? 0,
  });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-bold text-text-primary">Local</Label>
        <LocalAutocomplete
          value={draft.localId}
          onChange={(id) => updateDraft({ localId: id })}
          onSelect={(local) => updateDraft({ localId: local.id })}
          locais={locais}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-bold text-text-primary">Quórum</Label>
          <Input
            type="number"
            min="1"
            value={draft.minimoParticipantes}
            onChange={(e) => updateDraft({ minimoParticipantes: Number(e.target.value) })}
            placeholder="5"
            className="h-11"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold text-text-primary">Modalidade</Label>
          <Select value={draft.modalidade} onValueChange={(value) => updateDraft({ modalidade: value })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {modalidades.map(mod => (
                <SelectItem key={mod} value={mod}>
                  {mod.charAt(0).toUpperCase() + mod.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-bold text-text-primary">Nome do Ativo</Label>
        <Input
          value={draft.titulo}
          onChange={(e) => updateDraft({ titulo: e.target.value })}
          placeholder="Ex: Corrida leve no Pereque"
          className="h-11"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-bold text-text-primary">Descrição</Label>
        <Textarea
          value={draft.descricao}
          onChange={(e) => updateDraft({ descricao: e.target.value.slice(0, 2000) })}
          placeholder="Conte o que vai acontecer, ritmo, combinados..."
          className="min-h-20 text-sm"
          maxLength={2000}
        />
        <p className="text-[10px] text-text-tertiary">{draft.descricao?.length || 0}/2000</p>
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-bold text-text-primary">Data e hora de início</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={draft.dataInicio}
            onChange={(e) => updateDraft({ dataInicio: e.target.value })}
            className="h-11"
          />
          <Input
            type="time"
            value={draft.horaInicio}
            onChange={(e) => updateDraft({ horaInicio: e.target.value })}
            className="h-11"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-bold text-text-primary">Data e hora de término</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={draft.dataFim}
            onChange={(e) => updateDraft({ dataFim: e.target.value })}
            className="h-11"
          />
          <Input
            type="time"
            value={draft.horaFim}
            onChange={(e) => updateDraft({ horaFim: e.target.value })}
            className="h-11"
          />
        </div>
      </div>
    </div>
  );
}

function FiltersStep({ draft, updateDraft }) {
  console.log('[CreateAtivo] FiltersStep mounted', {
    draft: draft ? 'OK' : 'MISSING',
    updateDraft: updateDraft ? 'OK' : 'MISSING',
  });

  const [openCard, setOpenCard] = useState(null);
  
  const handleToggle = (cardId) => {
    setOpenCard(prev => prev === cardId ? null : cardId);
  };
  
  return (
    <div className="space-y-2">
      <ExpandableCard 
        title="Faixa etária" 
        icon={Users} 
        isOpen={openCard === 'idade'}
        onToggle={() => handleToggle('idade')}
      >
        <RangeSlider
          min={5}
          max={80}
          value={draft.faixaEtaria || [10, 60]}
          onChange={(value) => updateDraft({ faixaEtaria: value })}
        />
      </ExpandableCard>
      
      <ExpandableCard 
        title="Gênero" 
        icon={Users}
        isOpen={openCard === 'genero'}
        onToggle={() => handleToggle('genero')}
      >
        <Select 
          value={draft.generoPermitido} 
          onValueChange={(value) => updateDraft({ generoPermitido: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {GENERO_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ExpandableCard>
      
      <ExpandableCard 
        title="Nível de jogo" 
        icon={Users}
        isOpen={openCard === 'nivel'}
        onToggle={() => handleToggle('nivel')}
      >
        <Select 
          value={draft.nivelDificuldade} 
          onValueChange={(value) => updateDraft({ nivelDificuldade: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {NIVEL_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ExpandableCard>
      
      <ExpandableCard 
        title="Combinados" 
        icon={Users}
        isOpen={openCard === 'combinados'}
        onToggle={() => handleToggle('combinados')}
      >
        <Textarea
          value={draft.recomendacoes}
          onChange={(e) => updateDraft({ recomendacoes: e.target.value.slice(0, 2000) })}
          placeholder="Ex: Levar água, usar tênis..."
          className="min-h-16 text-sm"
          maxLength={2000}
        />
        <p className="mt-1 text-[10px] text-text-tertiary">{draft.recomendacoes?.length || 0}/2000</p>
      </ExpandableCard>
      
      <div className="space-y-2 pt-2">
        <Label className="text-xs font-bold text-text-primary">Privacidade</Label>
        <div className="grid grid-cols-2 gap-2">
          {PRIVACIDADE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                'flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                draft.privacidade === opt.value
                  ? 'border-brand-primary bg-brand-primary-subtle'
                  : 'border-borderSemantic-subtle bg-container-secondary'
              )}
              onClick={() => updateDraft({ privacidade: opt.value })}
            >
              <span className="text-sm font-semibold text-text-primary">{opt.label}</span>
              <span className="text-[10px] text-text-secondary line-clamp-1">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmStep({ draft, locais }) {
  console.log('[CreateAtivo] ConfirmStep mounted', {
    draft: draft ? 'OK' : 'MISSING',
    locais: locais?.length ?? 0,
  });

  const selectedLocal = locais.find(l => l.id === draft.localId);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return dateStr.split('-').reverse().join('/');
  };
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr;
  };
  
  const summaryItems = [
    { label: 'Local', value: selectedLocal?.nome || '-' },
    { label: 'Modalidade', value: draft.modalidade || '-' },
    { label: 'Quórum', value: `${draft.minimoParticipantes} mínimo` },
    { label: 'Nome', value: draft.titulo || '-' },
    { label: 'Início', value: `${formatDate(draft.dataInicio)} às ${formatTime(draft.horaInicio)}` },
    { label: 'Término', value: `${formatDate(draft.dataFim)} às ${formatTime(draft.horaFim)}` },
  ];
  
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-lg font-bold text-text-primary">Revise seu Ativo</h2>
        <p className="text-xs text-text-secondary">Confira as informações antes de publicar</p>
      </div>
      
      <div className="rounded-lg border border-borderSemantic-subtle bg-container-secondary p-3">
        <h3 className="mb-2 text-sm font-bold text-text-primary">Resumo</h3>
        <div className="space-y-2">
          {summaryItems.map((item, idx) => (
            <div key={idx}>
              <p className="text-xs text-text-secondary">{item.label}</p>
              <p className="text-sm font-medium text-text-primary">{item.value}</p>
              {idx < summaryItems.length - 1 && <div className="mt-2 border-t border-borderSemantic-subtle" />}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="mb-2 text-sm font-bold text-text-primary">Filtros Aplicados</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {draft.faixaEtaria && (
            <div className="shrink-0 rounded-md border border-borderSemantic-subtle bg-container-secondary px-3 py-2">
              <p className="text-[10px] text-text-tertiary">Faixa etária</p>
              <p className="text-xs font-semibold text-text-primary">{draft.faixaEtaria[0]}-{draft.faixaEtaria[1]} anos</p>
            </div>
          )}
          {draft.generoPermitido && (
            <div className="shrink-0 rounded-md border border-borderSemantic-subtle bg-container-secondary px-3 py-2">
              <p className="text-[10px] text-text-tertiary">Gênero</p>
              <p className="text-xs font-semibold text-text-primary">
                {GENERO_OPTIONS.find(o => o.value === draft.generoPermitido)?.label || '-'}
              </p>
            </div>
          )}
          {draft.nivelDificuldade && (
            <div className="shrink-0 rounded-md border border-borderSemantic-subtle bg-container-secondary px-3 py-2">
              <p className="text-[10px] text-text-tertiary">Nível</p>
              <p className="text-xs font-semibold text-text-primary">
                {NIVEL_OPTIONS.find(o => o.value === draft.nivelDificuldade)?.label || '-'}
              </p>
            </div>
          )}
          {draft.recomendacoes && (
            <div className="shrink-0 rounded-md border border-borderSemantic-subtle bg-container-secondary px-3 py-2 max-w-[120px]">
              <p className="text-[10px] text-text-tertiary">Combinados</p>
              <p className="truncate text-xs font-semibold text-text-primary">{draft.recomendacoes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShareStep({ friends, selectedFriendIds, onToggleFriend, onPublish, onSaveDraft, isPublishing, isPublished }) {
  console.log("[ShareStep] render", {
    isPublished,
    isPublishing,
    friendsLength: friends?.length ?? 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFriends = useMemo(() => {
    if (!searchTerm.trim()) return friends;
    const term = searchTerm.toLowerCase();
    return friends.filter(friend => 
      friend.nome?.toLowerCase().includes(term)
    );
  }, [friends, searchTerm]);
  
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-lg font-bold text-text-primary">Seu ativo está pronto.</h2>
        <p className="text-xs text-text-secondary">Publique ou compartilhe com a galera.</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-text-primary">Convidar amigos</Label>
          <Badge variant="outline" className="text-[10px]">{selectedFriendIds.length}</Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar amigo..."
            className="h-10 pl-10 text-sm"
          />
        </div>
        
        <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-lg border border-borderSemantic-subtle bg-container-secondary p-2">
          {filteredFriends.map(friend => (
            <button
              key={friend.id}
              type="button"
              className={cn(
                'flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors',
                selectedFriendIds.includes(friend.id)
                  ? 'bg-brand-primary-subtle'
                  : 'hover:bg-container-primary'
              )}
              onClick={() => onToggleFriend(friend.id)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={friend.foto} />
                <AvatarFallback className="text-xs">{friend.nome?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{friend.nome}</p>
              </div>
              <div className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                selectedFriendIds.includes(friend.id)
                  ? 'border-brand-primary bg-brand-primary'
                  : 'border-borderSemantic-subtle'
              )}>
                {selectedFriendIds.includes(friend.id) && (
                  <Check className="h-3 w-3 text-text-inverse" />
                )}
              </div>
            </button>
          ))}
          {filteredFriends.length === 0 && (
            <p className="py-4 text-center text-xs text-text-tertiary">
              {searchTerm ? 'Nenhum amigo encontrado' : 'Nenhum amigo disponível'}
            </p>
          )}
        </div>
      </div>
      
      {console.log("[ShareStep] branch", isPublished ? "published" : "draft")}
      <div className="space-y-2">
        {isPublished ? (
          <Button
            variant="outline"
            className="w-full"
            size="default"
            disabled
          >
            <Check className="mr-2 h-4 w-4" />
            Ativo Publicado
          </Button>
        ) : (
          <Button
            className="w-full"
            size="default"
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              'Publicar Ativo'
            )}
          </Button>
        )}
        {isPublished ? (
          <Button
            variant="outline"
            className="w-full"
            size="default"
            onClick={() => onSaveDraft()}
          >
            Ver na Home
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            size="default"
            onClick={onSaveDraft}
          >
            Salvar Rascunho
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs font-bold text-text-primary">Compartilhar</Label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SHARE_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-borderSemantic-subtle bg-container-secondary px-3 py-2"
            >
              <option.icon className="h-5 w-5 text-brand-primary" />
              <span className="text-[10px] font-medium text-text-primary">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateAtivoLoading() {
  return (
    <AppScreen className="gap-3" variant="warm">
      <Skeleton className="h-6 w-44" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </AppScreen>
  );
}

export default function CreateAtivoScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const localIdParam = searchParams.get('localId') ?? '';
  const modalidadeParam = searchParams.get('modalidade') ?? '';
  const dateParam = searchParams.get('date') ?? '';
  const trailIdParam = searchParams.get('trailId') ?? '';
  
  const effectiveLocalId = localIdParam || trailIdParam;
  const effectiveModalidade = modalidadeParam || (trailIdParam ? 'trilha' : '');
  
  const [currentStep, setCurrentStep] = useState('details');
  const [inviteSelection, setInviteSelection] = useState([]);
  const [draft, setDraft] = useState(() => ({
    titulo: '',
    descricao: '',
    modalidade: effectiveModalidade,
    localId: effectiveLocalId,
    trailId: trailIdParam,
    dataInicio: dateParam || '',
    horaInicio: '09:00',
    dataFim: dateParam || '',
    horaFim: '10:00',
    minimoParticipantes: 2,
    maximoParticipantes: 12,
    nivelDificuldade: '',
    privacidade: 'aberto',
    faixaEtaria: [10, 60],
    generoPermitido: '',
    recomendacoes: '',
    status: 'rascunho',
  }));
  
  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.current()),
    queryFn: () => SessionService.getSession(),
  });
  
  const locaisQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.all()),
    queryFn: () => LocalService.list(),
  });
  
  const ativosQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.all()),
    queryFn: () => AtivoService.list(),
  });
  
  const usersQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.all()),
    queryFn: () => UserService.list(),
  });
  
  const updateDraft = useCallback((patch) => {
    setDraft(prev => ({ ...prev, ...patch }));
  }, []);
  
  const user = sessionQuery.data?.user;
  const locais = locaisQuery.data ?? [];
  const ativos = ativosQuery.data ?? [];
  const users = usersQuery.data ?? [];
  
  const modalidades = useMemo(() => {
    const values = new Set(DEFAULT_MODALIDADES);
    ativos.forEach(ativo => { if (ativo.modalidade) values.add(ativo.modalidade); });
    (user?.preferenciasEsportivas ?? []).forEach(mod => values.add(mod));
    if (modalidadeParam) values.add(modalidadeParam);
    return Array.from(values).sort();
  }, [ativos, modalidadeParam, user?.preferenciasEsportivas]);
  
  const friends = useMemo(() => {
    return users.filter(u => u.id !== user?.id);
  }, [users, user?.id]);
  
  const toggleFriend = useCallback((friendId) => {
    setInviteSelection(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  }, []);
  
  const buildPublishDraft = useCallback(() => {
    return {
      ...draft,
      organizadorId: user?.id,
      dataHoraInicio: `${draft.dataInicio}T${draft.horaInicio}`,
      dataHoraFim: `${draft.dataFim}T${draft.horaFim}`,
      status: 'publicado',
    };
  }, [draft, user?.id]);
  
  const reviewDraft = useMemo(() => ({
    ...draft,
    organizadorId: user?.id,
    dataHoraInicio: `${draft.dataInicio}T${draft.horaInicio}`,
    dataHoraFim: `${draft.dataFim}T${draft.horaFim}`,
  }), [draft, user?.id]);
  
  const validation = useMemo(() => AtivoRulesService.validateForPublish(reviewDraft), [reviewDraft]);
  
  const [isPublished, setIsPublished] = useState(false);
  
  const publishMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log("[Publish] mutation started");
        
        console.log("[Publish] building payload");
        const publishDraft = buildPublishDraft();
        console.log("[Publish] payload built");
        
        const finalValidation = AtivoRulesService.validateForPublish(publishDraft);
        
        if (!finalValidation.valid) {
          const error = new Error('Revise os campos obrigatórios antes de publicar.');
          error.validationErrors = finalValidation.errors;
          throw error;
        }
        
        console.log("[Publish] calling AtivoService.create()");
        const result = await AtivoService.create(publishDraft);
        console.log("[Publish] AtivoService.create() returned");
        
        console.log("[Publish] mutation finished");
        return result;
      } catch (error) {
        console.error("[Publish] mutation error", {
          message: error?.message,
          stack: error?.stack,
          error,
        });
        throw error;
      }
    },
    onSuccess: async (createdAtivo) => {
      console.log("[Publish] onSuccess()");
      console.log("[Publish] setIsPublished(true)");
      setIsPublished(true);
      console.log("[Publish] state update requested");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.all()) }),
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.byLocal(createdAtivo.localId)) }),
      ]);
    },
    onError: (error) => {
      console.error("[Publish] onError", {
        message: error?.message,
        stack: error?.stack,
        error,
      });
    },
  });

  useEffect(() => {
    console.log("[Publish] isPublished changed", isPublished);
  }, [isPublished]);
  
  const handleSaveDraft = () => {
    localStorage.setItem('ativo_draft', JSON.stringify(draft));
    navigate('/');
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handlePublish = () => {
    console.log("[Publish] handlePublish()");
    publishMutation.mutate();
  };
  
  const goToNextStep = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };
  
  const goToPrevStep = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };
  
  if (sessionQuery.isLoading || locaisQuery.isLoading || ativosQuery.isLoading) {
    return <CreateAtivoLoading />;
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 'details':
        return <DetailsStep draft={draft} updateDraft={updateDraft} locais={locais} modalidades={modalidades} />;
      case 'filters':
        return <FiltersStep draft={draft} updateDraft={updateDraft} />;
      case 'confirm':
        return <ConfirmStep draft={reviewDraft} locais={locais} />;
      case 'share':
        return (
          <ShareStep
            friends={friends}
            selectedFriendIds={inviteSelection}
            onToggleFriend={toggleFriend}
            onPublish={handlePublish}
            onSaveDraft={handleGoHome}
            isPublishing={publishMutation.isPending}
            isPublished={isPublished}
          />
        );
      default:
        return null;
    }
  };
  
  const isLastStep = currentStep === 'share';
  const isFirstStep = currentStep === 'details';

  console.log('[CreateAtivo] render', {
    currentStep,
    draft: draft ? 'OK' : 'MISSING',
    inviteSelection: inviteSelection?.length ?? 0,
    isPublished,
    isFirstStep,
    isLastStep,
  });
  
  const handleBack = () => {
    console.log('[CreateAtivo] Back clicked', {
      currentStep,
      isFirstStep,
    });

    if (isFirstStep) {
      navigate('/');
    } else {
      goToPrevStep();
    }
  };

  const handleContinue = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    const nextStep = STEPS[currentIndex + 1]?.id;

    console.log('[CreateAtivo] Continue clicked', {
      currentStepBefore: currentStep,
      nextStep,
    });

    goToNextStep();

    console.log('[CreateAtivo] Step updated');
  };

  return (
    <AppScreen className="flex flex-col" variant="warm" fullscreen>
      <div className="flex flex-col gap-2">
        <FlowHeader
          title="Criar Ativo"
          subtitle="Contribuindo para uma comunidade ativa"
          icon={Plus}
          onBack={handleBack}
          onAction={() => {}}
          actionIcon={Plus}
        />
        
        <StepIndicator currentStep={currentStep} />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4">
        {renderStep()}
      </div>
      
      {!isLastStep && (
        <div className="grid grid-cols-2 gap-2 px-4 py-3">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleBack}
              className="h-10 text-sm"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          )}
          <Button
            type="button"
            size="default"
            onClick={handleContinue}
            className={cn('h-10 text-sm', isFirstStep && 'col-span-2')}
          >
            Continuar
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </AppScreen>
  );
}