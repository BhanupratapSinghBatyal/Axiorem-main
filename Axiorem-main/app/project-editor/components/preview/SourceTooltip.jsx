'use client';

import React, { createContext, forwardRef, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SourceTooltipContext = createContext(null);

function getPointerPosition(event) {
  return { x: event.clientX, y: event.clientY };
}

export function SourceTooltipProvider({ children }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const showTooltip = useCallback((source, event, id) => {
    const text = typeof source === 'string' ? source.trim() : '';
    if (!text) return;
    setActiveTooltip({ id, source: text, ...getPointerPosition(event) });
  }, []);

  const moveTooltip = useCallback((event, id) => {
    setActiveTooltip((current) => {
      if (!current || current.id !== id) return current;
      return { ...current, ...getPointerPosition(event) };
    });
  }, []);

  const hideTooltip = useCallback((id) => {
    setActiveTooltip((current) => (current?.id === id ? null : current));
  }, []);

  return (
    <SourceTooltipContext.Provider value={{ showTooltip, moveTooltip, hideTooltip }}>
      {children}
      {activeTooltip && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-[9999] max-w-[280px] rounded-md border border-slate-700/80 bg-slate-950/95 px-3 py-2 text-xs font-medium leading-relaxed text-white shadow-xl backdrop-blur-sm"
              style={{ left: activeTooltip.x + 14, top: activeTooltip.y + 14 }}
            >
              {activeTooltip.source}
            </div>,
            document.body
          )
        : null}
    </SourceTooltipContext.Provider>
  );
}

export const SourceHoverTarget = forwardRef(function SourceHoverTarget(
  {
    source,
    as: Component = 'div',
    children,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    ...props
  },
  ref
) {
  const tooltip = useContext(SourceTooltipContext);
  const targetId = useRef(Symbol('source-target')).current;

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    tooltip?.showTooltip(source, event, targetId);
  };

  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    tooltip?.moveTooltip(event, targetId);
  };

  const handlePointerLeave = (event) => {
    onPointerLeave?.(event);
    tooltip?.hideTooltip(targetId);
  };

  return (
    <Component
      ref={ref}
      {...props}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Component>
  );
});
