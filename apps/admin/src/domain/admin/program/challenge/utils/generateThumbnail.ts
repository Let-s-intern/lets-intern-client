import { uploadFile } from '@/api/file';
import { ChallengeType } from '@/schema';
import axios from '@/utils/axios';

export const THUMBNAIL_IMAGES: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '/images/challenge-thumbnail-personal-statement.png',
  PERSONAL_STATEMENT_LARGE_CORP:
    '/images/challenge-thumbnail-personal-statement-large-corp.png',
  EXPERIENCE_SUMMARY: '/images/challenge-thumbnail-experience-summary.png',
  DOCUMENT_PREPARATION: '/images/challenge-thumbnail-document-preparation.png',
  PORTFOLIO: '/images/challenge-thumbnail-portfolio.png',
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

export const extractWeek = (title: string): string | null => {
  const match = title.match(/(\d+)주/);
  return match ? match[1] : null;
};

export const extractVersion = (title: string): string | null => {
  const match = title.match(/\[(.+?)\]/);
  const version = match?.[1].trim();
  return version ? version : null;
};

export const WEEK_TITLE_TEMPLATES: Partial<
  Record<ChallengeType, (week: string) => string>
> = {
  PERSONAL_STATEMENT: (week) => `자기소개서 ${week}주 완성 챌린지`,
  PORTFOLIO: (week) => `포트폴리오 ${week}주 완성 챌린지`,
};

export const BADGE_COLORS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '#FF9C34',
  PERSONAL_STATEMENT_LARGE_CORP: '#FF9C34',
  EXPERIENCE_SUMMARY: '#57B3FF',
  DOCUMENT_PREPARATION: '#DB77FF',
  PORTFOLIO: '#4F79FE',
};

const CANVAS_WIDTH = 1146;
const CANVAS_HEIGHT = 860;
const BADGE_X = 80;
const BADGE_Y = 488;
const BADGE_RADIUS = 24;
const BADGE_PADDING = { top: 4, right: 24, bottom: 8, left: 24 };
const FONT_SIZE = 44;
const LINE_HEIGHT = 60;

const TITLE_X = 80;
const TITLE_Y = 746.5;
const TITLE_FONT_SIZE = 84;
const TITLE_LETTER_SPACING_RATIO = -0.022;
const TITLE_SHADOW_BLUR = 20;

const TITLE_SHADOW_COLORS: Partial<Record<ChallengeType, string>> = {
  PERSONAL_STATEMENT: '#20A4D9',
  PORTFOLIO: '#E79C00',
};

const VER_BANNER_HEIGHT = 164;
const VER_BANNER_RADIUS = 50;
const VER_BANNER_PADDING_X = 48;
const VER_FONT_SIZE = 64;
const VER_BANNER_MAX_WIDTH = CANVAS_WIDTH * 0.7;

// 문구가 길면 배너가 일러스트를 덮으므로 최대 폭에 맞춰 폰트를 줄인다
export function fitVerFontSize(textWidth: number): number {
  const maxTextWidth = VER_BANNER_MAX_WIDTH - VER_BANNER_PADDING_X * 2;
  if (textWidth <= maxTextWidth) return VER_FONT_SIZE;
  return Math.floor((VER_FONT_SIZE * maxTextWidth) / textWidth);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// JSDOM 등 CSS Font Loading API 미구현 환경(document.fonts === undefined) 방어
function loadFont(font: string, text: string): Promise<FontFace[] | void> {
  return document.fonts ? document.fonts.load(font, text) : Promise.resolve();
}

export async function drawBadgeOnCanvas(
  challengeType: ChallengeType,
  title: string,
): Promise<Blob | null> {
  const imagePath = THUMBNAIL_IMAGES[challengeType];
  const badgeColor = BADGE_COLORS[challengeType];
  const generation = extractGeneration(title);
  const version = extractVersion(title);

  if (!imagePath || !badgeColor || !generation) return null;

  const titleTemplate = WEEK_TITLE_TEMPLATES[challengeType];
  const week = titleTemplate ? extractWeek(title) : null;
  if (titleTemplate && !week) return null;

  const titleText = titleTemplate && week ? titleTemplate(week) : null;

  const [img] = await Promise.all([
    loadImage(imagePath),
    loadFont(`bold ${FONT_SIZE}px "Pretendard Variable"`, generation),
    ...(titleText
      ? [loadFont(`bold ${TITLE_FONT_SIZE}px "Pretendard Variable"`, titleText)]
      : []),
    ...(version
      ? [loadFont(`bold ${VER_FONT_SIZE}px "Pretendard Variable"`, version)]
      : []),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (version) {
    ctx.font = `bold ${VER_FONT_SIZE}px "Pretendard Variable"`;
    const verFontSize = fitVerFontSize(ctx.measureText(version).width);
    if (verFontSize !== VER_FONT_SIZE) {
      ctx.font = `bold ${verFontSize}px "Pretendard Variable"`;
    }

    const bannerWidth =
      ctx.measureText(version).width + VER_BANNER_PADDING_X * 2;
    const bannerX = CANVAS_WIDTH - bannerWidth;

    ctx.fillStyle = badgeColor;
    ctx.beginPath();
    // 위·오른쪽은 캔버스에 붙고 좌하단만 둥글다
    ctx.roundRect(bannerX, 0, bannerWidth, VER_BANNER_HEIGHT, [
      0,
      0,
      0,
      VER_BANNER_RADIUS,
    ]);
    ctx.fill();

    // textBaseline 'middle' 은 em 박스 기준이라 한글이 위로 뜬다.
    // 실제 글리프 박스 높이로 배너 정중앙에 맞춘다
    const metrics = ctx.measureText(version);
    const textY =
      VER_BANNER_HEIGHT / 2 +
      (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(version, bannerX + VER_BANNER_PADDING_X, textY);
  }

  if (titleText) {
    ctx.font = `bold ${TITLE_FONT_SIZE}px "Pretendard Variable"`;
    ctx.letterSpacing = `${(TITLE_FONT_SIZE * TITLE_LETTER_SPACING_RATIO).toFixed(2)}px`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = TITLE_SHADOW_COLORS[challengeType] ?? 'transparent';
    ctx.shadowBlur = TITLE_SHADOW_BLUR;
    ctx.fillText(titleText, TITLE_X, TITLE_Y);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.font = `bold ${FONT_SIZE}px "Pretendard Variable"`;
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
