export const MAX_BULK_SITES = 30;

/** 비교용 호스트. 스킴이 없으면 붙여 읽고, www. 는 같은 사이트로 본다. 주소가 아니면 입력 그대로 */
export const hostOf = (siteUrl: string) => {
  try {
    const url = new URL(
      /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`,
    );
    return url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return siteUrl.toLowerCase();
  }
};

export interface ParsedSiteUrls {
  siteUrls: string[];
  /** 입력 안에서, 또는 이미 표에 있는 사이트와 호스트가 같아 뺀 건수 */
  removedDuplicates: number;
  /** 정리한 뒤에도 MAX_BULK_SITES 를 넘으면 true. 이때는 가져오지 않는다 */
  isOverLimit: boolean;
}

/**
 * 줄마다 하나인 사이트 주소를 정리한다. 앞뒤 공백·빈 줄을 빼고, 같은 호스트는 처음 것만 남긴다.
 * existingHosts 는 이미 표에 있는 사이트들 — 다시 가져오지 않는다.
 */
export const parseSiteUrls = (
  text: string,
  existingHosts: readonly string[] = [],
): ParsedSiteUrls => {
  const seen = new Set(existingHosts);
  const siteUrls: string[] = [];
  let removedDuplicates = 0;

  for (const line of text.split(/\r?\n/)) {
    const siteUrl = line.trim();
    if (!siteUrl) continue;
    const host = hostOf(siteUrl);
    if (seen.has(host)) {
      removedDuplicates += 1;
      continue;
    }
    seen.add(host);
    siteUrls.push(siteUrl);
  }

  return {
    siteUrls,
    removedDuplicates,
    isOverLimit: siteUrls.length > MAX_BULK_SITES,
  };
};
