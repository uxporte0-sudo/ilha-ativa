import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Eye, Loader2, Lock, MapPin, Plus, UsersRound } from 'lucide-react';
import AppScreen from '@/components/layout/AppScreen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { AtivoService } from '@/domain/ativo/service';
import { AtivoRulesService } from '@/domain/ativo/rulesService';
import { LocalService } from '@/domain/local/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { SessionService } from '@/domain/user/sessionService';
import { cn } from '@/lib/utils';

const DEFAULT_MODALIDADES = ['corrida', 'futebol', 'yoga', 'basquete', 'trilha', 'natacao'];

const steps = [
  { title: 'Basico', description: 'Titulo e descricao' },
  { title: 'Modalidade', description: 'Tipo de pratica' },
  { title: 'Local', description: 'Onde acontece' },
  { title: 'Horario', description: 'Quando acontece' },
  { title: 'Participacao', description: 'Quorum e privacidade' },
  { title: 'Revisao', description: 'Conferencia final' },
];

function formatLabel(value) {
  if (!value) return 'Nao informado';
  return String(value).replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase());
}

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromDatetimeLocal(value) {
  if (!value) return '';
  return new Date(value).toISOString();
}

function buildDateContext(dateParam) {
  if (!dateParam) return { dataHoraInicio: '', dataHoraFim: '' };
  const parsed = new Date(dateParam);
  if (Number.isNaN(parsed.getTime())) return { dataHoraInicio: '', dataHoraFim: '' };
  const startsAt = parsed.toISOString();
  const endsAt = new Date(parsed.getTime() + 60 * 60 * 1000).toISOString();
  return { dataHoraInicio: startsAt, dataHoraFim: endsAt };
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-text-primary">{label}</Label>
      {children}
    </div>
  );
}

function StepProgress({ currentStep }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <span
              key={step.title}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black',
                active && 'border-brand-primary bg-brand-primary text-text-inverse',
                complete && 'border-success bg-success text-success-foreground',
                !active && !complete && 'border-borderSemantic-subtle bg-container-secondary text-text-tertiary'
              )}
            >
              {complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
            </span>
          );
        })}
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-text-tertiary">Etapa {currentStep + 1} de {steps.length}</p>
        <h2 className="text-xl font-bold text-text-primary">{steps[currentStep].title}</h2>
        <p className="text-sm leading-5 text-text-secondary">{steps[currentStep].description}</p>
      </div>
    </div>
  );
}

function CreateAtivoLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-44" />
      <Skeleton className="h-24 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

function CreateAtivoError({ onRetry }) {
  return (
    <AppScreen variant="warm">
      <div className="rounded-[var(--radius-card)] border border-error/20 bg-container-secondary p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-error">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-lg font-bold text-text-primary">Nao foi possivel preparar o fluxo</h1>
        </div>
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Os dados oficiais de User, Locais ou modalidades nao responderam agora.
        </p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </AppScreen>
  );
}

function AtivoFormBasicInfo({ draft, updateDraft }) {
  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <Field label="Titulo">
        <Input
          value={draft.titulo}
          onChange={(event) => updateDraft({ titulo: event.target.value })}
          placeholder="Ex.: Corrida leve no Pereque"
        />
      </Field>
      <Field label="Descricao">
        <Textarea
          value={draft.descricao}
          onChange={(event) => updateDraft({ descricao: event.target.value })}
          placeholder="Conte o que vai acontecer, ritmo, combinados e ponto de encontro."
          className="min-h-32 rounded-[var(--radius-control)] border-borderSemantic-subtle bg-container-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-disabled focus-visible:ring-2 focus-visible:ring-interaction-focus/30"
        />
      </Field>
    </section>
  );
}

function AtivoFormModality({ draft, updateDraft, modalidades }) {
  return (
    <section className="grid gap-3">
      {modalidades.map((modalidade) => {
        const active = draft.modalidade === modalidade;

        return (
          <button
            key={modalidade}
            type="button"
            onClick={() => updateDraft({ modalidade })}
            className={cn(
              'flex min-h-16 items-center justify-between rounded-[var(--radius-card)] border bg-container-secondary p-4 text-left shadow-card outline-none transition-transform focus-visible:ring-2 focus-visible:ring-interaction-focus',
              active ? 'border-brand-primary' : 'border-borderSemantic-subtle hover:-translate-y-0.5'
            )}
          >
            <span>
              <span className="block text-base font-bold text-text-primary">{formatLabel(modalidade)}</span>
              <span className="text-xs font-medium text-text-tertiary">Modalidade oficial disponivel</span>
            </span>
            {active ? <Badge>Selecionada</Badge> : <Badge variant="outline">Escolher</Badge>}
          </button>
        );
      })}
    </section>
  );
}

function AtivoFormLocation({ draft, updateDraft, locais }) {
  return (
    <section className="grid gap-3">
      {locais.map((local) => {
        const active = draft.localId === local.id;

        return (
          <button
            key={local.id}
            type="button"
            onClick={() => updateDraft({ localId: local.id })}
            className={cn(
              'rounded-[var(--radius-card)] border bg-container-secondary p-4 text-left shadow-card outline-none transition-transform focus-visible:ring-2 focus-visible:ring-interaction-focus',
              active ? 'border-brand-primary' : 'border-borderSemantic-subtle hover:-translate-y-0.5'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-text-primary">{local.nome}</h3>
                <p className="mt-1 flex items-center gap-2 text-xs font-medium text-text-secondary">
                  <MapPin className="h-4 w-4 text-text-tertiary" />
                  {[local.bairro, local.cidade].filter(Boolean).join(', ') || 'Ilhabela'}
                </p>
              </div>
              <Badge variant={active ? 'default' : 'outline'}>{active ? 'Selecionado' : formatLabel(local.categoria)}</Badge>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function AtivoFormDateTime({ draft, updateDraft }) {
  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <Field label="Inicio">
        <Input
          type="datetime-local"
          value={toDatetimeLocal(draft.dataHoraInicio)}
          onChange={(event) => updateDraft({ dataHoraInicio: fromDatetimeLocal(event.target.value) })}
        />
      </Field>
      <Field label="Fim">
        <Input
          type="datetime-local"
          value={toDatetimeLocal(draft.dataHoraFim)}
          onChange={(event) => updateDraft({ dataHoraFim: fromDatetimeLocal(event.target.value) })}
        />
      </Field>
    </section>
  );
}

function AtivoFormParticipation({ draft, updateDraft }) {
  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Minimo">
          <Input
            type="number"
            min="1"
            value={draft.minimoParticipantes}
            onChange={(event) => updateDraft({ minimoParticipantes: Number(event.target.value) })}
          />
        </Field>
        <Field label="Maximo">
          <Input
            type="number"
            min="1"
            value={draft.maximoParticipantes}
            onChange={(event) => updateDraft({ maximoParticipantes: event.target.value === '' ? '' : Number(event.target.value) })}
          />
        </Field>
      </div>
      <Field label="Privacidade">
        <div className="grid grid-cols-2 gap-2">
          {['publico', 'privado'].map((privacidade) => (
            <Button
              key={privacidade}
              type="button"
              variant={draft.privacidade === privacidade ? 'default' : 'outline'}
              onClick={() => updateDraft({ privacidade })}
              className="justify-start"
            >
              {privacidade === 'publico' ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {formatLabel(privacidade)}
            </Button>
          ))}
        </div>
      </Field>
    </section>
  );
}

function SummaryLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-card)] bg-container-primary p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
      <div>
        <p className="text-xs font-bold uppercase text-text-tertiary">{label}</p>
        <p className="text-sm font-semibold leading-5 text-text-primary">{value || 'Nao informado'}</p>
      </div>
    </div>
  );
}

function ReviewCard({ draft, local, validation }) {
  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Badge variant={validation.valid ? 'success' : 'outline'}>{validation.valid ? 'Revisao pronta' : 'Ajustes pendentes'}</Badge>
            <h2 className="mt-3 text-2xl font-bold leading-8 text-text-primary">{draft.titulo || 'Ativo sem titulo'}</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{draft.descricao || 'Descricao nao informada.'}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <SummaryLine icon={Plus} label="Modalidade" value={formatLabel(draft.modalidade)} />
          <SummaryLine icon={MapPin} label="Local" value={local?.nome} />
          <SummaryLine icon={CalendarDays} label="Inicio" value={draft.dataHoraInicio ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(draft.dataHoraInicio)) : ''} />
          <SummaryLine icon={CalendarDays} label="Fim" value={draft.dataHoraFim ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(draft.dataHoraFim)) : ''} />
          <SummaryLine icon={UsersRound} label="Participacao" value={`${draft.minimoParticipantes || 0} minimo${draft.maximoParticipantes ? `, ${draft.maximoParticipantes} maximo` : ''}`} />
          <SummaryLine icon={draft.privacidade === 'publico' ? Eye : Lock} label="Privacidade" value={formatLabel(draft.privacidade)} />
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card">
        <h3 className="text-base font-bold text-text-primary">Validacoes oficiais</h3>
        {validation.valid ? (
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            O rascunho passa nas regras atuais de publicacao e pode ser publicado agora.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {validation.errors.map((error) => (
              <li key={error} className="rounded-[var(--radius-card)] bg-error/10 px-3 py-2 text-sm font-semibold text-error">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function PublicationFeedback({ state, errors }) {
  if (state === 'empty') return null;

  const isPublishing = state === 'publicando';
  const isPublished = state === 'publicado';
  const Icon = isPublishing ? Loader2 : isPublished ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border bg-container-secondary p-4 shadow-card',
        isPublished && 'border-success/30 bg-success/10',
        state === 'erro' && 'border-error/30 bg-error/10'
      )}
    >
      <div className={cn('flex items-center gap-2 text-text-primary', isPublished && 'text-success', state === 'erro' && 'text-error')}>
        <Icon className={cn('h-5 w-5', isPublishing && 'animate-spin')} />
        <h2 className="text-lg font-bold">
          {isPublishing ? 'Publicando Ativo' : isPublished ? 'Ativo publicado' : 'Nao foi possivel publicar'}
        </h2>
      </div>
      {state === 'erro' ? (
        <ul className="mt-3 grid gap-2">
          {errors.map((error) => (
            <li key={error} className="rounded-[var(--radius-card)] bg-container-secondary px-3 py-2 text-sm font-semibold text-error">
              {error}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          {isPublishing ? 'Validando regras oficiais e salvando nos dados oficiais.' : 'Abrindo Detalhes do Ativo.'}
        </p>
      )}
    </div>
  );
}
export default function CreateAtivoScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const localIdParam = searchParams.get('localId') ?? '';
  const modalidadeParam = searchParams.get('modalidade') ?? '';
  const dateParam = searchParams.get('date') ?? '';
  const dateContext = useMemo(() => buildDateContext(dateParam), [dateParam]);

  const [currentStep, setCurrentStep] = useState(0);
  const [publicationState, setPublicationState] = useState('empty');
  const [publicationErrors, setPublicationErrors] = useState([]);
  const [draft, setDraft] = useState(() => ({
    titulo: '',
    descricao: '',
    modalidade: modalidadeParam,
    localId: localIdParam,
    dataHoraInicio: dateContext.dataHoraInicio,
    dataHoraFim: dateContext.dataHoraFim,
    minimoParticipantes: 2,
    maximoParticipantes: 12,
    privacidade: 'publico',
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

  const updateDraft = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const user = sessionQuery.data?.user;
  const locais = locaisQuery.data ?? [];
  const ativos = ativosQuery.data ?? [];
  const locaisById = useMemo(() => new Map(locais.map((local) => [local.id, local])), [locais]);
  const selectedLocal = locaisById.get(draft.localId);

  const modalidades = useMemo(() => {
    const values = new Set(DEFAULT_MODALIDADES);
    ativos.forEach((ativo) => { if (ativo.modalidade) values.add(ativo.modalidade); });
    (user?.preferenciasEsportivas ?? []).forEach((modalidade) => values.add(modalidade));
    if (modalidadeParam) values.add(modalidadeParam);
    return Array.from(values).sort();
  }, [ativos, modalidadeParam, user?.preferenciasEsportivas]);

  const reviewDraft = useMemo(() => ({
    ...draft,
    localId: selectedLocal?.id ?? '',
    organizadorId: user?.id,
    maximoParticipantes: draft.maximoParticipantes === '' ? undefined : draft.maximoParticipantes,
  }), [draft, selectedLocal?.id, user?.id]);
  const validation = useMemo(() => AtivoRulesService.validateForPublish(reviewDraft), [reviewDraft]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const publishDraft = { ...reviewDraft, status: 'publicado' };
      const finalValidation = AtivoRulesService.validateForPublish(publishDraft);

      if (!finalValidation.valid) {
        const error = new Error('Revise os campos obrigatorios antes de publicar.');
        error.validationErrors = finalValidation.errors;
        throw error;
      }

      return AtivoService.create(publishDraft);
    },
    onMutate: () => {
      setPublicationState('publicando');
      setPublicationErrors([]);
    },
    onSuccess: async (createdAtivo) => {
      setPublicationState('publicado');
      setPublicationErrors([]);

      const invalidations = [
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.all()) }),
        queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.byLocal(createdAtivo.localId)) }),
      ];
      const dateKey = createdAtivo.dataHoraInicio?.slice(0, 10);
      if (dateKey) {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativos.byDate(dateKey)) })
        );
      }

      await Promise.all(invalidations);
      toast({
        title: 'Ativo publicado',
        description: 'Criacao salva nos dados oficiais.',
      });
      navigate(`/ativos/${createdAtivo.id}`);
    },
    onError: (error) => {
      const errors = error.validationErrors ?? [error.message ?? 'Falha ao publicar Ativo.'];
      setPublicationState('erro');
      setPublicationErrors(errors);
      toast({
        title: 'Publicacao nao concluida',
        description: errors[0],
        variant: 'destructive',
      });
    },
  });

  if (sessionQuery.isLoading || locaisQuery.isLoading || ativosQuery.isLoading) return <CreateAtivoLoading />;

  if (sessionQuery.isError || locaisQuery.isError || ativosQuery.isError) {
    return (
      <CreateAtivoError
        onRetry={() => {
          sessionQuery.refetch();
          locaisQuery.refetch();
          ativosQuery.refetch();
        }}
      />
    );
  }

  const stepContent = [
    <AtivoFormBasicInfo key="basic" draft={draft} updateDraft={updateDraft} />,
    <AtivoFormModality key="modality" draft={draft} updateDraft={updateDraft} modalidades={modalidades} />,
    <AtivoFormLocation key="location" draft={draft} updateDraft={updateDraft} locais={locais} />,
    <AtivoFormDateTime key="datetime" draft={draft} updateDraft={updateDraft} />,
    <AtivoFormParticipation key="participation" draft={draft} updateDraft={updateDraft} />,
    <ReviewCard key="review" draft={reviewDraft} local={selectedLocal} validation={validation} />,
  ];

  return (
    <AppScreen className="gap-5" variant="warm">
      <header className="space-y-2">
        <Badge variant="accent">Criar Ativo</Badge>
        <h1 className="text-3xl font-bold leading-10 text-text-primary">Novo Ativo</h1>
        <p className="text-sm leading-5 text-text-secondary">
          Prepare o rascunho completo para revisar antes da publicacao definitiva.
        </p>
      </header>

      {localIdParam || modalidadeParam || dateParam ? (
        <div className="flex flex-wrap gap-2 rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-3 shadow-card">
          {localIdParam ? <Badge variant="outline">Local contextual</Badge> : null}
          {modalidadeParam ? <Badge variant="outline">Modalidade sugerida</Badge> : null}
          {dateParam ? <Badge variant="outline">Data sugerida</Badge> : null}
        </div>
      ) : null}

      <StepProgress currentStep={currentStep} />
      {stepContent[currentStep]}

      {currentStep === steps.length - 1 ? (
        <PublicationFeedback state={publicationState} errors={publicationErrors} />
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={currentStep === 0 || publishMutation.isPending}
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}>
            Avancar
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" disabled={!validation.valid || publishMutation.isPending} onClick={() => publishMutation.mutate()}>
            {publishMutation.isPending ? 'Publicando' : 'Publicar'}
            {publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <Button asChild variant="link" className="w-fit text-sm font-bold">
        <Link to="/">Sair do fluxo</Link>
      </Button>
    </AppScreen>
  );
}



