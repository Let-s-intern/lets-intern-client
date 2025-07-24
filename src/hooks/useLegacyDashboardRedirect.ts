import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * 프로그램 ID 기준으로 챌린지 대시보드 경로를 분기하여 리다이렉트하는 커스텀 훅입니다.
 *
 * @param isNew - 신규 대시보드면 true, 아니면 false를 넘깁니다.
 * @returns isLoading - 분기 및 리다이렉트 처리 중 여부를 나타내는 boolean 값입니다.
 *
 * - 개발/운영 환경에 따라 LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID 기준값이 다릅니다.
 * - 조건에 따라 해당 대시보드 경로로 자동 이동(redirect)됩니다.
 */
export default function useLegacyDashboardRedirect(isNew: boolean) {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID =
      process.env.NODE_ENV === 'development' ? 17 : 101;
    const programId = Number(params.programId);
    const applicationId = params.applicationId;
    const condition = isNew
      ? programId < LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID
      : programId >= LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID;
    const redirectUrl = isNew
      ? `/challenge/${applicationId}/${programId}`
      : `/challenge/${programId}/dashboard/${applicationId}`;

    if (condition) navigate(redirectUrl);
    setIsLoading(false);
  }, [navigate, params, isNew]);

  return isLoading;
}
