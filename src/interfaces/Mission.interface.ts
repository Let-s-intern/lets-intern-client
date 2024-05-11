export interface IMissionTemplate {
  id: number;
  type: string;
  topic: string;
  status: string;
  title: string;
  contents: string;
  guide: string;
  template: string;
  comments: string;
  startDate: string;
  endDate: string;
  refund: number;
  refundTotal: number;
  essentialContentsTopic: string;
  additionalContentsTopic: string;
  limitedContentsTopic: null;
}
