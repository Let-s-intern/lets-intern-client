import type { ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** Navigation buttons (prev/next mentee) */
  navigation: ReactNode;
  /** Mentee info card */
  menteeInfo: ReactNode;
  /** Feedback editor */
  editor: ReactNode;
  /** Action buttons */
  actions: ReactNode;
}

const FeedbackLayout = ({
  sidebar,
  navigation,
  menteeInfo,
  editor,
  actions,
}: FeedbackLayoutProps) => {
  return (
    <div
      className="flex flex-1 flex-col px-4 pb-4 pt-2.5 md:flex-row md:px-10 md:pb-10"
      style={{ height: 'calc(100% - 72px)' }}
    >
      {/* Left panel: mentee list */}
      <div className="mb-3 flex max-h-40 shrink-0 flex-col md:mb-0 md:max-h-none md:w-60">
        {sidebar}
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden md:gap-5 md:pl-5">
        {/* Navigation + Mentee info */}
        <div className="flex flex-col">
          {navigation}
          {menteeInfo}
        </div>

        {/* Feedback editor */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
          {editor}
        </div>

        {/* Actions */}
        {actions}
      </div>
    </div>
  );
};

export default FeedbackLayout;
