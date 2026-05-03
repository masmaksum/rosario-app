import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 60000,
});

// Intentions
export async function listIntentions(deviceId) {
  const { data } = await client.get(`/intentions`, { params: { device_id: deviceId } });
  return data;
}
export async function createIntention(deviceId, text, category) {
  const { data } = await client.post(`/intentions`, {
    device_id: deviceId,
    text,
    category: category || null,
  });
  return data;
}
export async function updateIntention(id, patch) {
  const { data } = await client.put(`/intentions/${id}`, patch);
  return data;
}
export async function deleteIntention(id) {
  const { data } = await client.delete(`/intentions/${id}`);
  return data;
}

// Sessions
export async function startSession(deviceId, mysteryId) {
  const { data } = await client.post(`/sessions`, { device_id: deviceId, mystery_id: mysteryId });
  return data;
}
export async function completeSession(sessionId) {
  const { data } = await client.post(`/sessions/${sessionId}/complete`);
  return data;
}
export async function listSessions(deviceId, limit = 100) {
  const { data } = await client.get(`/sessions`, { params: { device_id: deviceId, limit } });
  return data;
}
export async function deleteSession(sessionId) {
  const { data } = await client.delete(`/sessions/${sessionId}`);
  return data;
}
export async function getStats(deviceId) {
  const { data } = await client.get(`/sessions/stats`, { params: { device_id: deviceId } });
  return data;
}

// Audio
export async function listAudio(params = {}) {
  const { data } = await client.get(`/audio`, { params });
  return data;
}
export async function uploadAudio({ kind, ref_id, title, file }) {
  const fd = new FormData();
  fd.append("kind", kind);
  fd.append("ref_id", ref_id);
  if (title) fd.append("title", title);
  fd.append("file", file);
  const { data } = await client.post(`/audio/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
export async function deleteAudio(id) {
  const { data } = await client.delete(`/audio/${id}`);
  return data;
}
export function audioStreamUrl(id) {
  return `${API}/audio/${id}/stream`;
}

export default client;
