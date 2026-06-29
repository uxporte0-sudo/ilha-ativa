import React from 'react';

const UserNotRegisteredError = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-surface-base p-6">
      <div className="max-w-md w-full p-6 bg-container-secondary rounded-[var(--radius-card)] shadow-card border border-borderSemantic-subtle">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-brand-primary-subtle">
            <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Acesso Restrito</h1>
          <p className="text-text-secondary mb-6">
            Você não está registrado para usar este aplicativo. Entre em contato com o administrador.
          </p>
          <div className="p-4 bg-container-primary rounded-[var(--radius-card)] text-sm text-text-secondary">
            <p>Se você acredita que isso é um erro:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-left">
              <li>Verifique se está logado com a conta correta</li>
              <li>Contate o administrador do aplicativo</li>
              <li>Tente sair e entrar novamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
