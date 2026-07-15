import type { Preview } from '@storybook/react-vite';

// packages/ui 컴포넌트는 Tailwind 클래스를 사용하므로 프리뷰에서 Tailwind를 주입한다.
import './tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
