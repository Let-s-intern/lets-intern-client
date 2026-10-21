import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useCreateMeetingServer,
  useMeetingServerListQuery,
  useUpdateMeetingServer,
} from '@/api/meetingServer';
import type {
  CreateMeetingServerReq,
  MeetingServer,
} from '@/api/meetingServerSchema';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import { toMeetingServerErrorMessage } from './toMeetingServerErrorMessage';
import { validateMeetingServerBaseUrl } from './validateMeetingServerBaseUrl';

/**
 * 회의 서버 등록·수정 공용 폼.
 *
 * `/meeting-servers/new` 는 등록, `/meeting-servers/:id/edit` 는 수정이다. 단건 조회 API 가
 * 없어 수정 초기값은 목록 응답에서 찾는다.
 */

const LIST_PATH = '/meeting-servers';
const LABEL_CLASS = 'text-xsmall14 font-medium';
const INPUT_CLASS =
  'rounded-xxs border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary';

const EMPTY_VALUES = {
  baseUrl: '',
  priority: '',
  isActive: true,
};

type FormValues = typeof EMPTY_VALUES;

const toFormValues = (server: MeetingServer): FormValues => ({
  baseUrl: server.baseUrl,
  priority: String(server.priority),
  isActive: server.isActive,
});

/** 문제가 없으면 요청 바디, 있으면 화면에 띄울 사유. */
const toRequest = (
  values: FormValues,
): { req: CreateMeetingServerReq } | { error: string } => {
  const baseUrlError = validateMeetingServerBaseUrl(values.baseUrl);
  if (baseUrlError) return { error: baseUrlError };

  const priority = Number(values.priority);
  if (!values.priority.trim() || !Number.isInteger(priority) || priority < 0) {
    return { error: '우선순위는 0 이상의 정수로 입력해 주세요.' };
  }

  return {
    req: {
      baseUrl: values.baseUrl.trim(),
      priority,
      isActive: values.isActive,
    },
  };
};

interface MeetingServerEditorProps {
  /** 수정 대상. 없으면 등록이다. */
  server?: MeetingServer;
}

const MeetingServerEditor = ({ server }: MeetingServerEditorProps) => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();
  const isEdit = server !== undefined;

  const [values, setValues] = useState<FormValues>(() =>
    server ? toFormValues(server) : EMPTY_VALUES,
  );
  const [error, setError] = useState<string | null>(null);

  const change = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const callbacks = {
    successCallback: () => {
      snackbar(
        isEdit ? '회의 서버를 수정했습니다.' : '회의 서버를 등록했습니다.',
      );
      navigate(LIST_PATH);
    },
    errorCallback: (e: Error) => {
      console.error('[MeetingServerForm] submit failed', e);
      setError(
        toMeetingServerErrorMessage(
          e,
          isEdit ? '수정하지 못했습니다.' : '등록하지 못했습니다.',
        ),
      );
    },
  };
  const { mutate: create, isPending: isCreating } =
    useCreateMeetingServer(callbacks);
  const { mutate: update, isPending: isUpdating } =
    useUpdateMeetingServer(callbacks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 응답을 기다리는 동안 다시 누르면 같은 서버가 두 번 등록된다.
    if (isCreating || isUpdating) return;

    const result = toRequest(values);
    if ('error' in result) {
      setError(result.error);
      return;
    }

    setError(null);
    if (server)
      update({ meetingServerId: server.meetingServerId, ...result.req });
    else create(result.req);
  };

  return (
    <EditorTemplate
      title={isEdit ? '회의 서버 수정' : '회의 서버 등록'}
      onSubmit={handleSubmit}
      submitButton={{ text: isEdit ? '저장' : '등록' }}
      cancelButton={{ text: '취소', to: LIST_PATH }}
    >
      {isEdit && (
        <p className="rounded-xxs border border-red-300 px-3 py-2 text-sm text-red-500">
          주소를 바꾸면 예전 주소로 열린 회의실은 다음 입장 때 다른 서버로
          옮겨집니다. 저장하면 다음 입장부터 바로 적용됩니다.
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="meeting-server-base-url">
          주소
        </label>
        <input
          id="meeting-server-base-url"
          className={INPUT_CLASS}
          value={values.baseUrl}
          placeholder="https://jitsi-meet.letscareer.co.kr/"
          onChange={(e) => change('baseUrl', e.target.value)}
        />
        <span className="text-neutral-40 text-xs">
          https 로 시작하고 / 로 끝나는 주소입니다. 뒤에 방 이름이 붙습니다.
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="meeting-server-priority">
          우선순위
        </label>
        <input
          id="meeting-server-priority"
          type="number"
          min={0}
          className={INPUT_CLASS}
          value={values.priority}
          onChange={(e) => change('priority', e.target.value)}
        />
        <span className="text-neutral-40 text-xs">
          숫자가 작을수록 앞입니다. 0 이 주 서버입니다.
        </span>
      </div>

      <label className="text-xsmall14 flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => change('isActive', e.target.checked)}
        />
        사용
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </EditorTemplate>
  );
};

const MeetingServerEditRoute = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useMeetingServerListQuery();
  const server = data?.find((item) => item.meetingServerId === id);

  if (isLoading) {
    return (
      <p className="text-neutral-40 py-10 text-center text-sm">
        불러오는 중...
      </p>
    );
  }
  if (isError || !server) {
    return (
      <p className="text-neutral-40 py-10 text-center text-sm">
        회의 서버를 찾을 수 없습니다.
      </p>
    );
  }
  return <MeetingServerEditor server={server} />;
};

const MeetingServerForm = () => {
  const { id } = useParams();

  return id === undefined ? (
    <MeetingServerEditor />
  ) : (
    <MeetingServerEditRoute id={Number(id)} />
  );
};

export default MeetingServerForm;
