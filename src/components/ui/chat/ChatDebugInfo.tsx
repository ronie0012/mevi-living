'use client';

import React, { useEffect, useState } from 'react';

export const ChatDebugInfo: React.FC = () => {
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    // Check for potential conflicting elements
    const checkConflicts = () => {
      const foundConflicts: string[] = [];
      
      // Check for fixed positioned elements
      const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
      fixedElements.forEach((el, index) => {
        if (!el.closest('.mevi-living-chat-widget')) {
          foundConflicts.push(`Fixed element ${index}: ${el.tagName} with classes: ${el.className}`);
        }
      });
      
      // Check for high z-index elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el);
        const zIndex = parseInt(computedStyle.zIndex);
        if (zIndex > 9000 && !el.closest('.mevi-living-chat-widget')) {
          foundConflicts.push(`High z-index element: ${el.tagName} with z-index: ${zIndex} and classes: ${el.className}`);
        }
      });
      
      // Check for overlapping positioned elements in bottom-right
      const bottomRightElements = Array.from(allElements).filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const isPositioned = ['absolute', 'fixed'].includes(style.position);
        const isInBottomRight = rect.right > window.innerWidth - 100 && rect.bottom > window.innerHeight - 100;
        return isPositioned && isInBottomRight && !el.closest('.mevi-living-chat-widget');
      });
      
      bottomRightElements.forEach((el, index) => {
        foundConflicts.push(`Bottom-right positioned element ${index}: ${el.tagName} with classes: ${el.className}`);
      });
      
      setConflicts(foundConflicts);
    };
    
    checkConflicts();
    
    // Re-check periodically
    const interval = setInterval(checkConflicts, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development' || conflicts.length === 0) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
        background: 'rgba(255, 0, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        maxWidth: '400px',
        zIndex: 999999,
        fontFamily: 'monospace'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        🚨 Chat Widget UI Conflicts Detected:
      </div>
      {conflicts.map((conflict, index) => (
        <div key={index} style={{ marginBottom: '3px', fontSize: '11px' }}>
          {conflict}
        </div>
      ))}
    </div>
  );
};