import { apiRequest, setToken } from "./api";

export async function loginRequest({ email, password }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function registerRequest({ name, email, password }) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function fetchCurrentUser() {
  const data = await apiRequest("/auth/me");
  return data.user;
}

export function logoutRequest() {
  setToken(null);
}