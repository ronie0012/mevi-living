'use client';

import { useEffect } from 'react';

export const ChatZoneProtector: React.FC = () => {
  useEffect(() => {
    const protectChatZone = () => {
      // Define the protected chat zone (bottom-right corner)
      const chatZone = {
        right: 0,
        bottom: 0,
        width: 350, // Chat widget width + padding
        height: 450, // Chat widget height + padding
      };

      // Find all elements that might be interfering with the chat zone
      const allElements = document.querySelectorAll('*:not(.mevi-living-chat-widget):not(.mevi-living-chat-widget *)');
      
      allElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        // Check if element overlaps with chat zone
        const overlapsWithChatZone = (
          rect.right > window.innerWidth - chatZone.width &&
          rect.bottom > window.innerHeight - chatZone.height &&
          rect.width > 50 && // Ignore very small elements
          rect.height > 50 &&
          ['absolute', 'fixed'].includes(style.position)
        );
        
        if (overlapsWithChatZone) {
          const el = element as HTMLElement;
          
          // Instead of hiding, move the element slightly to avoid overlap
          if (!el.dataset.chatProtected) {
            el.dataset.chatProtected = 'true';
            
            // Add CSS to move it away from chat zone
            el.style.transform = 'translate(-350px, 0)';
            el.style.transition = 'transform 0.3s ease';
            el.style.zIndex = '1';
            
            console.log('🛡️ Protected chat zone from element:', element.tagName, element.className);
          }
        }
      });
      
      // Also specifically target carousel elements that are commonly problematic
      const carouselElements = document.querySelectorAll(`
        .absolute.inset-0:not(.mevi-living-chat-widget *),
        img.object-cover:not(.mevi-living-chat-widget *),
        [class*="carousel"]:not(.mevi-living-chat-widget *),
        [class*="slider"]:not(.mevi-living-chat-widget *),
        [class*="swiper"]:not(.mevi-living-chat-widget *)
      `);
      
      carouselElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        
        // If carousel element is in chat zone, hide or move it
        if (rect.right > window.innerWidth - 350 && rect.bottom > window.innerHeight - 450) {
          const el = element as HTMLElement;
          if (!el.dataset.carouselProtected) {
            el.dataset.carouselProtected = 'true';
            el.style.visibility = 'hidden';
            console.log('🎠 Hidden carousel element in chat zone:', element);
          }
        }
      });
    };

    // Run immediately and then periodically
    protectChatZone();
    
    const interval = setInterval(protectChatZone, 2000);
    
    // Also run on resize to handle responsive changes
    const handleResize = () => {
      setTimeout(protectChatZone, 100);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
};

export default ChatZoneProtector;