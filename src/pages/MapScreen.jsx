import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppScreen from '@/components/layout/AppScreen';
import MapCanvas from '@/components/map/MapCanvas';
import LocalFloatingWindow from '@/components/local/LocalFloatingWindow';
import { LocalService } from '@/domain/local/service';

export default function MapScreen() {
  const [selectedLocalId, setSelectedLocalId] = useState(null);

  const selectedLocalQuery = useQuery({
    queryKey: ['local', selectedLocalId],
    queryFn: () => LocalService.getById(selectedLocalId),
    enabled: !!selectedLocalId,
  });

  const handleSelectLocal = useCallback((longitude, latitude, props) => {
    setSelectedLocalId(props.id);
  }, []);

  const handleCloseWindow = useCallback(() => {
    setSelectedLocalId(null);
  }, []);

  return (
    <AppScreen variant="warm" fullscreen>
      <MapCanvas onSelectLocal={handleSelectLocal} />
      {selectedLocalId && selectedLocalQuery.data && (
        <LocalFloatingWindow
          local={selectedLocalQuery.data}
          ativos={[]}
          onClose={handleCloseWindow}
        />
      )}
    </AppScreen>
  );
}
