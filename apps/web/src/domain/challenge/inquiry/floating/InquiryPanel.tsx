'use client';

import {
  QuestionItem,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useMyQuestionsQuery,
} from '@/domain/challenge/api/challengeQuestion';
import { twMerge } from '@/lib/twMerge';
import { Home, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import CancelInquiryDialog from './CancelInquiryDialog';
import InquiryComposer from './InquiryComposer';
import InquiryHome from './InquiryHome';
import InquiryList from './InquiryList';
import InquiryThread from './InquiryThread';

type Tab = 'home' | 'chat';
type View =
  | { name: 'tab' }
  | { name: 'compose' }
  | { name: 'thread'; id: number };

interface InquiryPanelProps {
  onMarkAsRead: (item: QuestionItem) => void;
  onClose: () => void;
}

const InquiryPanel = ({ onMarkAsRead, onClose }: InquiryPanelProps) => {
  const params = useParams<{ programId: string }>();
  const challengeId = Number(params.programId);

  const [tab, setTab] = useState<Tab>('home');
  const [cancelTarget, setCancelTarget] = useState<QuestionItem | null>(null);
  const [view, setView] = useState<View>({ name: 'tab' });

  const { data: questions = [], isLoading } = useMyQuestionsQuery(challengeId);
  const { mutate: createQuestion, isPending } =
    useCreateQuestionMutation(challengeId);
  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuestionMutation(challengeId);

  const openThread = (id: number) => {
    const item = questions.find((q: QuestionItem) => q.id === id);
    if (item) onMarkAsRead(item);
    setView({ name: 'thread', id });
  };
  const openComposer = () => setView({ name: 'compose' });
  const backToTab = () => setView({ name: 'tab' });

  const goTab = (next: Tab) => {
    setTab(next);
    setView({ name: 'tab' });
  };

  const thread =
    view.name === 'thread'
      ? questions.find((q: QuestionItem) => q.id === view.id)
      : undefined;

  return (
    <div className="fixed inset-0 z-40 md:inset-auto md:bottom-[90px] md:right-[26px]">
      <div className="shadow-05 bg-neutral-95 relative flex h-full w-full flex-col overflow-hidden md:h-[616px] md:w-[430px] md:rounded-[30px]">
        {view.name === 'compose' ? (
          <InquiryComposer
            isPending={isPending}
            onCancel={backToTab}
            onClose={onClose}
            onSubmit={(data) =>
              createQuestion(data, {
                onSuccess: () => {
                  setTab('chat');
                  backToTab();
                },
              })
            }
          />
        ) : view.name === 'thread' && thread ? (
          <InquiryThread
            item={thread}
            onRequestCancel={() => setCancelTarget(thread)}
            onBack={backToTab}
            onClose={onClose}
          />
        ) : tab === 'home' ? (
          <InquiryHome
            questions={questions}
            isLoading={isLoading}
            onClose={onClose}
            onStart={openComposer}
            onOpenThread={openThread}
            onRequestCancel={setCancelTarget}
          />
        ) : (
          <InquiryList
            questions={questions}
            isLoading={isLoading}
            onClose={onClose}
            onStart={openComposer}
            onOpenThread={openThread}
          />
        )}

        {view.name === 'tab' && (
          <nav className="border-neutral-85 bg-static-100 flex shrink-0 border-t">
            <TabButton
              label="홈"
              isActive={tab === 'home'}
              onClick={() => goTab('home')}
              icon={<Home className="h-6 w-6" />}
            />
            <TabButton
              label="대화"
              isActive={tab === 'chat'}
              onClick={() => goTab('chat')}
              icon={<MessageCircle className="h-6 w-6" />}
            />
          </nav>
        )}

        {cancelTarget && (
          <CancelInquiryDialog
            item={cancelTarget}
            isPending={isDeleting}
            onCancel={() => setCancelTarget(null)}
            onConfirm={() =>
              deleteQuestion(cancelTarget.id, {
                onSuccess: () => {
                  setCancelTarget(null);
                  backToTab();
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
};

const TabButton = ({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={twMerge(
      'flex flex-1 flex-col items-center gap-0.5 py-2.5',
      isActive ? 'text-primary' : 'text-neutral-45',
    )}
  >
    {icon}
    <span className="text-xxsmall12 font-medium">{label}</span>
  </button>
);

export default InquiryPanel;
