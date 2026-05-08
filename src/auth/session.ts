import { EXTENSION_ID } from '@/config';

const TOKEN_KEY = 'kela_hr_token';
const EMAIL_KEY = 'kela_hr_email';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setSession(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clear(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Best-effort: sync the JWT to the installed Chrome extension(s).
// Silently no-ops if chrome.runtime isn't available or sendMessage rejects.
export function syncToExtension(token: string, email: string): void {
  const chromeRuntime = (window as unknown as {
    chrome?: { runtime?: { sendMessage?: (...args: unknown[]) => void } };
  }).chrome?.runtime;
  if (!chromeRuntime?.sendMessage) return;

  try {
    chromeRuntime.sendMessage(
      EXTENSION_ID,
      { type: 'kela_hr_login', token, email },
      () => {
        // Read lastError to silence "Unchecked runtime.lastError" warnings.
        void (window as unknown as { chrome?: { runtime?: { lastError?: unknown } } })
          .chrome?.runtime?.lastError;
      },
    );
  } catch {
    // ignore — extension not installed or sendMessage threw
  }
}
