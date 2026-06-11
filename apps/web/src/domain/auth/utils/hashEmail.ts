/** 이메일을 SHA-256으로 해시하여 앞 8자만 반환한다 (PII 회피용). */
export async function hashEmailPrefix(email: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex.slice(0, 8);
  } catch {
    return 'unknown';
  }
}
