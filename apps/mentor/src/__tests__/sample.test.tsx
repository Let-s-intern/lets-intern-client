import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('sample', () => {
  it('renders text', () => {
    render(<div>hello</div>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
