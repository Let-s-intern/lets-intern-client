/**
 * 프로필 이미지의 **구도와 블러를 파일에 굽는다.**
 *
 * 두 가지를 굽는 이유가 같다. 화면에서만 처리하면 원본이 그대로 남기 때문이다.
 *
 * - 블러: 표시 단계에서 CSS `filter: blur()` 로 흐리게 하면 원본 URL 이 살아 있어
 *   네트워크 탭이면 선명한 사진이 나온다. 신원을 감추려던 목적을 달성하지 못한다.
 * - 구도: 프로필 이미지를 보여주는 화면이 저마다 비율이 다르고(멘토앱 1:1, 웹 목록
 *   540:421, 웹 상세 히어로는 세로로 긴 띠) 전부 `object-cover` 라, 어느 비율로 저장하든
 *   어딘가에서는 잘린다. 서버에 `object-position` 을 저장할 필드도 없다. 그래서
 *   **정사각형으로 잘라 굽는다** — 중앙에 얼굴이 오면 어떤 비율의 컨테이너에서도 살아남는다.
 *
 * 서버는 손대지 않는다. `POST /file` 에 넘기는 File 을 바꿔치기하는 것뿐이라 웹·어드민 등
 * 이 이미지를 보여주는 모든 화면이 자동으로 따라온다.
 */

/** 출력 한 변의 최대 길이. 화면 안내 문구("권장 600px")와 같은 값이다. */
const MAX_OUTPUT_PX = 600;

/**
 * 블러 강도 — 출력 크기를 몇 분의 1 로 줄였다가 되늘릴지.
 *
 * 600px 기준 약 43px 로 줄었다가 돌아온다. 얼굴을 알아볼 수 없으면서 사람이 있다는 것과
 * 옷·배경 색은 남는 수준이다. 멘토가 조절하지 않는다 — "이 정도면 되나" 를 고민하게 만들면
 * 너무 약하게 걸어 신원이 드러나는 선택이 가능해진다.
 *
 * 세기를 픽셀이 아니라 배율로 잡은 이유: `blur(30px)` 은 4000px 사진에서는 거의 티가 안 난다.
 * 먼저 출력 크기로 정규화한 뒤 그 비율로 줄이면 원본 해상도와 무관하게 세기가 일정하다.
 */
const DOWNSCALE_FACTOR = 14;

/** 확대 단계에 얹는 마무리 블러. 보간이 남긴 계단을 없앤다. 지원하는 브라우저에서만 걸린다. */
const SMOOTHING_BLUR_PX = 6;

const JPEG_QUALITY = 0.85;

/**
 * 잘라낼 정사각형의 위치. 각 축에서 남는 여백을 0~1 로 나눈 비율이다.
 *
 * 0.5 는 가운데. 짧은 변 쪽은 여백이 0 이라 값이 무시된다(세로 사진이면 x 가 그렇다).
 */
export interface Framing {
  x: number;
  y: number;
}

export const CENTERED: Framing = { x: 0.5, y: 0.5 };

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** 알파가 있는 원본만 PNG 로 내보낸다. 나머지는 JPEG 가 훨씬 작다. */
export const outputMimeFor = (file: File): string =>
  file.type === 'image/png' ? 'image/png' : 'image/jpeg';

/**
 * 파일명 확장자를 실제 바이트에 맞춘다.
 *
 * 서버 `S3Utils.saveFile()` 은 넘어온 파일명을 **그대로 S3 키로 쓰고** 확장자를 검증하지
 * 않는다. `.png` 이름에 JPEG 바이트를 담아 보내면 키와 내용이 어긋난 채 저장된다.
 */
export const renameForMime = (name: string, mime: string): string => {
  const ext = mime === 'image/png' ? 'png' : 'jpg';
  const base = name.replace(/\.[^./\\]*$/, '');
  return `${base || 'profile'}.${ext}`;
};

/**
 * 잘라낼 정사각형을 원본 좌표로 계산한다.
 *
 * 화면의 드래그를 원본 픽셀로 옮길 때도 이 값이 필요해서 밖으로 뺐다.
 */
export const cropRect = (
  width: number,
  height: number,
  framing: Framing,
): { x: number; y: number; side: number } => {
  const side = Math.min(width, height);
  return {
    x: (width - side) * clamp01(framing.x),
    y: (height - side) * clamp01(framing.y),
    side,
  };
};

/**
 * EXIF 회전을 살려 디코드한다.
 *
 * 살리지 않으면 아이폰에서 세로로 찍은 사진이 옆으로 누운 채 구워진다. `imageOrientation`
 * 옵션을 모르는 브라우저는 옵션 자체를 거부하므로 한 번 더 시도한다.
 *
 * **실패하면 던진다.** 원본을 그대로 흘려보내는 폴백은 두지 않는다.
 */
export const decodeImage = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return await createImageBitmap(file);
  }
};

const getContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d 컨텍스트를 만들지 못했습니다.');
  return ctx;
};

/**
 * `ctx.filter` 를 실제로 적용하는 브라우저인지 본다.
 *
 * 구형 사파리는 `ctx.filter` 대입을 **에러 없이 무시한다.** 그래서 이걸 블러의 주 수단으로
 * 삼으면, 신원을 감추려던 멘토의 선명한 원본이 아무 경고 없이 올라간다. 여기서는 마무리
 * 용도로만 쓰고, 블러 자체는 아래 축소→확대가 담당한다.
 */
const supportsCanvasFilter = (ctx: CanvasRenderingContext2D): boolean => {
  const original = ctx.filter;
  try {
    ctx.filter = 'blur(1px)';
    return ctx.filter !== 'none' && ctx.filter !== '';
  } catch {
    return false;
  } finally {
    ctx.filter = original;
  }
};

const makeCanvas = (size: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
};

/**
 * 잘라낸 정사각형을 캔버스에 그린다. 블러가 켜져 있으면 흐리게 그린다.
 *
 * 미리보기와 업로드가 **이 함수 하나**를 함께 쓴다. 미리보기용으로 따로 그리면 둘이
 * 어긋났을 때 멘토는 흐린 화면을 보고 저장했는데 선명한 사진이 올라간 것을 알 수 없다.
 */
export const renderProfileImage = (
  canvas: HTMLCanvasElement,
  bitmap: ImageBitmap,
  { framing, blur, mime }: { framing: Framing; blur: boolean; mime: string },
): void => {
  const { x, y, side } = cropRect(bitmap.width, bitmap.height, framing);
  const out = Math.min(MAX_OUTPUT_PX, side); // 원본보다 크게 늘리지 않는다

  canvas.width = out;
  canvas.height = out;
  const ctx = getContext(canvas);

  // JPEG 에는 알파가 없다. 흰 배경을 깔지 않으면 투명한 부분이 검게 죽는다.
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out, out);
  } else {
    ctx.clearRect(0, 0, out, out);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (!blur) {
    ctx.drawImage(bitmap, x, y, side, side, 0, 0, out, out);
    return;
  }

  // 1단계: 아주 작게 줄인다. 여기서 얼굴 정보가 사라진다.
  const seedSize = Math.max(1, Math.round(out / DOWNSCALE_FACTOR));
  const seed = makeCanvas(seedSize);
  const seedCtx = getContext(seed);
  seedCtx.imageSmoothingEnabled = true;
  seedCtx.imageSmoothingQuality = 'high';
  seedCtx.drawImage(bitmap, x, y, side, side, 0, 0, seedSize, seedSize);

  // 2단계: 되늘린다. 보간 자체가 블러라 브라우저 지원을 타지 않는다.
  if (supportsCanvasFilter(ctx)) {
    ctx.filter = `blur(${SMOOTHING_BLUR_PX}px)`;
  }
  ctx.drawImage(seed, 0, 0, out, out);
  ctx.filter = 'none';
};

/**
 * 그려진 캔버스를 업로드할 File 로 굳힌다.
 *
 * **실패하면 던진다.** 호출부는 예외를 잡아 업로드를 멈추고 멘토에게 알려야 한다 —
 * 흐릴 줄 알았던 사진이나 잘못 잘린 사진이 조용히 올라가면 안 된다.
 */
export const canvasToFile = (
  canvas: HTMLCanvasElement,
  source: File,
): Promise<File> => {
  const mime = outputMimeFor(source);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지를 변환하지 못했습니다.'));
          return;
        }
        resolve(
          new File([blob], renameForMime(source.name, mime), { type: mime }),
        );
      },
      mime,
      mime === 'image/jpeg' ? JPEG_QUALITY : undefined,
    ),
  );
};
