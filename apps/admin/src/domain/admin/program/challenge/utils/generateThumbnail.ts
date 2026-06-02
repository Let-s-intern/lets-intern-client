import { uploadFile } from '@/api/file';
import { ChallengeType } from '@/schema';
import axios from '@/utils/axios';

export const THUMBNAIL_IMAGES: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '/images/thumbnail-personal-statement.png',
  PERSONAL_STATEMENT_LARGE_CORP:
    '/images/thumbnail-personal-statement-large-corp.png',
  EXPERIENCE_SUMMARY: '/images/thumbnail-experience-summary.png',
  DOCUMENT_PREPARATION: '/images/thumbnail-document-preparation.png',
  PORTFOLIO: '/images/thumbnail-portfolio.png',
};

export const THUMBNAIL_TYPE_LABELS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '자기소개서',
  PERSONAL_STATEMENT_LARGE_CORP: '대기업',
  EXPERIENCE_SUMMARY: '경험정리',
  DOCUMENT_PREPARATION: '서류준비',
  PORTFOLIO: '포트폴리오',
};

export const extractGeneration = (title: string): string | null => {
  const matches = [...title.matchAll(/(\d+)기/g)];
  const last = matches[matches.length - 1];
  return last ? `${last[1]}기` : null;
};

export const BADGE_COLORS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '#FF9C34',
  PERSONAL_STATEMENT_LARGE_CORP: '#FF9C34',
  EXPERIENCE_SUMMARY: '#57B3FF',
  DOCUMENT_PREPARATION: '#DB77FF',
  PORTFOLIO: '#4F79FE',
};

const CANVAS_WIDTH = 860;
const CANVAS_HEIGHT = 645;
const BADGE_X = 60;
const BADGE_Y = 366;
const BADGE_RADIUS = 18;
const BADGE_PADDING = { top: 4, right: 18, bottom: 6, left: 18 };
const FONT_SIZE = 33;
const LINE_HEIGHT = 45;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function drawBadgeOnCanvas(
  challengeType: ChallengeType,
  title: string,
): Promise<Blob | null> {
  const imagePath = THUMBNAIL_IMAGES[challengeType];
  const badgeColor = BADGE_COLORS[challengeType];
  const generation = extractGeneration(title);

  if (!imagePath || !badgeColor || !generation) return null;

  const img = await loadImage(imagePath);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.font = `bold ${FONT_SIZE}px Pretendard`;
  const textWidth = ctx.measureText(generation).width;

  const badgeWidth = BADGE_PADDING.left + textWidth + BADGE_PADDING.right;
  const badgeHeight = BADGE_PADDING.top + LINE_HEIGHT + BADGE_PADDING.bottom;

  ctx.fillStyle = badgeColor;
  ctx.beginPath();
  ctx.roundRect(BADGE_X, BADGE_Y, badgeWidth, badgeHeight, BADGE_RADIUS);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    generation,
    BADGE_X + BADGE_PADDING.left,
    BADGE_Y + badgeHeight / 2,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob 실패'));
    }, 'image/png');
  });
}

export async function fetchChallengeType(
  challengeId: number,
): Promise<ChallengeType> {
  const res = await axios.get(`/challenge/${challengeId}/type`);
  return res.data.data.challengeType as ChallengeType;
}

export async function generateAndUploadThumbnail(
  challengeType: ChallengeType,
  title: string,
): Promise<string | null> {
  const blob = await drawBadgeOnCanvas(challengeType, title);
  if (!blob) return null;

  const file = new File([blob], `challengethumbnail${Date.now()}.png`, {
    type: 'image/png',
  });
  return uploadFile({ file, type: 'CHALLENGE' });
}
