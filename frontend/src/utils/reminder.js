// Helpers for daily prayer reminder (local Notification API).
// True push notifications (server-triggered) require VAPID + Service Worker —
// documented as future work. For MVP: reminder fires only while the app is open
// and on-next-open if the user missed the reminder time for that day.

const LAST_NOTIF_KEY = "rosario:reminderLastShown"; // YYYY-MM-DD
const LAST_PRAYED_KEY = "rosario:lastPrayedDate"; // YYYY-MM-DD

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseHHMM(s) {
  if (!s) return [0, 0];
  const [h, m] = s.split(":").map((x) => parseInt(x, 10));
  return [isNaN(h) ? 0 : h, isNaN(m) ? 0 : m];
}

export function getLastPrayedDate() {
  return localStorage.getItem(LAST_PRAYED_KEY);
}
export function markPrayedToday() {
  localStorage.setItem(LAST_PRAYED_KEY, todayKey());
}

export function getLastNotifDate() {
  return localStorage.getItem(LAST_NOTIF_KEY);
}
export function markNotifShownToday() {
  localStorage.setItem(LAST_NOTIF_KEY, todayKey());
}

/**
 * Should the reminder banner / notification be shown right now?
 * Rules:
 *  - reminder feature enabled
 *  - current local time is at or past reminderTime
 *  - user has NOT prayed today
 *  - notification/banner has NOT been shown today
 */
export function shouldShowReminderNow(settings, now = new Date()) {
  if (!settings?.reminderEnabled) return false;
  const [rh, rm] = parseHHMM(settings.reminderTime);
  const reminderMinutes = rh * 60 + rm;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < reminderMinutes) return false;
  const today = todayKey(now);
  if (getLastPrayedDate() === today) return false;
  if (getLastNotifDate() === today) return false;
  return true;
}

/**
 * Try to display a browser notification (if permission granted).
 * Returns true if shown.
 */
export function tryShowBrowserNotification() {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;
  try {
    new Notification("Waktunya berdoa Rosario", {
      body: "Mari menyediakan waktu sejenak bersama Bunda Maria.",
      tag: "rosario-daily-reminder",
      silent: false,
    });
    return true;
  } catch {
    return false;
  }
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const p = await Notification.requestPermission();
    return p;
  } catch {
    return "denied";
  }
}
