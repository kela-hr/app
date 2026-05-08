import { publicJson } from '@/api/client';

export async function requestOtp(email: string): Promise<void> {
  await publicJson<unknown>('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<{ token: string; email: string }> {
  return publicJson<{ token: string; email: string }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}
