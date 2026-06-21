// LEGACY - DO NOT USE in official MVP flows.
// Replaced by MapScreen and official Local/Ativo map projection.
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AnimatePresence } from 'framer-motion';
import CourtSidePanel from './CourtSidePanel';
import EventLobbyPanel from './EventLobbyPanel';

// Fix default leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const typeIcons = {
  futebol: '⚽',
  basquete: '🏀',
  volei: '🏐',
  tenis: '🎾',
  poliesportiva: '🏟️',
};

const statusColors = {
  disponivel: '#22c55e',
  em_uso: '#3b82f6',
  em_manutencao: '#f97316',
  interditada: '#ef4444',
};

// Coordenadas reais baseadas nos endereços oficiais da Prefeitura de Ilhabela
const courtCoordinates = {
  // Quadras poliesportivas oficiais
  'Quadra do Bonete':             [-23.9260, -45.3870],
  'Quadra do Borrifos/São Pedro': [-23.8380, -45.4050],
  'Quadra do Taubaté':            [-23.8020, -45.3990],
  'Quadra da Praia Grande':       [-23.8580, -45.4150],
  'Quadra do Engenho Novo':       [-23.7750, -45.3880],
  'Quadra Santa Tereza':          [-23.7830, -45.3750],
  'Quadra da Armação':            [-23.8150, -45.4000],
  'Quadra da Serraria':           [-23.8700, -45.4180],
  // Ginásios
  'Ginásio Oscar Schmidt':        [-23.7880, -45.3600],
  'Ginásio Gilson Gomes Pinna':   [-23.7720, -45.3590],
  // Aliases comuns usados no app
  'Quadra Poliesportiva do Centro': [-23.7790, -45.3620],
  'Quadra de Futebol do Perequê':   [-23.7830, -45.3720],
  'Quadra de Vôlei da Praia do Curral': [-23.8050, -45.3830],
  'Quadra de Basquete do Itaquanduba': [-23.7720, -45.3590],
  'Quadra de Tênis do Saco da Capela': [-23.7680, -45.3540],
};

// Trilhas ecológicas reais de Ilhabela
const trails = [
  { id: 't1', name: 'Trilha do Pico do Baepi', emoji: '🥾', color: '#7c3aed', coords: [-23.7850, -45.3480], description: 'Trilha até o pico mais alto da ilha — vista 360°. Dificuldade alta. ~6km.' },
  { id: 't2', name: 'Trilha da Água Branca', emoji: '💧', color: '#7c3aed', coords: [-23.7920, -45.3430], description: 'Cachoeiras no interior do Parque Estadual. Fácil. ~4km.' },
  { id: 't3', name: 'Trilha do Bonete', emoji: '🏖️', color: '#7c3aed', coords: [-23.9100, -45.3800], description: 'Acesso à praia selvagem do Bonete. Difícil. ~11km.' },
  { id: 't4', name: 'Trilha das Piscinas Naturais', emoji: '🏊', color: '#7c3aed', coords: [-23.8380, -45.4060], description: 'Piscinas naturais no sul da ilha, próx. ao Borrifos. Fácil. ~2km.' },
  { id: 't5', name: 'Trilha da Praia das Enchovas', emoji: '🌿', color: '#7c3aed', coords: [-23.8450, -45.3500], description: 'Trilha pelo lado leste da ilha. Moderada. ~5km.' },
  { id: 't6', name: 'Trilha das Praias Mansa e Vermelha', emoji: '🌊', color: '#7c3aed', coords: [-23.8650, -45.3480], description: 'Acesso a praias isoladas próx. de Castelhanos. Moderada. ~6km.' },
  { id: 't7', name: 'Estrada Parque dos Castelhanos', emoji: '🛤️', color: '#7c3aed', coords: [-23.8400, -45.3600], description: '17km de trilha que cruza a ilha até a Praia de Castelhanos.' },
  { id: 't8', name: 'Trilha do Poço (Jabaquara)', emoji: '🌴', color: '#7c3aed', coords: [-23.7450, -45.3530], description: 'Trilha no norte da ilha até a Praia do Poço. Fácil. ~3km.' },
];

// Aulas de yoga nas praias
const yogaSpots = [
  { id: 'y1', name: 'Yoga — Praia do Perequê', emoji: '🧘', color: '#db2777', coords: [-23.7840, -45.3720], description: 'Aulas às terças e quintas, 7h e 17h30. Orla do Perequê.' },
  { id: 'y2', name: 'Yoga — Praia Grande', emoji: '🧘', color: '#db2777', coords: [-23.8570, -45.4180], description: 'Aulas às segundas, quartas e sextas, 7h. Próx. ao quiosque central.' },
  { id: 'y3', name: 'Yoga — Praia do Curral', emoji: '🧘', color: '#db2777', coords: [-23.8060, -45.3850], description: 'Aulas aos sábados, 8h. Ambiente tranquilo e sombreado.' },
  { id: 'y4', name: 'Yoga — Praia de Castelhanos', emoji: '🧘', color: '#db2777', coords: [-23.8730, -45.3440], description: 'Aulas aos domingos, 7h30. Uma das praias mais bonitas da ilha.' },
  { id: 'y5', name: 'Yoga — Praia da Armação', emoji: '🧘', color: '#db2777', coords: [-23.8180, -45.4020], description: 'Aulas às terças e sábados, 7h. Vista para o mar aberto.' },
];

function createCourtIcon(court) {
  const color = statusColors[court.status] || '#22c55e';
  const emoji = typeIcons[court.type] || '🏟️';
  const svg = `
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow-c">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000033"/>
      </filter>
      <ellipse cx="22" cy="52" rx="8" ry="3" fill="#00000022"/>
      <path d="M22 2 C10 2 2 10 2 20 C2 34 22 52 22 52 C22 52 42 34 42 20 C42 10 34 2 22 2Z" 
            fill="${color}" stroke="white" stroke-width="2.5" filter="url(#shadow-c)"/>
      <circle cx="22" cy="20" r="12" fill="white" opacity="0.95"/>
      <text x="22" y="25" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>
  `;
  return L.divIcon({ html: svg, className: '', iconSize: [44, 56], iconAnchor: [22, 52], popupAnchor: [0, -52] });
}

function createPoiIcon(emoji, color, size = 38) {
  const half = size / 2;
  const svg = `
    <svg width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow-p">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000033"/>
      </filter>
      <circle cx="${half}" cy="${half}" r="${half - 2}" fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow-p)" opacity="0.92"/>
      <text x="${half}" y="${half + 5}" text-anchor="middle" font-size="${Math.round(size * 0.4)}">${emoji}</text>
    </svg>
  `;
  return L.divIcon({ html: svg, className: '', iconSize: [size, size + 8], iconAnchor: [half, half], popupAnchor: [0, -(half + 4)] });
}

function FlyToSelected({ court }) {
  const map = useMap();
  if (court) {
    const coords = courtCoordinates[court.name] || [-23.785, -45.360];
    map.flyTo(coords, 15, { duration: 0.8 });
  }
  return null;
}

const STORAGE_KEY = 'ilhabela_pin_positions';

function loadSavedPositions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export default function CourtsMap({ courts, isLoading }) {
  const [selected, setSelected] = useState(null);
  const [lobbyEvent, setLobbyEvent] = useState(null);
  const [showTrails, setShowTrails] = useState(true);
  const [showYoga, setShowYoga] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState(loadSavedPositions);

  const ilhabelaCenter = [-23.820, -45.375];

  function getCoords(key, defaultCoords) {
    return positions[key] ? [positions[key][0], positions[key][1]] : defaultCoords;
  }

  function handleDragEnd(key, e) {
    const { lat, lng } = e.target.getLatLng();
    setPositions(prev => {
      const next = { ...prev, [key]: [lat, lng] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetPositions() {
    localStorage.removeItem(STORAGE_KEY);
    setPositions({});
  }

  function saveCurrentPositions() {
    const current = {};
    courts.forEach(court => {
      const defaultCoords = courtCoordinates[court.name];
      if (defaultCoords) current[`court_${court.id}`] = positions[`court_${court.id}`] || defaultCoords;
    });
    trails.forEach(trail => {
      current[`trail_${trail.id}`] = positions[`trail_${trail.id}`] || trail.coords;
    });
    yogaSpots.forEach(spot => {
      current[`yoga_${spot.id}`] = positions[`yoga_${spot.id}`] || spot.coords;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    setPositions(current);
    setEditMode(false);
  }

  if (isLoading) {
    return (
      <div className="h-[600px] bg-muted animate-pulse rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl border" style={{ height: '620px' }}>
      <MapContainer
        center={ilhabelaCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Quadras */}
        {courts.map((court) => {
          const defaultCoords = courtCoordinates[court.name];
          if (!defaultCoords) return null;
          const coords = getCoords(`court_${court.id}`, defaultCoords);
          return (
            <Marker
              key={court.id}
              position={coords}
              icon={createCourtIcon(court)}
              draggable={editMode}
              eventHandlers={{
                click: () => !editMode && setSelected(selected?.id === court.id ? null : court),
                dragend: (e) => handleDragEnd(`court_${court.id}`, e),
              }}
            />
          );
        })}

        {/* Trilhas */}
        {showTrails && trails.map((trail) => (
          <Marker
            key={trail.id}
            position={getCoords(`trail_${trail.id}`, trail.coords)}
            icon={createPoiIcon(trail.emoji, trail.color)}
            draggable={editMode}
            eventHandlers={{
              dragend: (e) => handleDragEnd(`trail_${trail.id}`, e),
              click: () => !editMode && setLobbyEvent(lobbyEvent?.id === trail.id ? null : trail),
            }}
          />
        ))}

        {/* Yoga */}
        {showYoga && yogaSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={getCoords(`yoga_${spot.id}`, spot.coords)}
            icon={createPoiIcon(spot.emoji, spot.color, 36)}
            draggable={editMode}
            eventHandlers={{
              dragend: (e) => handleDragEnd(`yoga_${spot.id}`, e),
              click: () => !editMode && setLobbyEvent(lobbyEvent?.id === spot.id ? null : spot),
            }}
          />
        ))}

        {selected && <FlyToSelected court={selected} />}
      </MapContainer>

      {/* Edit mode banner */}
      {editMode && (
        <div className="absolute top-0 left-0 right-0 z-[1001] bg-amber-500/95 text-white text-xs font-medium py-2 text-center flex items-center justify-center gap-3">
          ✋ Arraste os pins para reposicioná-los
          <button onClick={saveCurrentPositions} className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded font-semibold transition-all">💾 Salvar</button>
          <button onClick={resetPositions} className="underline opacity-80 hover:opacity-100">Resetar</button>
        </div>
      )}

      {/* Layer toggles + edit */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setEditMode(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border shadow transition-all ${editMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-card/90 text-muted-foreground border-border backdrop-blur-sm'}`}
        >
          ✏️ {editMode ? 'Concluir' : 'Mover pins'}
        </button>
        <button
          onClick={() => setShowTrails(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border shadow transition-all ${showTrails ? 'bg-violet-600 text-white border-violet-700' : 'bg-card/90 text-muted-foreground border-border backdrop-blur-sm'}`}
        >
          🥾 Trilhas
        </button>
        <button
          onClick={() => setShowYoga(v => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border shadow transition-all ${showYoga ? 'bg-pink-600 text-white border-pink-700' : 'bg-card/90 text-muted-foreground border-border backdrop-blur-sm'}`}
        >
          🧘 Yoga
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-xl p-3 border shadow-lg text-xs space-y-1.5">
        <p className="font-semibold text-foreground mb-2">Legenda</p>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Disponível</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Em Uso</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Em Manutenção</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Interditada</div>
        <div className="border-t border-border my-1.5"></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-600 inline-block"></span> Trilha</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-600 inline-block"></span> Yoga na Praia</div>
      </div>

      {/* Count badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2 border shadow text-xs font-medium">
        {courts.length} quadra{courts.length !== 1 ? 's' : ''} encontrada{courts.length !== 1 ? 's' : ''}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selected && !editMode && (
          <CourtSidePanel court={selected} onClose={() => setSelected(null)} />
        )}
        {lobbyEvent && !editMode && (
          <EventLobbyPanel event={lobbyEvent} onClose={() => setLobbyEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
