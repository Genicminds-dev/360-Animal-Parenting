import {jwtDecode} from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

export const getId = () => {
  const decoded = getDecodedToken();
  return decoded?.id || null;
};
