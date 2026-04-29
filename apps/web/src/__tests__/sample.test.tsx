import { render, screen } from '@testing-library/react';

describe('sample', () => {
  it('renders text', () => {
    render(<div>hello</div>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
