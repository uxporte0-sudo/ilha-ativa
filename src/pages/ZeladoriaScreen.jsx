import React, { useEffect, useState } from 'react';
import { ZeladoriaService } from '@/domain/zeladoria';

const ZeladoriaScreen = () => {
  const [zeladorias, setZeladorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ZeladoriaService.list()
      .then(data => {
        setZeladorias(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Zeladoria Screen</h1>
      <ul>
        {zeladorias.map(z => (
          <li key={z.id}>
            <strong>{z.titulo}</strong> - {z.status} - {z.localId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZeladoriaScreen;
