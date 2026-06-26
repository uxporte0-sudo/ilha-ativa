import HeaderContainer from './header/HeaderContainer';
import HeaderActions from './header/HeaderActions';
import LogoButton from './LogoButton';

/**
 * PersistentHeader
 * Orquestrador do Header.
 * Consome exclusivamente: HeaderContainer, LogoButton, HeaderActions
 * Não deixa regras de layout espalhadas.
 */
export default function PersistentHeader({ className, ...props }) {
  return (
    <HeaderContainer className={className}>
      <LogoButton />
      <HeaderActions />
    </HeaderContainer>
  );
}
