export interface PriceInfo {
  title: string;
  originalPrice: number;
  discountAmount: number;
  description: string;
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LIGHT';
}
