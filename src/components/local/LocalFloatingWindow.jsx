import { useEffect } from 'react';
import LocalViewer from './LocalViewer';

export default function LocalFloatingWindow({ local, ativos, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-container-primary shadow-xl sm:rounded-2xl">
        <div className="flex-1 overflow-y-auto">
          <LocalViewer
            local={local}
            ativos={ativos}
            onRetry={() => {}}
          />
        </div>
        <div className="flex justify-end border-t border-borderSemantic-subtle bg-container-secondary p-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-control)] bg-container-primary px-4 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-container-tertiary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
