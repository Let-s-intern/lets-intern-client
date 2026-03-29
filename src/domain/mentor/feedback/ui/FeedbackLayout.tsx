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
      className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-2 md:flex-row md:gap-6 md:px-6 md:pb-6"
      style={{ height: 'calc(100% - 72px)' }}
    >
      {/* Left panel: mentee list */}
      <div className="flex max-h-40 shrink-0 flex-col md:max-h-none md:w-56">
        {sidebar}
      </div>

      {/* Right panel: editor area - takes remaining space */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
        {/* Navigation + Mentee info */}
        <div className="flex shrink-0 flex-col">
          {navigation}
          {menteeInfo}
        </div>

        {/* Feedback editor - flex-1 to fill remaining height */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {editor}
        </div>

        {/* Actions */}
        <div className="shrink-0">{actions}</div>
      </div>
    </div>
  );
};

export default FeedbackLayout;
