import axios from 'axios';

class ApiClient {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      timeout: 10000,
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // CRITICAL FIX: Don't intercept auth endpoints
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');
        
        // Check if error is 401 and we haven't already tried to refresh
        // AND it's not an auth endpoint
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          if (this.isRefreshing) {
            // If we're already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            console.log('🔄 Attempting token refresh...');

            // Call refresh token endpoint - use vanilla axios to avoid interceptor
            const response = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/auth/refresh`,
              { refreshToken },
              { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000 
              }
            );

            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            console.log('✅ Token refresh successful');

            // Update stored tokens
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Process failed queue
            this.processQueue(null, newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);

          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            
            // Process failed queue with error
            this.processQueue(refreshError, null);
            
            // Clear tokens and redirect to login
            this.handleAuthFailure();
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  handleAuthFailure() {
    console.log('🚪 Handling auth failure - clearing tokens and redirecting');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Small delay to ensure cleanup completes
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }

  // Helper methods for different HTTP methods
  get(url, config = {}) {
    return this.instance.get(url, config);
  }

  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.instance.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;