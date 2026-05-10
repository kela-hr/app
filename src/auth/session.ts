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

type ChromeRuntime = {
  sendMessage?: (...args: unknown[]) => void;
  lastError?: unknown;
};

const getChromeRuntime = (): ChromeRuntime | undefined =>
  (window as unknown as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime;

/**
 * Best-effort fire-and-await of a message to the installed Chrome extension.
 * Resolves on the extension's ack or after a short timeout (so a missing
 * extension doesn't block the caller). Never rejects.
 */
function postToExtension(payload: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    const chromeRuntime = getChromeRuntime();
    if (!chromeRuntime?.sendMessage) {
      resolve();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timer = window.setTimeout(finish, 1500);

    try {
      chromeRuntime.sendMessage(EXTENSION_ID, payload, () => {
        // Read lastError to silence "Unchecked runtime.lastError" warnings.
        void chromeRuntime.lastError;
        window.clearTimeout(timer);
        finish();
      });
    } catch {
      window.clearTimeout(timer);
      finish();
    }
  });
}

/** Push the JWT to the extension after a successful website login. */
export function syncToExtension(token: string, email: string): Promise<void> {
  return postToExtension({ type: 'kela_hr_login', token, email });
}

/** Tell the extension to drop its stored JWT (mirrors website logout). */
export function notifyExtensionLogout(): Promise<void> {
  return postToExtension({ type: 'kela_hr_logout' });
}
