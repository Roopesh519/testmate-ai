// utils/fetchWithRefresh.js
export async function fetchWithRefresh(url, options = {}) {
    let token = localStorage.getItem('accessToken');
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = `Bearer ${token}`;
  
    let res = await fetch(url, {
      ...options,
      credentials: 'include', // important for cookie (refreshToken)
    });
  
    if (res.status === 401 || res.status === 403) {
      // Try to get new access token using refresh token
      const refreshRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Send refreshToken cookie
      });
  
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.accessToken);
  
        // Retry original request with new token
        options.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        // Refresh failed, force logout
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // Or navigate programmatically
        return;
      }
    }
  
    return res;
  }
  