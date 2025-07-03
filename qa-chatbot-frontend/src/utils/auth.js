// src/utils/auth.js
export function getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  
  export function setAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }
  
  export function removeAccessToken() {
    localStorage.removeItem('accessToken');
  }
  