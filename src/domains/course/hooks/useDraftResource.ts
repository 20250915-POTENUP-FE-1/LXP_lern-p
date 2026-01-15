const DRAFT_RESOURCES_KEY = 'draftResources';

export function useDraftResource() {
  const getDraftResources = (): DraftResource[] => {
    const raw = sessionStorage.getItem(DRAFT_RESOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const addDraftResource = (resource: DraftResource) => {
    const list = getDraftResources();
    sessionStorage.setItem(DRAFT_RESOURCES_KEY, JSON.stringify([...list, resource]));
  };

  const clearDraftResources = () => {
    sessionStorage.removeItem(DRAFT_RESOURCES_KEY);
  };

  return { getDraftResources, addDraftResource, clearDraftResources };
}

type DraftResource = {
  resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
  key: string;
  fileName: string;
  duration?: number;
  isDownloadable?: boolean;
};
