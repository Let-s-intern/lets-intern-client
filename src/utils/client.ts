interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}
interface HttpError extends Error {
  status?: number;
}

async function client<T>(
  endpoint: string,
  { params, ...customConfig }: RequestConfig,
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  // URL에 쿼리 파라미터 추가
  const queryString = params ? `?${new URLSearchParams(params)}` : '';
  const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api${endpoint}${queryString}`;

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(
        data.message || '요청에 실패했습니다.',
      ) as HttpError;
      error.status = res.status;
      throw error;
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

export { client };
