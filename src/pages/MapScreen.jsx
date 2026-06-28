import AppScreen from '@/components/layout/AppScreen';
import MapCanvas from '@/components/map/MapCanvas';

/**
 * MapScreen
 *
 * Tela de mapa que ocupa toda a área disponível.
 * Utiliza AppScreen no modo fullscreen para remover paddings.
 */
export default function MapScreen() {
  return (
    <AppScreen variant="warm" fullscreen>
      <MapCanvas />
    </AppScreen>
  );
}
