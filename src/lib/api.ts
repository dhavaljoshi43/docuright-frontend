import AnonymousTracker from './anonymousTracking';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response = await fetch(url, options);

  // If 401, try to refresh token
  if (response.status === 401 && token) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Retry original request with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${data.accessToken}`
          };
          response = await fetch(url, options);
        } else {
          // Refresh failed, logout
          localStorage.clear();
          window.location.href = '/';
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  }

  return response;
}

export const generatePdf = async (documentType: string, data: any): Promise<Blob> => {
  const response = await fetch(`${API_URL}/api/${documentType}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error:", errorData);
    throw new Error('Failed to generate PDF');
  }

  return response.blob();
};