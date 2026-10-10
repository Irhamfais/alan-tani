'use client';

import { useEffect } from 'react';
import { config } from '@/lib/data';

/**
 * Helper to show toast notification matching preview v5 functionality
 */
export function showToast(message: string) {
  if (typeof window !== 'undefined') {
    const fn = (window as unknown as { toast?: (msg: string) => void }).toast;
    if (fn) {
      fn(message);
    } else {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
    }
  }
}

export default function FloatingWhatsApp() {
  useEffect(() => {
    let toastTimer: NodeJS.Timeout;

    const triggerToast = (msg: string) => {
      const t = document.getElementById('toast');
      if (t) {
        t.textContent = msg;
        t.setAttribute('data-show', 'true');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          t.setAttribute('data-show', 'false');
        }, 3500);
      }
    };

    // Expose global window.toast matching preview v5 behavior
    (window as unknown as { toast: (msg: string) => void }).toast = triggerToast;

    const handleToastEvent = (e: CustomEvent<string>) => {
      triggerToast(e.detail);
    };

    window.addEventListener(
      'show-toast' as unknown as keyof WindowEventMap,
      handleToastEvent as EventListener
    );

    return () => {
      clearTimeout(toastTimer);
      window.removeEventListener(
        'show-toast' as unknown as keyof WindowEventMap,
        handleToastEvent as EventListener
      );
    };
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined' && 'dataLayer' in window) {
      (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
        event: 'whatsapp_click',
        location: 'floating',
      });
    }
  };

  const waUrl = `https://wa.me/${config.waNumber}?text=${encodeURIComponent(
    'Halo, saya ingin bertanya tentang produk pertanian'
  )}`;

  return (
    <>
      <a
        className="fab"
        href={waUrl}
        target="_blank"
        rel="noopener"
        data-wa
        data-wa-loc="floating"
        aria-label="Chat WhatsApp Alan Tani"
        onClick={handleClick}
      >
        <svg
          className="w-7 h-7 relative"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      <div
        className="toast"
        id="toast"
        role="status"
        aria-live="polite"
        data-show="false"
      />
    </>
  );
}
