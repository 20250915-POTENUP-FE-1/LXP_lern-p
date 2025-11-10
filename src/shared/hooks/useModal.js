import { useCallback, useState } from 'react';

export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(Boolean(initialOpen));

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
};
