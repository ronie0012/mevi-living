'use client';

import React, { useEffect, useState } from 'react';

export const ConflictVisualizer: React.FC = () => {
  const [showOverlays, setShowOverlays] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const addOverlays = () => {
      // Remove existing overlays first
      document.querySelectorAll('.conflict-overlay').forEach(el => el.remove());

      if (!showOverlays) return;

      // Find all potentially conflicting elements
      const conflictingElements = document.querySelectorAll(`
        .absolute.inset-0:not(.mevi-living-chat-widget *),
        img.object-cover:not(.mevi-living-chat-widget *),
        .absolute[class*="flex"]:not(.mevi-living-chat-widget *),
        .absolute[class*="bg-black"]:not(.mevi-living-chat-widget *)
      `);

      conflictingElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        
        // Only highlight elements that are in the bottom-right area
        if (rect.right > window.innerWidth - 400 && rect.bottom > window.innerHeight - 500) {
          const overlay = document.createElement('div');
          overlay.className = 'conflict-overlay';
          overlay.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: rgba(255, 0, 0, 0.3);
            border: 2px solid red;
            z-index: 999999;
            pointer-events: none;
            font-size: 10px;
            color: white;
            padding: 2px;
          `;
          overlay.textContent = `${element.tagName}#${index}`;
          document.body.appendChild(overlay);
        }
      });
    };

    addOverlays();

    const interval = setInterval(addOverlays, 2000);
    
    return () => {
      clearInterval(interval);
      document.querySelectorAll('.conflict-overlay').forEach(el => el.remove());
    };
  }, [showOverlays]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 50,
        right: 10,
        background: 'rgba(0, 0, 255, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 999999,
        fontFamily: 'monospace'
      }}
    >
      <button 
        onClick={() => setShowOverlays(!showOverlays)}
        style={{
          background: showOverlays ? 'red' : 'green',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        {showOverlays ? '🔴 Hide' : '🟢 Show'} Conflicts
      </button>
    </div>
  );
};

export default ConflictVisualizer;