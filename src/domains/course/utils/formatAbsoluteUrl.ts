const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const formatAbsoluteUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${BASE_URL}${normalized}`;
};
