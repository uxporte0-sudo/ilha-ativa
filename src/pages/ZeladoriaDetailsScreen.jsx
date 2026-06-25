import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZeladoriaService } from '@/domain/zeladoria';

const ZeladoriaDetailsScreen = () => {
  const { zeladoriaId } = useParams();
  const [zeladoria, setZeladoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!zeladoriaId) {
      setError(new Error('ID da zeladoria não fornecido'));
      setLoading(false);
      return;
    }

    ZeladoriaService.getById(zeladoriaId)
      .then(data => {
        setZeladoria(data);
        console.log('Dados da Zeladoria: ', data);
      })
      .catch(err => {
        console.error('Erro ao obter dados da Zeladoria: ', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [zeladoriaId]);

  return (
    <div>
      <h1>Detalhes da Zeladoria</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro: {error.message}</p>
      ) : (
        zeladoria ? (
          <div>
            <p><strong>Título:</strong> {zeladoria.titulo}</p>
            <p><strong>Descrição:</strong> {zeladoria.descricao}</p>
            <p><strong>Status:</strong> {zeladoria.status}</p>
            <p><strong>Tipo:</strong> {zeladoria.tipo}</p>
            <p><strong>Local ID:</strong> {zeladoria.localId}</p>
            <p><strong>Data Criação:</strong> {zeladoria.dataCriacao}</p>
          </div>
        ) : (
          <p>Nenhum dado de Zeladoria encontrado.</p>
        )
      )}
    </div>
  );
};

export default ZeladoriaDetailsScreen;
