import LocalPin from './LocalPin';

/**
 * LocalMarkers
 *
 * Componente que renderiza marcadores do MapLibre para cada Feature
 * da featureCollection fornecida pela LocalLayer.
 *
 * Permite interceptar cliques nos pins para abrir visualizacao do Local.
 *
 * @param {Object} props
 * @param {Object} props.featureCollection - FeatureCollection GeoJSON da LocalLayer
 * @param {Object} props.map - Referencia ao mapa MapLibre
 * @param {Function} props.onOpenLocal - Callback (entity) ao clicar pin
 */
export default function LocalMarkers({ featureCollection, map, onOpenLocal }) {
  if (!map || !featureCollection?.features?.length) {
    return null;
  }

  return (
    <>
      {featureCollection.features
        .filter((feature) => feature.properties?.tipoCategoria !== 'trilha')
        .map((feature) => {
          const [longitude, latitude] = feature.geometry.coordinates;
          return (
            <LocalPin
              key={feature.properties.id || longitude + '-' + latitude}
              map={map}
              latitude={latitude}
              longitude={longitude}
              entity={feature.properties}
              onOpen={onOpenLocal}
            />
          );
        })}
    </>
  );
}
