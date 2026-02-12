const PUBLIC_ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

export const toPublicAssetUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${PUBLIC_ASSET_BASE_URL}${normalized}`;
};
