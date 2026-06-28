$files = @()

$files += @{
    Path = "c:\Users\LeoPardo\Documents\projetos\UXporte\ilha-ativa\src\components\layout\AppShell.jsx"
    Content = @'
import { Outlet } from 'react-router-dom';
import MainMenu from '@/components/navigation/MainMenu';
import PersistentHeader from './PersistentHeader';
import PresentationOverlay from '@/components/demo/PresentationOverlay';

export default function AppShell() {
  return (
    <div className="h-dvh bg-surface-base2 text-text-primary">
      <div className="mx-auto flex h-dvh w-full max-w-[412px] flex-col bg-surface-base shadow-card relative">

        <PresentationOverlay />

        <PersistentHeader />

        <main className="relative flex-1 min-h-0">
          <Outlet />
        </main>

        <MainMenu />
      </div>
    </div>
  );
}
'@
}

$files += @{
    Path = "c:\Users\LeoPardo\Documents\projetos\UXporte\ilha-ativa\src\components\layout\AppScreen.jsx"
    Content = @'
import { cn } from '@/lib/utils';

export default function AppScreen({ className, children, variant = 'default', fullscreen = false }) {
  const variantClass = {
    default: 'bg-surface-base',
    warm: 'bg-surface-base2',
    accent: 'bg-container-accent',
    inverse: 'bg-surface-inverse text-text-inverse',
  }[variant];

  return (
    <section
      className={cn(
        'min-h-full w-full text-text-primary',
        !fullscreen && 'px-5 py-6',
        variantClass,
        className
      )}
    >
      <div className={cn('mx-auto flex w-full flex-col gap-6', !fullscreen && 'max-w-[382px]')}>
        {children}
      </div>
    </section>
  );
}
'@
}

foreach ($f in $files) {
    [System.IO.File]::WriteAllText($f.Path, $f.Content, [System.Text.Encoding]::UTF8)
    Write-Host "Written: $($f.Path)"
}
