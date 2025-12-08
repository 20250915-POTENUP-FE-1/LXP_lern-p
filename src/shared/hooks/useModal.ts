import { useCallback, useState } from 'react';

export const useModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(initialOpen));

  const open = useCallback((): void => setIsOpen(true), []);
  const close = useCallback((): void => setIsOpen(false), []);

  return { isOpen, open, close };
};
