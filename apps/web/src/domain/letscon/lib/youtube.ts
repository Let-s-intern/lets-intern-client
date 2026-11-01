const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;

export const getYoutubeVideoId = (url: string) =>
  url.match(YOUTUBE_ID_PATTERN)?.[1] ?? null;
