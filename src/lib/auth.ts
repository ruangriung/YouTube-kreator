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
    const error: any = new Error(data.error || 'Autentikasi gagal atau tidak diizinkan');
    error.status = res.status;
    error.email = data.email;
    error.name = data.name;
    error.picture = data.picture;
    throw error;
  }

  const data = await res.json();
  cachedAccessToken = accessToken;
  cachedUser = data.user;
  localStorage.setItem('google_access_token', accessToken);
  localStorage.setItem('google_user', JSON.stringify(cachedUser));
  return data.user;
};

export const verifyLocalDevAccount = async () => {
  const mockUser = {
    email: 'developer@local.dev',
    name: 'Local Developer',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'ADMIN'
  };
  cachedAccessToken = 'local_dev_token';
  cachedUser = mockUser;
  localStorage.setItem('google_access_token', 'local_dev_token');
  localStorage.setItem('google_user', JSON.stringify(mockUser));
  return mockUser;
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

