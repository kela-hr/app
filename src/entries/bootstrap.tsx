import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/styles/theme';
import { AppLayout } from '@/components/AppLayout';
import '@/styles/globals.css';

export function mount(node: ReactNode) {
  const el = document.getElementById('root');
  if (!el) throw new Error('#root not found');
  createRoot(el).render(
    <StrictMode>
      <ThemeProvider>
        <AppLayout>{node}</AppLayout>
      </ThemeProvider>
    </StrictMode>,
  );
}
