import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, Lock, Plus, Unlock, Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViewerBadgeGroup, ViewerCard, ViewerHorizontalScroller, ViewerSection } from '@/components/viewer';
function formatCategoria(v){if(!v)return'Local';return v.charAt(0).toUpperCase()+v.slice(1)}

function LocalFloatingHeader({local, onClose}){
  const isPublic=local.status==='publico'||local.status==='ativo';
  const AcessoIcon=isPublic?Unlock:Lock;
  return(
    <div className="flex items-start gap-3 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary"><Waves className="h-6 w-6"/></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><Badge variant="secondary" className="text-[10px]">{formatCategoria(local.categoria)}</Badge><AcessoIcon className="h-3.5 w-3.5 text-text-tertiary"/></div>
        <h1 className="mt-1 truncate text-lg font-bold leading-6 text-text-primary">{local.nome}</h1>
        <p className="mt-0.5 truncate text-xs text-text-secondary">{[local.endereco,local.bairro,local.cidade].filter(Boolean).join(', ')}</p>
      </div>
      <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-base text-text-secondary hover:bg-container-tertiary" aria-label="Fechar"><span className="text-lg leading-none">&times;</span></button>
    </div>
  );
}
function LocalOccupancyTimeline(){const bars=[1,2,2,3,4,5,7,8,7,5,4,3,2,1];const hours=['06h','12h','18h','23h'];const maxBar=Math.max(...bars);return(<div className="px-4 pb-3"><ViewerCard className="p-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-text-secondary">Hoje</span><Badge variant="secondary" className="h-5 text-[10px]">Agora</Badge></div><div className="flex h-10 items-end gap-0.5">{bars.map((height,i)=>(<div key={i} className="flex-1 rounded-t-sm bg-brand-primary" style={{height:(height/maxBar*100)+'%',opacity:0.4+(height/maxBar)*0.6}}/>))}</div><div className="mt-1 flex justify-between text-[10px] text-text-tertiary">{hours.map((h)=>(<span key={h}>{h}</span>))}</div></ViewerCard></div>);}

function LocalInfrastructureAlerts({local}){
  return(
    <div className="px-4 pb-3">
      <ViewerCard className="p-3 border-success/30 bg-success/5">
        <div className="mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success"/><span className="text-xs font-bold text-success">Nenhum alerta</span></div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs"><Link to={'/zeladoria/nova?localId='+local.id}>Zeladoria</Link></Button>
          <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs"><Link to={'/locais/'+local.id}>Ver mais</Link></Button>
        </div>
      </ViewerCard>
    </div>
  );
}

function LocalModalities(){
  return(
    <div className="px-4 pb-3">
      <ViewerSection className="p-3">
        <p className="mb-2 text-xs font-bold text-text-secondary">Modalidades</p>
        <ViewerHorizontalScroller className="-mx-3 px-3">
          <ViewerBadgeGroup>
            <Badge variant="secondary" className="h-7 text-xs">Futebol</Badge>
            <Badge variant="secondary" className="h-7 text-xs">Volei</Badge>
            <Badge variant="secondary" className="h-7 text-xs">Basquete</Badge>
            <Badge variant="secondary" className="h-7 text-xs">Corrida</Badge>
            <Badge variant="secondary" className="h-7 text-xs">Natacao</Badge>
          </ViewerBadgeGroup>
        </ViewerHorizontalScroller>
      </ViewerSection>
    </div>
  );
}

function LocalKeyInfo({local}){
  return(
    <div className="px-4 pb-3">
      <ViewerSection className="p-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Tipo</span><span className="text-xs font-medium text-text-primary">{local.tipo??'Nao informado'}</span></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Cobertura</span><span className="text-xs font-medium text-text-primary">{local.cobertura??'Nao informado'}</span></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Piso</span><span className="text-xs font-medium text-text-primary">{local.piso??'Nao informado'}</span></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Acessibilidade</span><span className="text-xs font-medium text-text-primary">{local.acessibilidade?.length>0?'Disponivel':'Nao informado'}</span></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Banheiros</span><span className="text-xs font-medium text-text-primary">{local.banheiros??'Nao informado'}</span></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-text-tertiary">Estacionamento</span><span className="text-xs font-medium text-text-primary">{local.estacionamento??'Nao informado'}</span></div>
        </div>
      </ViewerSection>
    </div>
  );
}

function LocalPrimaryActions({local}){
  return(<div className="px-4 pb-2"><Button asChild className="w-full" variant="default" size="lg"><Link to={'/ativos/novo?localId='+local.id}><Plus className="h-4 w-4"/>Criar Ativo</Link></Button></div>);
}

function LocalFavoriteAction(){
  return(<div className="px-4 pb-3"><button type="button" className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-borderSemantic-subtle bg-surface-base px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-container-tertiary"><Heart className="h-4 w-4"/>Favoritar</button></div>);
}

export default function LocalFloatingWindow({local, onClose}){
  useEffect(()=>{function handleEscape(event){if(event.key==='Escape')onClose();}document.addEventListener('keydown',handleEscape);return()=>document.removeEventListener('keydown',handleEscape);},[onClose]);
  if(!local)return null;
  return(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-container-secondary shadow-xl sm:rounded-2xl">
        <LocalFloatingHeader local={local} onClose={onClose}/>
        <div className="flex-1 overflow-y-auto">
          <LocalOccupancyTimeline/>
          <LocalInfrastructureAlerts local={local}/>
          <LocalModalities/>
          <LocalKeyInfo local={local}/>
        </div>
        <div className="border-t border-borderSemantic-subtle bg-container-secondary p-4">
          <LocalPrimaryActions local={local}/>
          <LocalFavoriteAction/>
        </div>
      </div>
    </div>
  );
}
