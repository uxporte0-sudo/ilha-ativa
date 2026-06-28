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
 * @param {Function} props.onSelectLocal - Callback (longitude, latitude, props) ao clicar pin
 */
export default function LocalMarkers({ featureCollection, map, onSelectLocal }) {
  if (!map || !featureCollection?.features?.length) {
    return null;
  }

  return (
    <>
      {featureCollection.features.map((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        return (
          <LocalPin
            key={feature.properties.id || longitude + '-' + latitude}
            map={map}
            latitude={latitude}
            longitude={longitude}
            onClick={onSelectLocal ? (lng, lat) => onSelectLocal(lng, lat, feature.properties) : undefined}
          />
        );
      })}
    </>
  );
}
