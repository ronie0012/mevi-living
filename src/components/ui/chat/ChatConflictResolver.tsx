'use client';

import { useEffect } from 'react';

export const ChatConflictResolver: React.FC = () => {
  useEffect(() => {
    const resolveConflicts = () => {
      console.log('🔧 Running chat conflict resolver...');
      
      // Get chat widget position for spatial conflict detection
      const chatWidget = document.querySelector('.mevi-living-chat-widget');
      const chatRect = chatWidget?.getBoundingClientRect();
      
      // Find and fix ALL positioned elements that might interfere
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((element) => {
        // Skip our chat widget elements
        if (element.closest('.mevi-living-chat-widget')) return;
        
        const computedStyle = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // Check if element is positioned and potentially overlapping
        const isPositioned = ['absolute', 'fixed', 'relative'].includes(computedStyle.position);
        const hasHighZIndex = parseInt(computedStyle.zIndex) > 10;
        
        // Check if element is in bottom-right area (where chat widget is)
        const isInBottomRight = chatRect && (
          rect.right > chatRect.left - 100 && 
          rect.bottom > chatRect.top - 100
        );
        
        // Aggressively fix any potentially conflicting element
        if (isPositioned || hasHighZIndex || isInBottomRight) {
          const el = element as HTMLElement;
          
          // Force very low z-index
          el.style.zIndex = '1';
          el.style.position = 'relative';
          
          // Add class to mark as fixed
          el.classList.add('chat-conflict-resolved');
          
          console.log('Fixed conflicting element:', element.tagName, element.className);
        }
      });
      
      // Specifically target carousel/slider patterns
      const carouselSelectors = [
        '.absolute.inset-0',
        'img.object-cover',
        '[class*="carousel"]',
        '[class*="slider"]', 
        '[class*="swiper"]',
        '.absolute[class*="flex"]',
        '.absolute[class*="bg-black"]',
        '.group-hover\\:scale-105'
      ];
      
      carouselSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            if (!el.closest('.mevi-living-chat-widget')) {
              (el as HTMLElement).style.zIndex = '1';
              (el as HTMLElement).style.position = 'relative';
              console.log(`Fixed carousel element (${selector}):`, el);
            }
          });
        } catch (e) {
          // Skip invalid selectors
        }
      });
      
      // Nuclear option: Hide any unnamed high z-index elements
      const unnamedHighZElements = document.querySelectorAll('div:not([class]):not([id])');
      unnamedHighZElements.forEach((div) => {
        const zIndex = parseInt(window.getComputedStyle(div).zIndex);
        if (zIndex > 1000) {
          (div as HTMLElement).style.display = 'none';
          console.log('Hidden problematic unnamed high-z DIV:', div);
        }
      });
    };
    
    // Run immediately
    resolveConflicts();
    
    // Run frequently to catch dynamically loaded content
    const timeouts = [100, 200, 500, 1000, 2000, 5000].map(delay =>
      setTimeout(resolveConflicts, delay)
    );
    
    // Run continuously every 3 seconds to catch persistent issues
    const continuousInterval = setInterval(resolveConflicts, 3000);
    
    // Run on DOM mutations
    const observer = new MutationObserver(resolveConflicts);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(continuousInterval);
      observer.disconnect();
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ChatConflictResolver;