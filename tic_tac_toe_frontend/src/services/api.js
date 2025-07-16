const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Helper for making authorized HTTP requests.
 */
async function apiRequest(endpoint, { method = "GET", body, token, json = true } = {}) {
  const headers = {};
  if (json && body) headers["Content-Type"] = "application/json";
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body ? { body: json ? JSON.stringify(body) : body } : {}),
    credentials: "include"
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw (data && data.detail ? new Error(data.detail) : new Error(res.statusText));
  return data;
}

/**
 * Auth actions
 */
 // PUBLIC_INTERFACE
export async function loginUser(username, password) {
  // FastAPI uses application/x-www-form-urlencoded for /login
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  params.append("grant_type", "password");

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error(data.detail || "Login failed");
  // Save token for future use
  localStorage.setItem("access_token", data.access_token);
  return data;
}

// PUBLIC_INTERFACE
export async function registerUser(username, password) {
  const user = await apiRequest("/users/", {
    method: "POST",
    body: { username, password }
  });
  return user;
}

// PUBLIC_INTERFACE
export async function getCurrentUser(token) {
  return apiRequest("/users/me", { token });
}

/**
 * Game actions
 */
// PUBLIC_INTERFACE
export async function createGame(player_x_id) {
  return apiRequest("/games/", {
    method: "POST",
    body: { player_x_id }
  });
}

// PUBLIC_INTERFACE
export async function joinGame(game_id) {
  return apiRequest("/games/join", {
    method: "POST",
    body: { game_id }
  });
}

// PUBLIC_INTERFACE
export async function makeMove(game_id, position) {
  return apiRequest(`/games/${game_id}/move`, {
    method: "POST",
    body: { position }
  });
}

// PUBLIC_INTERFACE
export async function getGameStatus(game_id) {
  return apiRequest(`/games/${game_id}/status`);
}

// PUBLIC_INTERFACE
export async function getGameHistory() {
  return apiRequest(`/users/me/history`);
}
