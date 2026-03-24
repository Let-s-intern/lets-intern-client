// Instagram thumbnail images
// Placeholder structure — replace with actual image imports when available.
//
// Usage example:
//   import { INSTAGRAM_THUMBNAILS } from '../_images';
//   INSTAGRAM_THUMBNAILS.official[0] → placeholder string
//
// When real images are ready, replace the placeholder strings with:
//   import officialThumb1 from './instagram/official-1.webp';

export const INSTAGRAM_THUMBNAILS: Record<string, string[]> = {
  official: Array.from({ length: 6 }, (_, i) => `/placeholder-thumb-official-${i + 1}.svg`),
  job: Array.from({ length: 6 }, (_, i) => `/placeholder-thumb-job-${i + 1}.svg`),
  qna: Array.from({ length: 6 }, (_, i) => `/placeholder-thumb-qna-${i + 1}.svg`),
};
