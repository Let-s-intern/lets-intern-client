import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LiveFeedbackIcon from '../LiveFeedbackIcon';
import LiveFeedbackOpenIcon from '../LiveFeedbackOpenIcon';
import WrittenFeedbackIcon from '../WrittenFeedbackIcon';

describe('FeedbackIcons', () => {
  it('LiveFeedbackIcon renders svg with correct viewBox', () => {
    const { container } = render(<LiveFeedbackIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20');
  });
  it('LiveFeedbackOpenIcon renders svg with correct viewBox', () => {
    const { container } = render(<LiveFeedbackOpenIcon />);
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(
      '0 0 20 20',
    );
  });
  it('WrittenFeedbackIcon renders svg with correct viewBox', () => {
    const { container } = render(<WrittenFeedbackIcon />);
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(
      '0 0 20 20',
    );
  });
  it('size prop controls width/height', () => {
    const { container } = render(<LiveFeedbackIcon size={24} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });
});
