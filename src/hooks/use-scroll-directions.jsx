import { useState, useEffect, useRef } from 'react';

/**
 * Hook que detecta a direção do scroll em ambos os eixos (X e Y).
 *
 * Retorna:
 * - directionY: "up" | "down"
 * - directionX: "left" | "right"
 * - isVisible: comportamento padrão para header (baseado no eixo Y)
 *
 * Regras do isVisible:
 * - Scroll para baixo → false (esconde)
 * - Scroll para cima → true (mostra)
 * - Sempre visível próximo do topo
 */
export default function useScrollDirections() {
  // Estado de visibilidade (pensado para header)
  const [isVisible, setIsVisible] = useState(true);

  // Direções detectadas
  const [directionY, setDirectionY] = useState("up");
  const [directionX, setDirectionX] = useState("left");

  // Referências das últimas posições (não causam re-render)
  const lastScrollY = useRef(0);
  const lastScrollX = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // ===== EIXO Y (vertical) =====
      if (scrollY > lastScrollY.current) {
        setDirectionY("down");
      } else {
        setDirectionY("up");
      }

      // ===== EIXO X (horizontal) =====
      if (scrollX > lastScrollX.current) {
        setDirectionX("right");
      } else {
        setDirectionX("left");
      }

      // ===== REGRA DE VISIBILIDADE (header) =====
      if (scrollY > lastScrollY.current && scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Atualiza referências
      lastScrollY.current = scrollY;
      lastScrollX.current = scrollX;
    };

    window.addEventListener("scroll", updateScrollDirection);

    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  return {
    isVisible,
    directionY,
    directionX
  };
}