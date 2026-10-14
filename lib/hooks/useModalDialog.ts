'use client';

import { useEffect, useRef } from 'react';

/**
 * Shared open/close behaviour for the native <dialog> modals (product and article detail):
 * opens with showModal() while `open` is true, locks page scroll, closes on backdrop click,
 * and returns focus to the element that opened it.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (open) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.documentElement.style.overflow = 'hidden';
      if (!dlg.open) {
        dlg.showModal();
      }
    } else {
      document.documentElement.style.overflow = '';
      if (dlg.open) {
        dlg.close();
      }
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }

    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const handleClose = () => {
      document.documentElement.style.overflow = '';
      onClose();
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    };

    dlg.addEventListener('close', handleClose);
    return () => {
      dlg.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  /** Closes the dialog. Pass `restoreFocus: false` when the caller scrolls elsewhere right after. */
  const close = ({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
    if (!restoreFocus) previousActiveElementRef.current = null;
    document.documentElement.style.overflow = '';
    dialogRef.current?.close();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return { dialogRef, close, handleBackdropClick };
}
