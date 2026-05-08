import { ConfigProvider, theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ReactNode } from 'react';

export const PRIMARY_COLOR = '#047857';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorLink: PRIMARY_COLOR,
    colorLinkHover: '#065f46',
    colorLinkActive: '#064e3b',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  algorithm: antTheme.defaultAlgorithm,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
