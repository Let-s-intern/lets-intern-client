import {
  useCreateAdminNoticeMutation,
  useGetAdminNoticeDetail,
  useUpdateAdminNoticeMutation,
} from '@/api/challenge/noticeTemplate';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import { AdminNoticeType, CreateAdminNoticeReq } from '@/schema';
import { ProgramRecommend } from '@/types/interface';
import { useEffect } from 'react';
import { useState } from 'react';

const EMPTY_FORM: CreateAdminNoticeReq = { type: 'NOTICE', title: '', url: '' };
const defaultProgramRecommend: ProgramRecommend = { list: [] };

interface Props {
  mode: 'create' | 'edit';
  editingId: number | null;
  onClose: () => void;
}

const NoticeEditModal = ({ mode, editingId, onClose }: Props) => {
  const [form, setForm] = useState<CreateAdminNoticeReq>(EMPTY_FORM);
  const [programRecommend, setProgramRecommend] = useState<ProgramRecommend>(
    defaultProgramRecommend,
  );
  const [moreButton, setMoreButton] = useState({ visible: false, url: '' });

  const detailQuery = useGetAdminNoticeDetail(editingId);
  const createMutation = useCreateAdminNoticeMutation();
  const updateMutation = useUpdateAdminNoticeMutation();

  useEffect(() => {
    if (!detailQuery.data || mode !== 'edit') return;
    const detail = detailQuery.data;
    setForm({
      type: detail.type ?? 'NOTICE',
      title: detail.title ?? '',
      url: detail.url ?? '',
    });
    if (detail.type === 'PROGRAM') {
      setProgramRecommend({
        list: (detail.programs ?? []).map((p) => ({
          programInfo: {
            id: p.programId,
            programType: p.programType ?? 'CHALLENGE',
            title: p.title,
            cta: p.cta,
            thumbnail: p.thumbnail ?? '',
          },
          classificationList: [],
          adminClassificationList: [],
          recommendTitle: p.title,
          recommendCTA: p.cta,
        })),
      });
      setMoreButton({
        visible: detail.isMoreVisible ?? false,
        url: detail.moreUrl ?? '',
      });
    }
  }, [detailQuery.data, mode]);

  const isProgramType = form.type === 'PROGRAM';

  const canSave = isProgramType
    ? programRecommend.list.length > 0 &&
      programRecommend.list.every(
        (item) => item.recommendTitle && item.recommendCTA,
      )
    : form.title.trim() !== '';

  const buildReqBody = (): CreateAdminNoticeReq => {
    if (isProgramType) {
      return {
        ...form,
        isMoreVisible: moreButton.visible,
        moreLink: moreButton.url,
        programs: programRecommend.list.map((item) => ({
          programId: item.programInfo.id,
          title: item.recommendTitle ?? '',
          cta: item.recommendCTA ?? '',
          thumbnail: item.programInfo.thumbnail ?? '',
        })),
      };
    }
    return form;
  };

  const handleSubmit = async () => {
    const body = buildReqBody();
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(body);
      } else if (mode === 'edit' && editingId !== null) {
        await updateMutation.mutateAsync({ id: editingId, ...body });
      }
      onClose();
    } catch {
      alert('공지를 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="overflow-y-auto p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {mode === 'create' ? '전체 공지 추가' : '전체 공지 수정'}
          </h2>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              콘텐츠 유형
            </label>
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as AdminNoticeType,
                }))
              }
            >
              <option value="" disabled>
                유형을 선택해주세요.
              </option>
              <option value="NOTICE">공지사항</option>
              <option value="GUIDE">가이드</option>
              <option value="PROGRAM">프로그램 추천</option>
            </select>
          </div>

          {!isProgramType && (
            <>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  제목
                </label>
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="제목"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  URL
                </label>
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, url: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          {isProgramType && (
            <>
              <ProgramRecommendEditor
                programRecommend={programRecommend}
                setProgramRecommend={setProgramRecommend}
              />
              <div className="mb-3 mt-4">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#4F5BDB]"
                    checked={moreButton.visible}
                    onChange={(e) =>
                      setMoreButton((prev) => ({
                        ...prev,
                        visible: e.target.checked,
                      }))
                    }
                  />
                  더보기 버튼 노출 여부
                </label>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2 text-sm disabled:bg-neutral-100"
                  placeholder="URL을 입력하세요"
                  value={moreButton.url}
                  disabled={!moreButton.visible}
                  onChange={(e) =>
                    setMoreButton((prev) => ({ ...prev, url: e.target.value }))
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-zinc-300 py-3 text-sm font-medium text-zinc-600 hover:bg-neutral-50"
          >
            취소하기
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !canSave || createMutation.isPending || updateMutation.isPending
            }
            className="flex-1 rounded bg-[#4F5BDB] py-3 text-sm font-medium text-white hover:opacity-80 disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeEditModal;
