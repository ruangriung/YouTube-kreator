let cachedAccessToken: string | null = null;
let cachedUser: any = null;

// Initialize from local storage
if (typeof window !== 'undefined') {
  const t = localStorage.getItem('google_access_token');
  const u = localStorage.getItem('google_user');
  if (t && u) {
    cachedAccessToken = t;
    try {
      cachedUser = JSON.parse(u);
    } catch {}
  }
}

export const initAuth = async (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (cachedAccessToken && cachedUser) {
    if (onAuthSuccess) onAuthSuccess(cachedUser, cachedAccessToken);
  } else {
    if (onAuthFailure) onAuthFailure();
  }
};

export const verifyAccount = async (accessToken: string) => {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Autentikasi gagal atau tidak diizinkan');
  }

  const data = await res.json();
  cachedAccessToken = accessToken;
  cachedUser = data.user;
  localStorage.setItem('google_access_token', accessToken);
  localStorage.setItem('google_user', JSON.stringify(cachedUser));
  return data.user;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  cachedAccessToken = null;
  cachedUser = null;
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('google_user');
  window.location.reload();
};

