import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppScreen from '@/components/layout/AppScreen';
import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZeladoriaRulesService } from '@/domain/zeladoria/rulesService';
import { LocalService } from '@/domain/local/service';
import { queryKeys } from '@/domain/shared/queryKeys';
import { useQuery, useMutation } from '@tanstack/react-query';

const ZeladoriaCreateScreen = () => {
  const { localId: paramLocalId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Preenchimento, 2: Revisão, 3: Confirmação
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    localId: paramLocalId || '',
    prioridade: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [local, setLocal] = useState(null);

  const {
    data: fetchedLocal,
    isLoading: isLoadingLocal,
    isError: isErrorLocal,
  } = useQuery({
    queryKey: queryKeys.locais.byId(paramLocalId),
    queryFn: () => LocalService.getById(paramLocalId),
    enabled: !!paramLocalId,
  });

  useEffect(() => {
    if (fetchedLocal) {
      setLocal(fetchedLocal);
      setFormData((prev) => ({ ...prev, localId: fetchedLocal.id }));
    }
  }, [fetchedLocal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      const validationResult = ZeladoriaRulesService.validateForCreate({
        ...formData,
        criadorId: 'mock-user-id', // TODO: Replace with actual user ID
        titulo: formData.categoria, // Using categoria as titulo for now
      });

      if (!validationResult.valid) {
        const errors = {};
        validationResult.errors.forEach((error) => {
          if (error.includes('localId')) errors.localId = 'Local é obrigatório.';
          if (error.includes('titulo')) errors.categoria = 'Categoria é obrigatória.';
          if (error.includes('descricao')) errors.descricao = 'Descrição é obrigatória.';
        });
        setFormErrors(errors);
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const createZeladoriaMutation = useMutation({
    mutationFn: async (newZeladoria) => {
      // TODO: Integrate with actual Zeladoria creation service
      return new Promise((resolve) => setTimeout(() => resolve(newZeladoria), 1500));
    },
    onSuccess: () => {
      setStep(3); // Move to confirmation step
    },
    onError: (error) => {
      console.error('Erro ao criar zeladoria:', error);
      setFormErrors({ general: 'Erro ao criar zeladoria. Tente novamente.' });
    },
  });

  const handleSubmit = () => {
    createZeladoriaMutation.mutate({
      ...formData,
      criadorId: 'mock-user-id', // TODO: Replace with actual user ID
      titulo: formData.categoria, // Using categoria as titulo for now
      status: ZeladoriaRulesService.getInitialStatus(),
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input
              label="Categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              error={formErrors.categoria}
              placeholder="Ex: Iluminação, Buraco na rua"
            />
            <Input
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              error={formErrors.descricao}
              multiline
              rows={4}
              placeholder="Detalhes sobre o problema"
            />
            <Input
              label="Prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              placeholder="Ex: Alta, Média, Baixa"
            />
            <div className="mt-4">
              {isLoadingLocal && <p>Carregando Local...</p>}
              {isErrorLocal && <p className="text-red-500">Erro ao carregar Local.</p>}
              {local && (
                <div className="p-4 border rounded-md bg-gray-100">
                  <h3 className="font-bold">Local Selecionado:</h3>
                  <p>{local.nome}</p>
                  <p>{local.endereco}</p>
                </div>
              )}
              {!paramLocalId && !local && (
                <Input
                  label="ID do Local (opcional)"
                  name="localId"
                  value={formData.localId}
                  onChange={handleChange}
                  error={formErrors.localId}
                  placeholder="Preencha se souber o ID do local"
                />
              )}
            </div>
            <Button onClick={handleNextStep} className="mt-6 w-full">
              Revisar
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Revisão da Zeladoria</h2>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p>
                <strong>Categoria:</strong> {formData.categoria}
              </p>
              <p>
                <strong>Descrição:</strong> {formData.descricao}
              </p>
              <p>
                <strong>Prioridade:</strong> {formData.prioridade}
              </p>
              {local && (
                <p>
                  <strong>Local:</strong> {local.nome} ({local.endereco})
                </p>
              )}
            </div>
            {formErrors.general && (
              <p className="text-red-500 mb-4">{formErrors.general}</p>
            )}
            <div className="flex justify-between mt-6">
              <Button onClick={handlePreviousStep} variant="secondary">
                Voltar
              </Button>
              <Button onClick={handleSubmit} disabled={createZeladoriaMutation.isLoading}>
                {createZeladoriaMutation.isLoading ? 'Enviando...' : 'Confirmar e Enviar'}
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Zeladoria Criada com Sucesso!</h2>
            <p>Sua solicitação de zeladoria foi enviada e será processada.</p>
            <Button onClick={() => navigate('/')} className="mt-6 w-full">
              Voltar para o Início
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AppScreen>
      <PageTitle>Criar Zeladoria</PageTitle>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        {renderStepContent()}
      </div>
    </AppScreen>
  );
};

export default ZeladoriaCreateScreen;
