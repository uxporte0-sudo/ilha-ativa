import { MapPin, CalendarDays, Shield, Settings } from 'lucide-react';

export const MAIN_MENU_ITEMS = [
  {
    id: 'zeladoria',
    label: 'Zeladoria',
    icon: Shield,
    route: '/zeladoria'
  },
  {
    id: 'mapa',
    label: 'Mapa',
    icon: MapPin,
    route: '/mapa'
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: CalendarDays,
    route: '/agenda'
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    route: '/conta'
  }
];
