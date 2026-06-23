import React, { useEffect, useState } from 'react';
import ZeladoriaService from '../services/ZeladoriaService';

const ZeladoriaDetailsScreen = () => {
  const [zeladoria, setZeladoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Novo estado de erro

  useEffect(() => {
    // Chamada mínima ao service para preparar a obtenção dos dados
    ZeladoriaService.getZeladoriaById('some-id')
      .then(data => {
        setZeladoria(data);
        console.log('Dados da Zeladoria (apenas para verificação): ', data);
      })
      .catch(error => {
        console.error('Erro ao obter dados da Zeladoria: ', error);
        setError(error); // Define o estado de erro
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Detalhes da Zeladoria</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro: {error.message}</p> // Exibe mensagem de erro
      ) : (
        zeladoria ? (
          <div>
            <p><strong>Categoria:</strong> {zeladoria.categoria}</p>
            <p><strong>Descrição:</strong> {zeladoria.descricao}</p>
            <p><strong>Status:</strong> {zeladoria.status}</p>
            <p><strong>Prioridade:</strong> {zeladoria.prioridade}</p>
            <p><strong>Local:</strong> {zeladoria.local}</p>
          </div>
        ) : (
          <p>Nenhum dado de Zeladoria encontrado.</p>
        )
      )}
    </div>
  );
};

export default ZeladoriaDetailsScreen;
