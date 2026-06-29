import React, { useEffect, useState } from 'react';
import AppScreen from '@/components/layout/AppScreen';
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

  if (loading) return <AppScreen variant="warm"><div className="flex items-center justify-center h-full max-h-full"><p className="text-text-secondary">Carregando...</p></div></AppScreen>;
  if (error) return <AppScreen variant="warm"><div className="flex items-center justify-center h-full max-h-full"><p className="text-error">Erro: {error}</p></div></AppScreen>;

  return (
    <AppScreen variant="warm">
      <h1 className="text-xl font-bold text-text-primary">Zeladoria</h1>
      <ul className="space-y-2">
        {zeladorias.map(z => (
          <li key={z.id} className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-3">
            <strong className="text-text-primary">{z.titulo}</strong>
            <span className="ml-2 text-xs text-text-secondary">{z.status}</span>
          </li>
        ))}
      </ul>
    </AppScreen>
  );
};

export default ZeladoriaScreen;
