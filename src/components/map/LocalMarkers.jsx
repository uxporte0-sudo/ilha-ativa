import LocalPin from './LocalPin';

/**
 * LocalMarkers
 *
 * Componente que renderiza marcadores do MapLibre para cada Feature
 * da featureCollection fornecida pela LocalLayer.
 *
 * Não implementa interação (clique, hover, popups).
 * Responsabilidade: apenas renderizar e limpar marcadores.
 *
 * @param {Object} props
 * @param {Object} props.featureCollection - FeatureCollection GeoJSON da LocalLayer
 * @param {Object} props.map - Referência ao mapa MapLibre
 */
export default function LocalMarkers({ featureCollection, map }) {
  if (!map || !featureCollection?.features?.length) {
    return null;
  }

  return (
    <>
      {featureCollection.features.map((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        return (
          <LocalPin
            key={feature.properties.id || `${longitude}-${latitude}`}
            map={map}
            latitude={latitude}
            longitude={longitude}
          />
        );
      })}
    </>
  );
}

