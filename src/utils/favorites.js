export function getFavoriteId(item) {
  return typeof item === 'string' ? item : item?._id;
}

export function resolveNoticesFavorites(data, previousFavorites = []) {
  const fromApi = Array.isArray(data?.noticesFavorites)
    ? data.noticesFavorites
    : Array.isArray(data)
      ? data
      : null;

  if (!fromApi) return previousFavorites;

  const apiIsIdsOnly =
    fromApi.length === 0 ||
    fromApi.every((item) => typeof item === 'string');

  if (!apiIsIdsOnly) return fromApi;

  return fromApi.map((id) => {
    const found = previousFavorites.find((fav) => getFavoriteId(fav) === id);
    return found ?? id;
  });
}
